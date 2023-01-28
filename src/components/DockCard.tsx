import type { Dock } from "@prisma/client";
import format from "date-fns/format";
import Image from "next/image";

import { Dock as DockComponent } from "./Dock";

export function DockCard({ dock }: { dock: Dock }) {
  return (
    <div key={dock.id} className={"flex flex-col"}>
      <p className="mb-2 text-sm text-gray-600">
        <a
          className="hover:underline"
          href={`https://twitter.com/${dock.user.username}`}
        >
          @{dock.user.username}
        </a>{" "}
        &sdot; {format(dock.createdAt, "MMM d, y")}
      </p>

      <div className="relative flex justify-center gap-12">
        <div className="absolute top-1/2 left-0 z-10 -translate-x-1/2 -translate-y-1/2 text-gray-600">
          {/* TODO: Use placeholder image for null values */}
          {/* TODO: On hover show tooltip of name */}
          <Image
            src={dock.user.avatarUrl ?? ""}
            alt={`${dock.user.name}'s avatar`}
            width={80}
            height={80}
            className={"rounded-full"}
          />
        </div>

        <a
          className="h-64 w-full rounded-3xl border border-solid border-gray-600/60 bg-mojave bg-cover bg-center opacity-60 transition-opacity duration-300 ease-in-out hover:opacity-100"
          href={`/users/${dock.user.username}`}
        />

        <div className="absolute bottom-4 max-w-full px-8">
          <DockComponent
            apps={dock.dockItems.map((dockItem) => dockItem.app)}
          />
        </div>
      </div>
    </div>
  );
}
