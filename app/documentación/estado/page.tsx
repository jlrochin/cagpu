'use client';

import { Layers, Database, Activity, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function EstadoPage() {
    const stateManagement = [
        {
            title: 'Estado Local de Componentes',
            description: 'Estado interno de componentes React',
            icon: <Layers className="w-6 h-6" />,
            examples: [
                'useState para datos locales',
                'useEffect para efectos secundarios',
                'useRef para referencias DOM',
                'useCallback para optimización'
            ]
        },
        {
            title: 'Estado Global de la Aplicación',
            description: 'Estado compartido entre componentes',
            icon: <Database className="w-6 h-6" />,
            examples: [
                'Context API para temas',
                'LocalStorage para persistencia',
                'Cookies para sesiones',
                'Estado de autenticación'
            ]
        },
        {
            title: 'Estado del Servidor',
            description: 'Datos del backend y API',
            icon: <Activity className="w-6 h-6" />,
            examples: [
                'Fetch de datos de usuarios',
                'CRUD de servicios',
                'Logs de auditoría',
                'Métricas del sistema'
            ]
        }
    ];

    const dataFlow = [
        {
            stage: 'Entrada de Datos',
            description: 'Captura de información del usuario',
            icon: <CheckCircle className="w-5 h-5 text-green-600" />,
            examples: [
                'Formularios de login',
                'Creación de servicios',
                'Actualización de perfiles',
                'Búsquedas y filtros'
            ]
        },
        {
            stage: 'Validación',
            description: 'Verificación de integridad de datos',
            icon: <CheckCircle className="w-5 h-5 text-green-600" />,
            examples: [
                'Validación de campos requeridos',
                'Verificación de formatos',
                'Validación de permisos',
                'Sanitización de inputs'
            ]
        },
        {
            stage: 'Procesamiento',
            description: 'Transformación y lógica de negocio',
            icon: <RefreshCw className="w-5 h-5 text-blue-600" />,
            examples: [
                'Cálculos de métricas',
                'Filtrado de resultados',
                'Ordenamiento de datos',
                'Agregación de información'
            ]
        },
        {
            stage: 'Almacenamiento',
            description: 'Persistencia de datos',
            icon: <Database className="w-5 h-5 text-purple-600" />,
            examples: [
                'Base de datos PostgreSQL',
                'Cache en memoria',
                'Archivos de configuración',
                'Logs del sistema'
            ]
        }
    ];

    const performanceOptimization = [
        {
            technique: 'Memoización',
            description: 'Evitar recálculos innecesarios',
            benefit: 'Mejora rendimiento de componentes',
            implementation: 'useMemo, useCallback, React.memo'
        },
        {
            technique: 'Lazy Loading',
            description: 'Carga diferida de componentes',
            benefit: 'Reducción del bundle inicial',
            implementation: 'React.lazy, dynamic imports'
        },
        {
            technique: 'Virtualización',
            description: 'Renderizado eficiente de listas',
            benefit: 'Mejor rendimiento con muchos elementos',
            implementation: 'react-window, react-virtualized'
        },
        {
            technique: 'Debouncing',
            description: 'Limitación de llamadas a API',
            benefit: 'Reducción de requests innecesarios',
            implementation: 'useDebounce hook, lodash.debounce'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Layers className="w-8 h-8 text-accent-600" />
                    <h1 className="text-3xl font-bold text-secondary-900">Estado y Gestión de Datos</h1>
                </div>
                <p className="text-lg text-secondary-600">
                    Arquitectura de gestión de estado, flujo de datos y optimización de rendimiento del sistema CAGPU.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-12">
                {stateManagement.map((management, index) => (
                    <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-accent-50 rounded-lg text-accent-600">
                                {management.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-900">{management.title}</h3>
                        </div>
                        <p className="text-secondary-600 mb-4">{management.description}</p>
                        <ul className="space-y-2">
                            {management.examples.map((example, exampleIndex) => (
                                <li key={exampleIndex} className="flex items-center gap-2 text-sm text-secondary-700">
                                    <div className="w-1.5 h-1.5 bg-accent-500 rounded-full"></div>
                                    {example}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Flujo de Datos</h2>
                <div className="grid gap-6">
                    {dataFlow.map((flow, index) => (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-slate-100 rounded-lg flex-shrink-0">
                                    {flow.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-xl font-semibold text-secondary-900">{flow.stage}</h3>
                                        <span className="px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-sm font-medium">
                                            Paso {index + 1}
                                        </span>
                                    </div>
                                    <p className="text-secondary-600 mb-4">{flow.description}</p>
                                    <ul className="space-y-2">
                                        {flow.examples.map((example, exampleIndex) => (
                                            <li key={exampleIndex} className="flex items-center gap-2 text-sm text-secondary-700">
                                                <div className="w-1.5 h-1.5 bg-accent-500 rounded-full"></div>
                                                {example}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Optimización de Rendimiento</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {performanceOptimization.map((optimization, index) => (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-secondary-900 mb-2">{optimization.technique}</h3>
                                <p className="text-secondary-600 mb-3">{optimization.description}</p>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                                    <div className="text-sm font-medium text-green-800">Beneficio:</div>
                                    <div className="text-sm text-green-700">{optimization.benefit}</div>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="text-sm font-medium text-blue-800">Implementación:</div>
                                    <div className="text-sm text-blue-700 font-mono">{optimization.implementation}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-6 h-6 text-accent-600" />
                        <h3 className="text-xl font-semibold text-secondary-900">Métricas de Rendimiento</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-secondary-700">Tiempo de Carga</span>
                            <span className="text-sm font-medium text-green-600">&lt; 2s</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-secondary-700">Tiempo de Respuesta</span>
                            <span className="text-sm font-medium text-green-600">&lt; 200ms</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-secondary-700">Bundle Size</span>
                            <span className="text-sm font-medium text-green-600">&lt; 500KB</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-secondary-700">Lighthouse Score</span>
                            <span className="text-sm font-medium text-green-600">90+</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-6 h-6 text-accent-600" />
                        <h3 className="text-xl font-semibold text-secondary-900">Estrategias de Cache</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="text-sm text-secondary-700">
                            <strong>Cache del Navegador:</strong> Assets estáticos
                        </div>
                        <div className="text-sm text-secondary-700">
                            <strong>Cache de API:</strong> Respuestas frecuentes
                        </div>
                        <div className="text-sm text-secondary-700">
                            <strong>Cache de Estado:</strong> Datos de usuario
                        </div>
                        <div className="text-sm text-secondary-700">
                            <strong>Cache de Componentes:</strong> Renderizado optimizado
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
