'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BookOpen,
    Database,
    Shield,
    Code,
    Palette,
    FileText,
    Layers,
    Wrench,
    Settings,
    Server,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';

const navigation = [
    {
        id: 'arquitectura',
        title: 'Arquitectura del Sistema',
        icon: <Layers className="w-5 h-5" />,
        href: '/documentación/arquitectura'
    },
    {
        id: 'base-datos',
        title: 'Base de Datos',
        icon: <Database className="w-5 h-5" />,
        href: '/documentación/base-datos'
    },
    {
        id: 'autenticacion',
        title: 'Autenticación y Autorización',
        icon: <Shield className="w-5 h-5" />,
        href: '/documentación/autenticacion'
    },
    {
        id: 'api',
        title: 'API y Endpoints',
        icon: <Code className="w-5 h-5" />,
        href: '/documentación/api'
    },
    {
        id: 'componentes',
        title: 'Componentes de la Interfaz',
        icon: <Palette className="w-5 h-5" />,
        href: '/documentación/componentes'
    },
    {
        id: 'paginas',
        title: 'Páginas y Rutas',
        icon: <FileText className="w-5 h-5" />,
        href: '/documentación/paginas'
    },
    {
        id: 'estado',
        title: 'Estado y Gestión de Datos',
        icon: <Layers className="w-5 h-5" />,
        href: '/documentación/estado'
    },
    {
        id: 'utilidades',
        title: 'Utilidades y Helpers',
        icon: <Wrench className="w-5 h-5" />,
        href: '/documentación/utilidades'
    },
    {
        id: 'despliegue',
        title: 'Despliegue y Configuración',
        icon: <Server className="w-5 h-5" />,
        href: '/documentación/despliegue'
    },
    {
        id: 'mantenimiento',
        title: 'Mantenimiento y Operaciones',
        icon: <Settings className="w-5 h-5" />,
        href: '/documentación/mantenimiento'
    }
];

export default function DocumentacionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="h-screen bg-slate-50">
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 bg-white rounded-lg shadow-lg border border-slate-200"
                >
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                        <BookOpen className="w-6 h-6 text-accent-600" />
                        <span className="font-semibold text-secondary-900">Documentación</span>
                    </div>
                </div>

                <nav className="mt-6 px-3">
                    <div className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive
                                            ? 'bg-accent-600 text-white'
                                            : 'text-secondary-700 hover:bg-slate-100 hover:text-secondary-900'
                                        }
                  `}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.title}
                                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Back to main app */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
                    <Link
                        href="/dashboard"
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-secondary-600 bg-slate-50 rounded-lg hover:bg-slate-100 hover:text-secondary-900 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                        Volver a la aplicación
                    </Link>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64 h-screen">
                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <main className="h-full overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
