"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  ListChecks,
  Users,
  Package,
  LogOut,
  Settings,
  ChevronsUpDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, usePathname } from "@/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";

const sidebarVariants = {
  open: {
    width: "15rem",
  },
  closed: {
    width: "3.5rem",
  },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
};

const transitionProps: any = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

const navItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Listings', href: '/admin/listings', icon: ListChecks },
  { name: 'Sellers', href: '/admin/sellers', icon: Users },
  { name: 'Matches', href: '/admin/matches', icon: Package },
];

export function SessionNavBar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();
  const { data: session } = useSession();
  
  return (
    <motion.div
      className={cn(
        "sidebar fixed left-0 top-16 bottom-0 z-40 shrink-0 border-r bg-white dark:bg-black",
      )}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className={`relative z-40 flex text-muted-foreground h-full shrink-0 flex-col bg-white dark:bg-black transition-all`}
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">
            <div className="flex h-[64px] w-full shrink-0 border-b p-2 items-center">
              <div className="mt-[1.5px] flex w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex w-fit items-center gap-2 px-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-navy text-white shrink-0">
                    <span className="font-bold">TX</span>
                  </div>
                  <motion.li
                    variants={variants}
                    className="flex w-fit items-center gap-2"
                  >
                    {!isCollapsed && (
                      <p className="text-sm font-bold text-brand-navy whitespace-nowrap overflow-hidden text-ellipsis">
                        Admin Console
                      </p>
                    )}
                  </motion.li>
                </Button>
              </div>
            </div>

            <div className="flex h-full w-full flex-col">
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className={cn("flex w-full flex-col gap-1")}>
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "flex h-10 w-full flex-row items-center rounded-md px-2.5 py-1.5 transition-colors hover:bg-muted hover:text-brand-navy",
                            isActive && "bg-orange-50 text-brand-orange hover:bg-orange-100 hover:text-brand-orange",
                          )}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          <motion.li variants={variants} className="overflow-hidden">
                            {!isCollapsed && (
                              <p className="ml-3 text-sm font-medium whitespace-nowrap">
                                {item.name}
                              </p>
                            )}
                          </motion.li>
                        </Link>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
              
              <div className="flex flex-col p-2 border-t border-slate-100">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className="w-full">
                    <div className="flex h-12 w-full flex-row items-center gap-2 rounded-md px-2 transition-colors hover:bg-muted hover:text-brand-navy">
                      <Avatar className="size-8 shrink-0">
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback>
                          {session?.user?.name?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <motion.li
                        variants={variants}
                        className="flex w-full items-center gap-2 overflow-hidden"
                      >
                        {!isCollapsed && (
                          <>
                            <p className="text-sm font-medium truncate">
                              {session?.user?.name || "Admin"}
                            </p>
                            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/50" />
                          </>
                        )}
                      </motion.li>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent sideOffset={5} className="w-56">
                    <div className="flex flex-row items-center gap-2 p-2">
                      <Avatar className="size-8">
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback>
                          {session?.user?.name?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-left overflow-hidden">
                        <span className="text-sm font-medium truncate">
                          {session?.user?.name || "Administrator"}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {session?.user?.email || "admin@tixly.com"}
                        </span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex items-center gap-2 text-red-600 focus:text-red-700 cursor-pointer"
                      onClick={() => signOut({ callbackUrl: '/' })}
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}
