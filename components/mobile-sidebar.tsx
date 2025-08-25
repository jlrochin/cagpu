"use client"

// Removed hardcoded data import - now uses database data
import { ChevronRight, LayoutDashboard, Settings, User, Grid3x3 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileSidebar() {
  const pathname = usePathname()

  return (
    <div className="h-full py-6 px-4 bg-background">
      <div className="flex items-center gap-2 mb-8">
        <img 
          src="/logo_cagpu_sintexto.png" 
          alt="CAGPU Logo" 
          className="h-8 w-8 object-contain"
        />
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
          href="/servicios"
          className={`flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent text-foreground ${
            pathname === "/servicios" ? "bg-accent font-medium" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <Grid3x3 className="h-4 w-4" />
            <span>Servicios</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </nav>
    </div>
  )
}
