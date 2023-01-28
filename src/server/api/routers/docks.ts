import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const docksRouter = createTRPCRouter({
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.dock.findUnique({ where: { id: input.id } });
    }),
  getFeatured: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.dock.findMany({
      where: { featured: true },
      include: {
        user: true,
        dockItems: {
          include: {
            app: true,
          },
          orderBy: { position: "asc" },
        },
      },
      orderBy: [
        { user: { twitterFollowerCount: "desc" } },
        { createdAt: "desc" },
      ],
    });
  }),
  createDock: protectedProcedure
    .input(
      z.object({
        apps: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.dock.deleteMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
      return ctx.prisma.dock.create({
        data: {
          user: {
            connect: {
              username: ctx.session.user.username,
            },
          },
          dockItems: {
            createMany: {
              data: input.apps.map((app, index) => ({
                appId: app,
                position: index,
              })),
            },
          },
        },
      });
    }),
});
