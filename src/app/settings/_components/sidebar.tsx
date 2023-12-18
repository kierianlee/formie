"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const sidearItems = [
  {
    label: "Teams",
    href: "/settings/teams",
  },
];

const SettingsLayoutSidebar = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="flex h-full flex-col gap-4 p-6">
        <div className="text-xs uppercase">Settings:</div>
        <div className="flex h-full flex-col gap-4">
          <div className="flex flex-1 flex-col space-y-2">
            {sidearItems.map((item, index) => (
              <Link
                href={item.href}
                key={index}
                className={cn(
                  "group rounded-md px-4 py-2 text-sm",
                  pathname.startsWith(item.href) &&
                    "bg-zinc-700/60 duration-300",
                )}
              >
                <span className="flex items-center">
                  <div
                    className={cn(
                      "mr-3 transition-all",
                      pathname.startsWith(item.href)
                        ? "text-foreground"
                        : "text-muted-foreground/40 group-hover:text-foreground",
                    )}
                  >
                    •
                  </div>
                  <div className="flex-1">{item.label}</div>
                </span>
              </Link>
            ))}
          </div>

          <hr />

          <div>
            <Button className="w-full text-xs" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsLayoutSidebar;
