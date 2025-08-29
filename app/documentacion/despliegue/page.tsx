'use client';

import { Server, Database, Shield, Code, Settings, Globe, Terminal, GitBranch } from 'lucide-react';

export default function DesplieguePage() {
    const deploymentSteps = [
        {
            title: 'Preparación del Entorno',
            description: 'Configuración inicial del servidor y dependencias',
            icon: <Settings className="w-6 h-6" />,
            steps: [
                'Instalación de Node.js 18+',
                'Configuración de PostgreSQL',
                'Variables de entorno',
                'Dependencias del sistema'
            ]
        },
        {
            title: 'Configuración de Base de Datos',
            description: 'Preparación y migración de la base de datos',
            icon: <Database className="w-6 h-6" />,
            steps: [
                'Crear base de datos PostgreSQL',
                'Configurar conexiones',
                'Ejecutar migraciones Prisma',
                'Verificar esquemas'
            ]
        },
        {
            title: 'Configuración de Seguridad',
            description: 'Implementación de medidas de seguridad',
            icon: <Shield className="w-6 h-6" />,
            steps: [
                'Configurar HTTPS/SSL',
                'Firewall y puertos',
                'Variables de entorno seguras',
                'Rate limiting'
            ]
        },
        {
            title: 'Build y Despliegue',
            description: 'Proceso de construcción y despliegue',
            icon: <Code className="w-6 h-6" />,
            steps: [
                'Build de producción',
                'Optimización de assets',
                'Configuración de PM2',
                'Reinicio de servicios'
            ]
        }
    ];

    const environments = [
        {
            name: 'Desarrollo Local',
            description: 'Entorno para desarrollo y testing',
            icon: <Terminal className="w-5 h-5" />,
            config: {
                'NODE_ENV': 'development',
                'PORT': '3000',
                'DATABASE_URL': 'postgresql://localhost:5432/cagpu_dev'
            }
        },
        {
            name: 'Staging',
            description: 'Entorno de pruebas previas a producción',
            icon: <GitBranch className="w-5 h-5" />,
            config: {
                'NODE_ENV': 'staging',
                'PORT': '3001',
                'DATABASE_URL': 'postgresql://staging:5432/cagpu_staging'
            }
        },
        {
            name: 'Producción',
            description: 'Entorno de producción para usuarios finales',
            icon: <Globe className="w-5 h-5" />,
            config: {
                'NODE_ENV': 'production',
                'PORT': '3000',
                'DATABASE_URL': 'postgresql://prod:5432/cagpu_prod'
            }
        }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Server className="w-8 h-8 text-accent-600" />
                    <h1 className="text-3xl font-bold text-secondary-900">Despliegue y Configuración</h1>
                </div>
                <p className="text-lg text-secondary-600">
                    Guía completa para el despliegue del sistema CAGPU en diferentes entornos.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-12">
                {deploymentSteps.map((step, index) => (
                    <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-accent-50 rounded-lg text-accent-600">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-900">{step.title}</h3>
                        </div>
                        <p className="text-secondary-600 mb-4">{step.description}</p>
                        <ol className="space-y-2">
                            {step.steps.map((stepItem, stepIndex) => (
                                <li key={stepIndex} className="flex items-start gap-2 text-sm text-secondary-700">
                                    <span className="flex-shrink-0 w-5 h-5 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center text-xs font-medium">
                                        {stepIndex + 1}
                                    </span>
                                    {stepItem}
                                </li>
                            ))}
                        </ol>
                    </div>
                ))}
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Configuración de Entornos</h2>
                <div className="grid gap-6">
                    {environments.map((env, index) => (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-slate-100 rounded-lg text-secondary-600">
                                    {env.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-secondary-900">{env.name}</h3>
                                    <p className="text-secondary-600">{env.description}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4">
                                <h4 className="font-medium text-secondary-800 mb-3">Variables de Entorno:</h4>
                                <div className="space-y-2">
                                    {Object.entries(env.config).map(([key, value]) => (
                                        <div key={key} className="flex items-center gap-2 text-sm">
                                            <code className="bg-white px-2 py-1 rounded border font-mono text-accent-600">
                                                {key}
                                            </code>
                                            <span className="text-secondary-500">=</span>
                                            <code className="bg-white px-2 py-1 rounded border font-mono text-secondary-600">
                                                {value}
                                            </code>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Comandos de Despliegue</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-secondary-800 mb-2">Instalación de Dependencias</h4>
                        <code className="block bg-white p-3 rounded-lg border font-mono text-sm">
                            npm install
                        </code>
                    </div>
                    <div>
                        <h4 className="font-medium text-secondary-800 mb-2">Build de Producción</h4>
                        <code className="block bg-white p-3 rounded-lg border font-mono text-sm">
                            npm run build
                        </code>
                    </div>
                    <div>
                        <h4 className="font-medium text-secondary-800 mb-2">Iniciar Servidor</h4>
                        <code className="block bg-white p-3 rounded-lg border font-mono text-sm">
                            npm start
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
}
