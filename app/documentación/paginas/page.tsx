'use client';

import { FileText, Route, Code, Database, Shield, Palette, Settings, Globe } from 'lucide-react';

export default function PaginasPage() {
    const pageStructure = [
        {
            title: 'Páginas Públicas',
            description: 'Accesibles sin autenticación',
            icon: <Globe className="w-6 h-6" />,
            pages: [
                { name: 'Login', path: '/login', description: 'Autenticación de usuarios' },
                { name: 'Landing', path: '/', description: 'Página principal del sistema' }
            ]
        },
        {
            title: 'Páginas de Usuario',
            description: 'Requieren autenticación',
            icon: <Shield className="w-6 h-6" />,
            pages: [
                { name: 'Dashboard', path: '/dashboard', description: 'Panel principal de usuario' },
                { name: 'Perfil', path: '/perfil', description: 'Gestión de perfil personal' },
                { name: 'Configuración', path: '/configuracion', description: 'Ajustes del usuario' }
            ]
        },
        {
            title: 'Páginas de Administración',
            description: 'Solo para administradores',
            icon: <Settings className="w-6 h-6" />,
            pages: [
                { name: 'Usuarios', path: '/admin/usuarios', description: 'Gestión de usuarios del sistema' },
                { name: 'Auditoría', path: '/dashboard?tab=audit', description: 'Logs de auditoría' },
                { name: 'Analíticas', path: '/dashboard?tab=analytics', description: 'Métricas del sistema' }
            ]
        },
        {
            title: 'Páginas de Documentación',
            description: 'Información del sistema',
            icon: <FileText className="w-6 h-6" />,
            pages: [
                { name: 'Documentación', path: '/documentacion', description: 'Documentación principal' },
                { name: 'Documentación (tilde)', path: '/documentación', description: 'Documentación alternativa' }
            ]
        }
    ];

    const routingFeatures = [
        {
            title: 'Enrutamiento Dinámico',
            description: 'Rutas con parámetros variables',
            icon: <Route className="w-6 h-6" />,
            examples: [
                '/api/users/[id] - Usuario específico',
                '/documentacion/[...slug] - Documentación anidada',
                '/admin/usuarios/[userId] - Usuario admin específico'
            ]
        },
        {
            title: 'Middleware de Autenticación',
            description: 'Protección automática de rutas',
            icon: <Shield className="w-6 h-6" />,
            examples: [
                'Verificación de JWT',
                'Validación de roles',
                'Redirección automática',
                'Protección de API endpoints'
            ]
        },
        {
            title: 'Layouts Anidados',
            description: 'Estructura de páginas reutilizable',
            icon: <Code className="w-6 h-6" />,
            examples: [
                'Layout principal con header',
                'Layout de documentación con sidebar',
                'Layout de admin con navegación especial'
            ]
        }
    ];

    const navigationStructure = [
        {
            level: 'Navegación Principal',
            items: [
                { name: 'Dashboard', path: '/dashboard', icon: '📊' },
                { name: 'Servicios', path: '/dashboard?tab=services', icon: '🔧' },
                { name: 'Documentación', path: '/documentacion', icon: '📚' }
            ]
        },
        {
            level: 'Navegación de Usuario',
            items: [
                { name: 'Perfil', path: '/perfil', icon: '👤' },
                { name: 'Configuración', path: '/configuracion', icon: '⚙️' },
                { name: 'Notificaciones', path: '/notificaciones', icon: '🔔' }
            ]
        },
        {
            level: 'Navegación de Admin',
            items: [
                { name: 'Usuarios', path: '/admin/usuarios', icon: '👥' },
                { name: 'Analíticas', path: '/dashboard?tab=analytics', icon: '📈' },
                { name: 'Auditoría', path: '/dashboard?tab=audit', icon: '📋' }
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-8 h-8 text-accent-600" />
                    <h1 className="text-3xl font-bold text-secondary-900">Páginas y Rutas</h1>
                </div>
                <p className="text-lg text-secondary-600">
                    Estructura completa de páginas, rutas y navegación del sistema CAGPU.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-12">
                {pageStructure.map((section, index) => (
                    <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-accent-50 rounded-lg text-accent-600">
                                {section.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-900">{section.title}</h3>
                        </div>
                        <p className="text-secondary-600 mb-4">{section.description}</p>
                        <div className="space-y-3">
                            {section.pages.map((page, pageIndex) => (
                                <div key={pageIndex} className="border-l-2 border-accent-200 pl-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-secondary-900">{page.name}</h4>
                                            <p className="text-sm text-secondary-600">{page.description}</p>
                                        </div>
                                        <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-secondary-600">
                                            {page.path}
                                        </code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Características de Enrutamiento</h2>
                <div className="grid gap-6">
                    {routingFeatures.map((feature, index) => (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-secondary-900">{feature.title}</h3>
                            </div>
                            <p className="text-secondary-600 mb-4">{feature.description}</p>
                            <ul className="space-y-2">
                                {feature.examples.map((example, exampleIndex) => (
                                    <li key={exampleIndex} className="flex items-center gap-2 text-sm text-secondary-700">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        {example}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Estructura de Navegación</h2>
                <div className="grid gap-6">
                    {navigationStructure.map((nav, index) => (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-secondary-900 mb-4">{nav.level}</h3>
                            <div className="grid gap-3 md:grid-cols-3">
                                {nav.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <span className="text-lg">{item.icon}</span>
                                        <div className="flex-1">
                                            <div className="font-medium text-secondary-900">{item.name}</div>
                                            <code className="text-xs text-secondary-600 font-mono">{item.path}</code>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Database className="w-6 h-6 text-accent-600" />
                        <h3 className="text-xl font-semibold text-secondary-900">Estructura de Archivos</h3>
                    </div>
                    <div className="space-y-2 text-sm text-secondary-700">
                        <div>📁 app/</div>
                        <div className="ml-4">📁 dashboard/</div>
                        <div className="ml-4">📁 admin/</div>
                        <div className="ml-4">📁 documentacion/</div>
                        <div className="ml-4">📁 documentación/</div>
                        <div className="ml-4">📁 api/</div>
                        <div className="ml-4">📁 components/</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Code className="w-6 h-6 text-accent-600" />
                        <h3 className="text-xl font-semibold text-secondary-900">Tecnologías</h3>
                    </div>
                    <div className="space-y-2 text-sm text-secondary-700">
                        <div>• Next.js 14 App Router</div>
                        <div>• TypeScript para tipado</div>
                        <div>• Tailwind CSS para estilos</div>
                        <div>• shadcn/ui para componentes</div>
                        <div>• Middleware para autenticación</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
