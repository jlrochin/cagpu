"use client"

import { directionsData } from "@/lib/data"
import { ChevronRight, ClipboardList, LayoutDashboard, Settings, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileSidebar() {
  const pathname = usePathname()

  return (
    <div className="h-full py-6 px-4 bg-background">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
          <ClipboardList className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="font-semibold text-foreground">CAGPU</span>
          <p className="text-xs text-muted-foreground">Catálogo de Atención</p>
        </div>
      </div>
      <nav className="space-y-2">
        <Link
          href="/"
          className={`flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent text-foreground ${
            pathname === "/" ? "bg-accent font-medium" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link
          href="/perfil"
          className={`flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent text-foreground ${
            pathname === "/perfil" ? "bg-accent font-medium" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Perfil</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <Link
          href="/configuracion"
          className={`flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent text-foreground ${
            pathname === "/configuracion" ? "bg-accent font-medium" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Configuración</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
        <div className="text-sm font-medium text-muted-foreground mt-4 mb-2">Direcciones</div>
        {directionsData.map((direction) => (
          <Link
            key={direction.id}
            href={`/?tab=services&direction=${direction.id}`}
            className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent text-foreground"
          >
            <span>{direction.name}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </nav>
    </div>
  )
}
