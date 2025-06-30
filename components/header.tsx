"use client"

import { Menu, Settings, User } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsPopover } from "./notifications-popover"

export function Header() {
  const router = useRouter();

  // Lógica de cierre de sesión automático por inactividad
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        handleLogout();
      }, 5 * 60 * 1000); // 5 minutos
    };
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(timeout);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
    // eslint-disable-next-line
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("userChanged"));
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <img 
            src="/logo_cagpu_sintexto.png" 
            alt="CAGPU Logo" 
            className="h-8 w-8 object-contain !cursor-pointer"
          />
          <span className="font-semibold text-foreground hidden md:inline-block text-sm md:text-base">CAGPU</span>
          <span className="text-xs text-muted-foreground hidden lg:inline-block">
            Catálogo de Atención Generalizada a la Población Usuaria
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationsPopover />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full !cursor-pointer">
                <User className="h-5 w-5 text-foreground/60" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="!cursor-pointer">
                <Link href="/perfil" className={"!cursor-pointer"}>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="!cursor-pointer">
                <Link href="/configuracion" className={"!cursor-pointer"}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="!cursor-pointer bg-red-600 text-white hover:bg-red-700 hover:text-white focus:bg-red-700 focus:text-white dark:bg-red-600 dark:hover:bg-red-700 dark:focus:bg-red-700"
              >
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export function NavigationTabs() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRole(localStorage.getItem('role'));
    }
  }, []);

  const allTabs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Servicios", href: "/dashboard" },
    { label: "Analíticas", href: "/dashboard" },
    { label: "Administrador", href: "/dashboard" },
    { label: "Cambios Recientes", href: "/dashboard" },
    { label: "Auditoría", href: "/dashboard" },
  ];

  const userTabs = [
    { label: "Servicios", href: "/dashboard" },
  ];

  const tabs = role === 'user' ? userTabs : allTabs;

  return (
    <div className="tabs">
      {tabs.map(tab => (
        <Link
          key={tab.href + tab.label}
          href={tab.href}
          className={pathname === tab.href ? "tab-active" : "tab"}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
