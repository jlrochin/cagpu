"use client"

import { ClipboardList, Menu, Settings, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

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
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <ClipboardList className="h-4 w-4 text-white" />
          </div>
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
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5 text-foreground/60" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/perfil" className={""}>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/configuracion" className={""}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => window.location.href = '/login'}
                className="bg-red-600 text-white hover:bg-red-700 hover:text-white focus:bg-red-700 focus:text-white dark:bg-red-600 dark:hover:bg-red-700 dark:focus:bg-red-700"
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
