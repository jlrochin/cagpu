"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { UserCog, Plus, Edit, Trash2, History, Power, PowerOff } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  username: string
  email: string
  role: string
  firstName?: string
  lastName?: string
  department?: string
  phone?: string
  isActive: boolean
  createdAt: string
}

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    firstName: '',
    lastName: '',
    department: '',
    phone: '',
  })
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [historyUser, setHistoryUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    firstName: '',
    lastName: '',
    department: '',
    phone: '',
  })
  const [editFormError, setEditFormError] = useState('')
  const [editFormLoading, setEditFormLoading] = useState(false)
  const [userHistory, setUserHistory] = useState<any[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const router = useRouter();
  const [confirmUser, setConfirmUser] = useState<User | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Error al cargar usuarios')
        setLoading(false)
      })
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validatePassword = (password: string) => password.length >= 4;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!form.username || !form.email || !form.password) {
      setFormError('Todos los campos obligatorios deben estar llenos.')
      return
    }
    if (!validatePassword(form.password)) {
      setFormError('La contraseña debe tener al menos 4 caracteres (validación temporal para pruebas).')
      return
    }
    setFormLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setFormError(data.error || 'Error al crear usuario')
        setFormLoading(false)
        return
      }
      setShowCreate(false)
      setForm({ username: '', email: '', password: '', role: 'user', firstName: '', lastName: '', department: '', phone: '' })
      setUsers([data.user, ...users])
      toast.success('Usuario creado correctamente')
    } catch (err) {
      setFormError('Error de red')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditUser(user)
    setEditForm({
      username: user.username,
      email: user.email,
      password: '', // No mostrar contraseña actual
      role: user.role,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      department: user.department || '',
      phone: user.phone || '',
    })
    setEditFormError('')
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editUser) return

    setEditFormError('')
    if (!editForm.username || !editForm.email) {
      setEditFormError('Usuario y email son obligatorios.')
      return
    }

    // Si se proporciona contraseña, validarla
    if (editForm.password && !validatePassword(editForm.password)) {
      setEditFormError('La contraseña debe tener al menos 4 caracteres (validación temporal para pruebas).')
      return
    }

    setEditFormLoading(true)
    try {
      const res = await fetch(`/api/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const data = await res.json()
      
      if (!res.ok) {
        setEditFormError(data.error || 'Error al actualizar usuario')
        setEditFormLoading(false)
        return
      }

      // Actualizar la lista de usuarios
      setUsers(users.map(u => u.id === editUser.id ? data.user : u))
      setEditUser(null)
      setEditForm({ username: '', email: '', password: '', role: 'user', firstName: '', lastName: '', department: '', phone: '' })
      toast.success('Usuario actualizado correctamente')
    } catch (err) {
      setEditFormError('Error de red')
    } finally {
      setEditFormLoading(false)
    }
  }

  const handleDeactivate = async (user: User) => {
    setConfirmUser(user);
  };

  const confirmDeactivate = async () => {
    if (!confirmUser) return;
    setConfirmLoading(true);
    try {
      const res = await fetch(`/api/users/${confirmUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: confirmUser.isActive ? 'deactivate' : 'activate' }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error al cambiar estado del usuario');
        setConfirmLoading(false);
        return;
      }
      toast.success(data.message);
      setConfirmUser(null);
      setConfirmLoading(false);
      // Forzar refresh de la página para actualizar el estado
      window.location.reload();
    } catch (err) {
      toast.error('Error de red');
      setConfirmLoading(false);
    }
  };

  const handleHistory = async (user: User) => {
    setHistoryUser(user)
    setHistoryLoading(true)
    setUserHistory([])

    try {
      const res = await fetch(`/api/users/${user.id}/history`)
      const data = await res.json()
      
      if (!res.ok) {
        toast.error(data.error || 'Error al cargar historial')
        return
      }

      setUserHistory(data.history)
    } catch (err) {
      toast.error('Error de red')
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleEditInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Administración de Usuarios</CardTitle>
              <CardDescription>Administra los usuarios del sistema</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-lg text-blue-200 py-10">Cargando usuarios...</div>
          ) : (
            <div className="overflow-x-auto rounded-xl mt-4">
              <table className="min-w-full text-sm border border-blue-900 rounded-2xl overflow-hidden bg-transparent">
                <thead>
                  <tr className="bg-muted dark:bg-blue-950/60 text-foreground">
                    <th className="px-3 py-2 text-left font-semibold">ID</th>
                    <th className="px-3 py-2 text-left font-semibold">Usuario</th>
                    <th className="px-3 py-2 text-left font-semibold">Email</th>
                    <th className="px-3 py-2 text-left font-semibold">Rol</th>
                    <th className="px-3 py-2 text-left font-semibold">Nombre</th>
                    <th className="px-3 py-2 text-left font-semibold">Departamento</th>
                    <th className="px-3 py-2 text-left font-semibold">Teléfono</th>
                    <th className="px-3 py-2 text-center font-semibold">Activo</th>
                    <th className="px-3 py-2 text-center font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={user.id} className={
                      `transition-colors bg-transparent border-b border-blue-900 hover:border-primary/50 hover:shadow-md hover:z-10` +
                      (idx === 0 ? ' first:rounded-t-2xl' : '') +
                      (idx === users.length - 1 ? ' last:rounded-b-2xl border-b-0' : '') +
                      (user.isActive ? '' : ' opacity-60')
                    }>
                      <td className="px-3 py-2">{user.id}</td>
                      <td className="px-3 py-2 font-semibold text-blue-600 dark:text-blue-300">{user.username}</td>
                      <td className="px-3 py-2">{user.email}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>{user.role}</span>
                      </td>
                      <td className="px-3 py-2">{user.firstName} {user.lastName}</td>
                      <td className="px-3 py-2">{user.department}</td>
                      <td className="px-3 py-2">{user.phone}</td>
                      <td className="px-3 py-2 text-center">{user.isActive ? '✔️' : '❌'}</td>
                      <td className="px-3 py-2 flex gap-2 items-center min-w-[120px]">
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="outline" className="px-2 py-1 h-8 text-xs flex gap-1 text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-800" onClick={() => handleEdit(user)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="outline" className="px-2 py-1 h-8 text-xs flex gap-1 text-zinc-600 border-zinc-400 hover:bg-zinc-100 hover:text-zinc-800" onClick={() => handleHistory(user)}>
                                <History className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Historial</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                variant={user.isActive ? "destructive" : "default"}
                                className={`px-2 py-1 h-8 text-xs flex gap-1 ${
                                  user.isActive 
                                    ? "bg-red-600 hover:bg-red-700" 
                                    : "bg-green-600 hover:bg-green-700 text-white"
                                }`} 
                                onClick={() => handleDeactivate(user)}
                              >
                                {user.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{user.isActive ? 'Desactivar' : 'Activar'}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-8 flex justify-end">
        <Button onClick={() => setShowCreate(true)} className="gap-2 text-lg px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
          <Plus className="h-5 w-5" /> Crear nuevo usuario
        </Button>
      </div>
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nuevo usuario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Usuario *</Label>
                <Input name="username" value={form.username} onChange={handleInput} required />
              </div>
              <div>
                <Label>Email *</Label>
                <Input name="email" type="email" value={form.email} onChange={handleInput} required />
              </div>
              <div>
                <Label>Contraseña *</Label>
                <Input name="password" type="password" value={form.password} onChange={handleInput} required />
              </div>
              <div>
                <Label>Rol</Label>
                <select name="role" value={form.role} onChange={handleInput} className="w-full border rounded px-2 py-1">
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div>
                <Label>Nombre</Label>
                <Input name="firstName" value={form.firstName} onChange={handleInput} />
              </div>
              <div>
                <Label>Apellido</Label>
                <Input name="lastName" value={form.lastName} onChange={handleInput} />
              </div>
              <div>
                <Label>Departamento</Label>
                <Input name="department" value={form.department} onChange={handleInput} />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input name="phone" value={form.phone} onChange={handleInput} />
              </div>
            </div>
            {formError && <div className="text-red-600 text-sm">{formError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancelar</Button>
              <Button type="submit" disabled={formLoading}>{formLoading ? 'Guardando...' : 'Crear'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Modal de edición de usuario */}
      <Dialog open={!!editUser} onOpenChange={v => !v && setEditUser(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar usuario: {editUser?.username}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Usuario *</Label>
                <Input 
                  name="username" 
                  value={editForm.username} 
                  onChange={handleEditInput} 
                  required 
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input 
                  name="email" 
                  type="email" 
                  value={editForm.email} 
                  onChange={handleEditInput} 
                  required 
                />
              </div>
              <div>
                <Label>Contraseña (dejar vacío para no cambiar)</Label>
                <Input 
                  name="password" 
                  type="password" 
                  value={editForm.password} 
                  onChange={handleEditInput} 
                />
              </div>
              <div>
                <Label>Rol</Label>
                <select 
                  name="role" 
                  value={editForm.role} 
                  onChange={handleEditInput} 
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div>
                <Label>Nombre</Label>
                <Input 
                  name="firstName" 
                  value={editForm.firstName} 
                  onChange={handleEditInput} 
                />
              </div>
              <div>
                <Label>Apellido</Label>
                <Input 
                  name="lastName" 
                  value={editForm.lastName} 
                  onChange={handleEditInput} 
                />
              </div>
              <div>
                <Label>Departamento</Label>
                <Input 
                  name="department" 
                  value={editForm.department} 
                  onChange={handleEditInput} 
                />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input 
                  name="phone" 
                  value={editForm.phone} 
                  onChange={handleEditInput} 
                />
              </div>
            </div>
            
            {editFormError && (
              <div className="text-red-500 text-sm">{editFormError}</div>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditUser(null)}
                disabled={editFormLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={editFormLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editFormLoading ? 'Actualizando...' : 'Actualizar Usuario'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Modal de historial de usuario */}
      <Dialog open={!!historyUser} onOpenChange={v => !v && setHistoryUser(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Historial de cambios: {historyUser?.username}</DialogTitle>
          </DialogHeader>
          
          {historyLoading ? (
            <div className="text-center py-8">
              <div className="text-lg">Cargando historial...</div>
            </div>
          ) : userHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-500">No hay historial de cambios para este usuario.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {userHistory.map((change, index) => (
                <div key={change.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        change.action === 'create' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        change.action === 'update' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        change.action === 'deactivate' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        change.action === 'activate' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {change.action === 'create' ? 'Creación' :
                         change.action === 'update' ? 'Actualización' :
                         change.action === 'deactivate' ? 'Desactivación' :
                         change.action === 'activate' ? 'Activación' :
                         change.action}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        por {change.performer}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(change.createdAt).toLocaleString('es-ES')}
                    </span>
                  </div>
                  {change.details && (
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {change.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!confirmUser} onOpenChange={v => !v && setConfirmUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmUser?.isActive
                ? `¿Estás seguro de que quieres desactivar al usuario "${confirmUser?.username}"?`
                : `¿Estás seguro de que quieres activar al usuario "${confirmUser?.username}"?`}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmUser(null)} disabled={confirmLoading}>
              Cancelar
            </Button>
            <Button onClick={confirmDeactivate} disabled={confirmLoading} className={confirmUser?.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}>
              {confirmLoading ? 'Procesando...' : confirmUser?.isActive ? 'Desactivar' : 'Activar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 