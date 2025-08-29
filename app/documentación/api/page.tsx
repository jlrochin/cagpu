'use client';

import { Code, Database, Shield, Activity, Globe, Zap, Server, FileText } from 'lucide-react';

export default function ApiPage() {
    const apiEndpoints = [
        {
            method: 'GET',
            path: '/api/users',
            description: 'Obtener lista de usuarios',
            auth: 'Requerida',
            role: 'Admin',
            icon: <Database className="w-5 h-5" />
        },
        {
            method: 'POST',
            path: '/api/users',
            description: 'Crear nuevo usuario',
            auth: 'Requerida',
            role: 'Admin',
            icon: <Database className="w-5 h-5" />
        },
        {
            method: 'PUT',
            path: '/api/users/:id',
            description: 'Actualizar usuario existente',
            auth: 'Requerida',
            role: 'Admin',
            icon: <Database className="w-5 h-5" />
        },
        {
            method: 'DELETE',
            path: '/api/users/:id',
            description: 'Eliminar usuario',
            auth: 'Requerida',
            role: 'Admin',
            icon: <Database className="w-5 h-5" />
        },
        {
            method: 'GET',
            path: '/api/services',
            description: 'Obtener servicios disponibles',
            auth: 'Opcional',
            role: 'Todos',
            icon: <Activity className="w-5 h-5" />
        },
        {
            method: 'POST',
            path: '/api/services',
            description: 'Crear nuevo servicio',
            auth: 'Requerida',
            role: 'Admin',
            icon: <Activity className="w-5 h-5" />
        },
        {
            method: 'GET',
            path: '/api/audit-log',
            description: 'Obtener logs de auditoría',
            auth: 'Requerida',
            role: 'Admin',
            icon: <Shield className="w-5 h-5" />
        },
        {
            method: 'POST',
            path: '/api/auth/login',
            description: 'Autenticación de usuario',
            auth: 'No requerida',
            role: 'Todos',
            icon: <Shield className="w-5 h-5" />
        }
    ];

    const responseFormats = [
        {
            type: 'Éxito',
            code: '200',
            description: 'Respuesta exitosa',
            example: '{"success": true, "data": {...}}'
        },
        {
            type: 'Creado',
            code: '201',
            description: 'Recurso creado exitosamente',
            example: '{"success": true, "id": "123"}'
        },
        {
            type: 'No Autorizado',
            code: '401',
            description: 'Credenciales inválidas o faltantes',
            example: '{"error": "Unauthorized"}'
        },
        {
            type: 'Prohibido',
            code: '403',
            description: 'Sin permisos para acceder al recurso',
            example: '{"error": "Forbidden"}'
        },
        {
            type: 'No Encontrado',
            code: '404',
            description: 'Recurso no encontrado',
            example: '{"error": "Not Found"}'
        },
        {
            type: 'Error del Servidor',
            code: '500',
            description: 'Error interno del servidor',
            example: '{"error": "Internal Server Error"}'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Code className="w-8 h-8 text-accent-600" />
                    <h1 className="text-3xl font-bold text-secondary-900">API y Endpoints</h1>
                </div>
                <p className="text-lg text-secondary-600">
                    Documentación completa de la API REST del sistema CAGPU, incluyendo endpoints, autenticación y respuestas.
                </p>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Endpoints Disponibles</h2>
                <div className="grid gap-4">
                    {apiEndpoints.map((endpoint, index) => (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-100 rounded-lg">
                                        {endpoint.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                                                endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                                                    endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {endpoint.method}
                                            </span>
                                            <code className="bg-slate-100 px-3 py-1 rounded font-mono text-sm">
                                                {endpoint.path}
                                            </code>
                                        </div>
                                        <p className="text-secondary-600 mt-2">{endpoint.description}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${endpoint.auth === 'Requerida' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {endpoint.auth}
                                    </div>
                                    <div className="text-xs text-secondary-500 mt-1">{endpoint.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Códigos de Respuesta</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {responseFormats.map((response, index) => (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold text-secondary-900">{response.type}</h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${response.code.startsWith('2') ? 'bg-green-100 text-green-800' :
                                    response.code.startsWith('4') ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {response.code}
                                </span>
                            </div>
                            <p className="text-secondary-600 mb-3">{response.description}</p>
                            <code className="block bg-slate-100 p-3 rounded-lg text-sm font-mono overflow-x-auto">
                                {response.example}
                            </code>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-accent-600" />
                        <h3 className="text-xl font-semibold text-secondary-900">Autenticación</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="text-sm text-secondary-700">
                            <strong>Bearer Token:</strong> Incluir en header Authorization
                        </div>
                        <code className="block bg-slate-100 p-3 rounded-lg text-sm font-mono">
                            Authorization: Bearer &lt;token&gt;
                        </code>
                        <div className="text-sm text-secondary-700">
                            <strong>Cookie:</strong> Token almacenado automáticamente
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe className="w-6 h-6 text-accent-600" />
                        <h3 className="text-xl font-semibold text-secondary-900">Base URL</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="text-sm text-secondary-700">
                            <strong>Desarrollo:</strong>
                        </div>
                        <code className="block bg-slate-100 p-3 rounded-lg text-sm font-mono">
                            http://localhost:3000
                        </code>
                        <div className="text-sm text-secondary-700">
                            <strong>Producción:</strong>
                        </div>
                        <code className="block bg-slate-100 p-3 rounded-lg text-sm font-mono">
                            https://cagpu.example.com
                        </code>
                    </div>
                </div>
            </div>

            <div className="mt-12 bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Ejemplo de Uso</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-secondary-800 mb-2">Obtener Usuarios (cURL)</h4>
                        <code className="block bg-white p-3 rounded-lg border font-mono text-sm overflow-x-auto">
                            curl -H "Authorization: Bearer &lt;token&gt;" https://api.example.com/api/users
                        </code>
                    </div>
                    <div>
                        <h4 className="font-medium text-secondary-800 mb-2">Crear Usuario (JavaScript)</h4>
                        <code className="block bg-white p-3 rounded-lg border font-mono text-sm overflow-x-auto">
                            {`fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'nuevo', role: 'user' })
})`}
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
}
