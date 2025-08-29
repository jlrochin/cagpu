'use client';

import { Palette, Code, Layout, Zap, Smartphone, Monitor, Settings, Eye } from 'lucide-react';

export default function ComponentesPage() {
    const uiComponents = [
        {
            title: 'Componentes de Navegación',
            description: 'Elementos de navegación y estructura',
            icon: <Layout className="w-6 h-6" />,
            components: [
                'Header con logo y menú de usuario',
                'Sidebar de navegación principal',
                'Breadcrumbs para navegación',
                'Tabs para organización de contenido'
            ]
        },
        {
            title: 'Formularios y Controles',
            description: 'Componentes para entrada de datos',
            icon: <Code className="w-6 h-6" />,
            components: [
                'Inputs con validación',
                'Selects y dropdowns',
                'Checkboxes y radio buttons',
                'Botones con variantes'
            ]
        },
        {
            title: 'Componentes de Datos',
            description: 'Visualización y gestión de información',
            icon: <Eye className="w-6 h-6" />,
            components: [
                'Tablas con paginación',
                'Cards para información',
                'Modales y diálogos',
                'Tooltips y popovers'
            ]
        },
        {
            title: 'Componentes de Estado',
            description: 'Indicadores de estado y feedback',
            icon: <Zap className="w-6 h-6" />,
            components: [
                'Loading spinners',
                'Alertas y notificaciones',
                'Progress bars',
                'Skeletons para carga'
            ]
        }
    ];

    const responsiveFeatures = [
        {
            title: 'Mobile First',
            description: 'Diseño optimizado para dispositivos móviles',
            icon: <Smartphone className="w-5 h-5" />,
            features: [
                'Sidebar colapsable en móvil',
                'Navegación adaptativa',
                'Touch-friendly controls',
                'Optimización de espacio'
            ]
        },
        {
            title: 'Responsive Design',
            description: 'Adaptación automática a diferentes pantallas',
            icon: <Monitor className="w-5 h-5" />,
            features: [
                'Grid system flexible',
                'Breakpoints optimizados',
                'Imágenes adaptativas',
                'Tipografía responsive'
            ]
        }
    ];

    const designSystem = [
        {
            category: 'Colores',
            description: 'Paleta de colores consistente',
            values: [
                'Primary: #4b5563 (gris)',
                'Secondary: #374151 (gris oscuro)',
                'Accent: #dc2626 (rojo)',
                'Success: #10B981 (verde)',
                'Warning: #F59E0B (amarillo)',
                'Error: #ef4444 (rojo claro)'
            ]
        },
        {
            category: 'Tipografía',
            description: 'Sistema de fuentes coherente',
            values: [
                'Títulos: text-3xl, text-2xl, text-xl',
                'Cuerpo: text-base, text-sm',
                'Énfasis: font-medium, font-semibold',
                'Monospace: font-mono para código'
            ]
        },
        {
            category: 'Espaciado',
            description: 'Sistema de espaciado consistente',
            values: [
                'Padding: p-2, p-4, p-6, p-8',
                'Margin: m-2, m-4, m-6, m-8',
                'Gap: gap-2, gap-4, gap-6, gap-8',
                'Border radius: rounded, rounded-lg, rounded-xl'
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Palette className="w-8 h-8 text-accent-600" />
                    <h1 className="text-3xl font-bold text-secondary-900">Componentes de la Interfaz</h1>
                </div>
                <p className="text-lg text-secondary-600">
                    Biblioteca completa de componentes reutilizables para construir interfaces consistentes y accesibles.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-12">
                {uiComponents.map((component, index) => (
                    <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-accent-50 rounded-lg text-accent-600">
                                {component.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-900">{component.title}</h3>
                        </div>
                        <p className="text-secondary-600 mb-4">{component.description}</p>
                        <ul className="space-y-2">
                            {component.components.map((comp, compIndex) => (
                                <li key={compIndex} className="flex items-center gap-2 text-sm text-secondary-700">
                                    <div className="w-1.5 h-1.5 bg-accent-500 rounded-full"></div>
                                    {comp}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Características Responsivas</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {responsiveFeatures.map((feature, index) => (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-secondary-900">{feature.title}</h3>
                            </div>
                            <p className="text-secondary-600 mb-4">{feature.description}</p>
                            <ul className="space-y-2">
                                {feature.features.map((feat, featIndex) => (
                                    <li key={featIndex} className="flex items-center gap-2 text-sm text-secondary-700">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Sistema de Diseño</h2>
                <div className="grid gap-6">
                    {designSystem.map((system, index) => (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold text-secondary-900">{system.category}</h3>
                                <p className="text-secondary-600">{system.description}</p>
                            </div>
                            <div className="grid gap-2 md:grid-cols-2">
                                {system.values.map((value, valueIndex) => (
                                    <div key={valueIndex} className="bg-slate-50 px-3 py-2 rounded-lg">
                                        <code className="text-sm font-mono text-secondary-700">{value}</code>
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
                        <Settings className="w-6 h-6 text-accent-600" />
                        <h3 className="text-xl font-semibold text-secondary-900">Configuración</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="text-sm text-secondary-700">
                            <strong>Tailwind CSS:</strong> Framework de utilidades
                        </div>
                        <div className="text-sm text-secondary-700">
                            <strong>shadcn/ui:</strong> Componentes base
                        </div>
                        <div className="text-sm text-secondary-700">
                            <strong>Lucide Icons:</strong> Iconografía consistente
                        </div>
                        <div className="text-sm text-secondary-700">
                            <strong>CSS Variables:</strong> Temas dinámicos
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Code className="w-6 h-6 text-accent-600" />
                        <h3 className="text-xl font-semibold text-secondary-900">Uso</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="text-sm text-secondary-700">
                            <strong>Importar:</strong> Desde @/components/ui
                        </div>
                        <div className="text-sm text-secondary-700">
                            <strong>Props:</strong> Configuración flexible
                        </div>
                        <div className="text-sm text-secondary-700">
                            <strong>Composición:</strong> Combinar componentes
                        </div>
                        <div className="text-sm text-secondary-700">
                            <strong>Personalización:</strong> CSS y Tailwind
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
