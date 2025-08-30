# 🚀 Despliegue de CAGPU en Railway

## **Descripción**

Este documento explica cómo desplegar tu aplicación CAGPU en Railway de forma gratuita.

## **Prerrequisitos**

- Cuenta en [Railway.app](https://railway.app)
- Cuenta en GitHub
- Proyecto CAGPU en un repositorio público o privado

## **🚀 Despliegue Automático (Recomendado)**

### **1. Conectar GitHub a Railway**

1. Ve a [railway.app](https://railway.app)
2. Haz clic en "Start a New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu cuenta de GitHub
5. Selecciona el repositorio `cagpu`

### **2. Configurar Variables de Entorno**

Railway detectará automáticamente tu `Dockerfile` y creará un servicio. Luego:

1. Ve a la pestaña "Variables"
2. Agrega las siguientes variables:

```bash
# Base de datos (Railway la crea automáticamente)
DATABASE_URL=postgresql://...

# Next.js
NODE_ENV=production
NEXTAUTH_URL=https://tu-app.railway.app
NEXTAUTH_SECRET=tu-secret-super-seguro

# Autenticación GitHub (opcional)
NEXTAUTH_GITHUB_ID=tu-github-client-id
NEXTAUTH_GITHUB_SECRET=tu-github-client-secret
```

### **3. Crear Base de Datos PostgreSQL**

1. Ve a la pestaña "New Service"
2. Selecciona "Database" → "PostgreSQL"
3. Railway generará automáticamente la variable `DATABASE_URL`
4. Copia esta URL a las variables de entorno del servicio web

### **4. Desplegar**

1. Railway detectará automáticamente los cambios en GitHub
2. Cada push a `main` o `master` activará un nuevo despliegue
3. Monitorea el progreso en la pestaña "Deployments"

## **🔧 Despliegue Manual con CLI**

### **1. Instalar Railway CLI**

```bash
npm install -g @railway/cli
# O usar npx
npx @railway/cli
```

### **2. Iniciar Sesión**

```bash
npx @railway/cli login
```

### **3. Desplegar**

```bash
npx @railway/cli up
```

## **📊 Monitoreo y Logs**

### **Ver Logs en Tiempo Real**

```bash
npx @railway/cli logs
```

### **Ver Estado del Servicio**

```bash
npx @railway/cli status
```

### **Abrir la Aplicación**

```bash
npx @railway/cli open
```

## **🔒 Seguridad**

### **Variables Sensibles**

- **NUNCA** commits variables sensibles en el código
- Usa siempre las variables de entorno de Railway
- Rota regularmente los secrets

### **Base de Datos**

- Railway proporciona SSL automático para PostgreSQL
- Las conexiones son seguras por defecto
- Considera hacer backups regulares

## **💰 Costos**

### **Plan Gratuito**

- **$5 de crédito mensual** (suficiente para proyectos pequeños)
- **Base de datos PostgreSQL** incluida
- **SSL gratuito** automático
- **Despliegue automático** desde GitHub

### **Escalado**

- Cuando necesites más recursos, Railway te avisará
- Puedes actualizar a un plan de pago según sea necesario

## **🚨 Solución de Problemas**

### **Error: Build Failed**

1. Verifica que el `Dockerfile` esté correcto
2. Revisa los logs de construcción
3. Asegúrate de que todas las dependencias estén en `package.json`

### **Error: Database Connection**

1. Verifica que `DATABASE_URL` esté configurada
2. Asegúrate de que el servicio PostgreSQL esté activo
3. Revisa que la base de datos esté inicializada

### **Error: Port Already in Use**

- Railway maneja automáticamente los puertos
- No necesitas configurar `PORT` manualmente

## **📈 Próximos Pasos**

1. **Monitoreo**: Configura alertas en Railway
2. **Backups**: Programa backups automáticos de la base de datos
3. **CI/CD**: Configura GitHub Actions para testing automático
4. **Escalado**: Monitorea el uso de recursos

## **🔗 Enlaces Útiles**

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [GitHub Repository](https://github.com/tu-usuario/cagpu)

---

**¡Tu aplicación CAGPU estará funcionando en la nube en minutos! 🎉**
