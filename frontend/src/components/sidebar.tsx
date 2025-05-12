"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  FileText,
  LogOut,
  User,
  Menu,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ThemeSwitch } from "./theme-switch";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Skills", href: "/skills", icon: Wrench },
  { name: "Resumes", href: "/resumes", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="flex h-14 items-center gap-4 border-b px-4">
        <h2 className="text-lg font-semibold">Portfolio Admin</h2>
      </div>

      {user && (
        <div className="border-b p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
              {isActive && (
                <motion.div
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  layoutId="sidebar-indicator"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-2 space-y-1">
        <ThemeSwitch />
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => logout()}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 h-full">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-64 flex-col border-r bg-card sticky top-0">
        <SidebarContent />
      </div>
    </>
  );
}
