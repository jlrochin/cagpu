'use client';

import { Shield, User, Lock, Key, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AutenticacionPage() {
    const authFeatures = [
        {
            title: 'Autenticación de Usuarios',
            description: 'Sistema de login y gestión de sesiones',
            icon: <User className="w-6 h-6" />,
            features: [
                'Login con credenciales',
                'Manejo de sesiones JWT',
                'Cierre de sesión automático',
                'Protección de rutas'
            ]
        },
        {
            title: 'Autorización y Roles',
            description: 'Control de acceso basado en roles',
            icon: <Lock className="w-6 h-6" />,
            features: [
                'Roles de usuario (admin, user)',
                'Middleware de autorización',
                'Validación de permisos',
                'Acceso condicional a funcionalidades'
            ]
        },
        {
            title: 'Seguridad de Contraseñas',
            description: 'Manejo seguro de credenciales',
            icon: <Key className="w-6 h-6" />,
            features: [
                'Hashing con bcrypt',
                'Validación de fortaleza',
                'Cambio de contraseña seguro',
                'Recuperación de cuenta'
            ]
        },
        {
            title: 'Auditoría y Logs',
            description: 'Registro de actividades de seguridad',
            icon: <Eye className="w-6 h-6" />,
            features: [
                'Logs de autenticación',
                'Registro de intentos fallidos',
                'Historial de cambios',
                'Alertas de seguridad'
            ]
        }
    ];

    const securityMeasures = [
        {
            measure: 'Rate Limiting',
            description: 'Limitación de intentos de login',
            status: 'Implementado',
            icon: <CheckCircle className="w-5 h-5 text-green-600" />
        },
        {
            measure: 'HTTPS Forzado',
            description: 'Redirección automática a HTTPS',
            status: 'Implementado',
            icon: <CheckCircle className="w-5 h-5 text-green-600" />
        },
        {
            measure: 'Validación de Input',
            description: 'Sanitización de datos de entrada',
            status: 'Implementado',
            icon: <CheckCircle className="w-5 h-5 text-green-600" />
        },
        {
            measure: 'CORS Configurado',
            description: 'Políticas de origen cruzado',
            status: 'Implementado',
            icon: <CheckCircle className="w-5 h-5 text-green-600" />
        },
        {
            measure: 'Headers de Seguridad',
            description: 'Protección contra ataques comunes',
            status: 'Pendiente',
            icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />
        }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-8 h-8 text-accent-600" />
                    <h1 className="text-3xl font-bold text-secondary-900">Autenticación y Autorización</h1>
                </div>
                <p className="text-lg text-secondary-600">
                    Sistema completo de autenticación, autorización y seguridad para el sistema CAGPU.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-12">
                {authFeatures.map((feature, index) => (
                    <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-accent-50 rounded-lg text-accent-600">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-900">{feature.title}</h3>
                        </div>
                        <p className="text-secondary-600 mb-4">{feature.description}</p>
                        <ul className="space-y-2">
                            {feature.features.map((feat, featIndex) => (
                                <li key={featIndex} className="flex items-center gap-2 text-sm text-secondary-700">
                                    <div className="w-1.5 h-1.5 bg-accent-500 rounded-full"></div>
                                    {feat}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Medidas de Seguridad</h2>
                <div className="grid gap-4">
                    {securityMeasures.map((item, index) => (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-100 rounded-lg">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-secondary-900">{item.measure}</h3>
                                        <p className="text-secondary-600">{item.description}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.status === 'Implementado'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <User className="w-6 h-6 text-accent-600" />
                        <h3 className="text-xl font-semibold text-secondary-900">Flujo de Autenticación</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center text-xs font-medium">1</div>
                            <span className="text-sm text-secondary-700">Usuario ingresa credenciales</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center text-xs font-medium">2</div>
                            <span className="text-sm text-secondary-700">Validación en base de datos</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center text-xs font-medium">3</div>
                            <span className="text-sm text-secondary-700">Generación de JWT</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center text-xs font-medium">4</div>
                            <span className="text-sm text-secondary-700">Redirección al dashboard</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Lock className="w-6 h-6 text-accent-600" />
                        <h3 className="text-xl font-semibold text-secondary-900">Roles y Permisos</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-secondary-700">Administrador</span>
                            <span className="text-sm font-medium text-accent-600">Acceso completo</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                            <span className="text-secondary-700">Usuario</span>
                            <span className="text-sm font-medium text-accent-600">Acceso limitado</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-secondary-700">Invitado</span>
                            <span className="text-sm font-medium text-accent-600">Solo lectura</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
