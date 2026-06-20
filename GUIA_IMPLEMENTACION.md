# 📚 Guía Completa: Cómo Implementar Luis GigaStore

## 📖 Tabla de Contenidos
1. [Requisitos previos](#requisitos-previos)
2. [Paso 1: Preparar el entorno](#paso-1-preparar-el-entorno)
3. [Paso 2: Instalar dependencias](#paso-2-instalar-dependencias)
4. [Paso 3: Configurar variables de entorno](#paso-3-configurar-variables-de-entorno)
5. [Paso 4: Configurar Supabase](#paso-4-configurar-supabase)
6. [Paso 5: Configurar Stripe](#paso-5-configurar-stripe)
7. [Paso 6: Ejecutar localmente](#paso-6-ejecutar-localmente)
8. [Paso 7: Personalizar tu tienda](#paso-7-personalizar-tu-tienda)
9. [Paso 8: Deploy en Vercel](#paso-8-deploy-en-vercel)
10. [Solución de problemas](#solución-de-problemas)

---

## ✅ Requisitos previos

Antes de comenzar, asegúrate de tener:

1. **Node.js 18+** instalado
   - Descarga desde: https://nodejs.org/
   - Verifica con: `node --version`

2. **Git** instalado
   - Descarga desde: https://git-scm.com/
   - Verifica con: `git --version`

3. **Cuenta en GitHub** (ya tienes)
   - Tu usuario: ChinoLuis26

4. **Editor de código**
   - Recomendado: Visual Studio Code (https://code.visualstudio.com/)

5. **Una cuenta de correo** para Supabase y Stripe

---

## Paso 1: Preparar el entorno

### Windows, Mac o Linux

#### 1.1 Abre la terminal

**Windows:**
- Presiona `Win + R`
- Escribe `cmd` y presiona Enter
- O busca "Símbolo del sistema"

**Mac:**
- Abre Launchpad → Utilidades → Terminal
- O presiona `Cmd + Espacio`, escribe "terminal"

**Linux:**
- Presiona `Ctrl + Alt + T`

#### 1.2 Verifica Node.js
```bash
node --version
npm --version
```

Deberías ver algo como:
```
v18.0.0
9.0.0
```

#### 1.3 Navega a la carpeta donde quieres el proyecto
```bash
# Ejemplo: Crear una carpeta llamada "proyectos"
cd Documents
mkdir proyectos
cd proyectos
```

---

## Paso 2: Instalar dependencias

### 2.1 Clona el repositorio

```bash
git clone https://github.com/ChinoLuis26/luis-gigastore.git
cd luis-gigastore
```

### 2.2 Instala las dependencias con npm

```bash
npm install
```

Este proceso tomará 2-5 minutos. Verás muchas líneas pasando, es normal.

**Cuando termine, deberías ver:**
```
added 245 packages in 2m
```

---

## Paso 3: Configurar variables de entorno

### 3.1 Crea el archivo `.env.local`

En la carpeta raíz de tu proyecto (donde está `package.json`):

**Con Editor de Código:**
1. Abre Visual Studio Code
2. Abre la carpeta `luis-gigastore`
3. Haz clic en "Archivo" → "Nuevo archivo"
4. Llama el archivo: `.env.local`
5. Copia el siguiente contenido:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Social Media
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/luisgigastore
NEXT_PUBLIC_TIKTOK_URL=https://tiktok.com/@luisgigastore
```

**Importante:** Mantén este archivo tal como está por ahora. Lo completaremos en los pasos siguientes.

---

## Paso 4: Configurar Supabase

### 4.1 Crea una cuenta Supabase

1. Ve a https://supabase.com
2. Haz clic en "Sign Up" (Registrarse)
3. Elige "Continuar con GitHub"
4. Autoriza Supabase a acceder a tu GitHub
5. Completa tu perfil si es necesario

### 4.2 Crea un nuevo proyecto

1. Haz clic en "New Project" (Nuevo Proyecto)
2. Rellena los campos:
   - **Name:** `luis-gigastore` (o el nombre que prefieras)
   - **Database Password:** Crea una contraseña fuerte (guárdala)
   - **Region:** Elige la más cercana a ti
3. Haz clic en "Create new project"

Espera 1-2 minutos mientras se crea el proyecto.

### 4.3 Obtén tus claves

Una vez que el proyecto se crea:

1. Ve a "Settings" (Engranaje) → "API"
2. Busca la sección "Project API keys"
3. **Copia:**
   - **Project URL** → Pega en `.env.local` como `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** (bajo "Project API keys") → Pega en `.env.local` como `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Ejemplo:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzabcde.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4.4 Crea las tablas de la base de datos

1. En Supabase, ve a "SQL Editor" (lado izquierdo)
2. Haz clic en "New Query" (Nueva Consulta)
3. Copia y pega este código:

```sql
-- Tabla de productos
CREATE TABLE products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de órdenes
CREATE TABLE orders (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de items de órdenes
CREATE TABLE order_items (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id uuid REFERENCES orders(id),
  product_id uuid REFERENCES products(id),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
```

4. Haz clic en "RUN" (Ejecutar)
5. Deberías ver: `Success. No rows returned.`

¡Perfecta! Tus tablas están creadas.

---

## Paso 5: Configurar Stripe

### 5.1 Crea una cuenta Stripe

1. Ve a https://stripe.com
2. Haz clic en "Start now" (Comenzar ahora)
3. Completa el registro con:
   - Tu correo
   - Tu contraseña
   - Nombre de negocios: "Luis GigaStore"
   - País

### 5.2 Completa tu perfil (Opcional para pruebas)

Stripe puede pedirte información adicional. Para pruebas, puedes saltarlo.

### 5.3 Obtén tus claves API

1. En el dashboard de Stripe, busca "Developers" (lado izquierdo)
2. Haz clic en "API Keys"
3. En "Standard keys", verás:
   - **Publishable key** → Cópialo en `.env.local` como `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → Cópialo en `.env.local` como `STRIPE_SECRET_KEY`

**Ejemplo:**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdef
STRIPE_SECRET_KEY=sk_test_0987654321abcdef
```

---

## Paso 6: Ejecutar localmente

### 6.1 Verifica tu archivo `.env.local`

Ahora tu archivo `.env.local` debe verse así:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xyzabcde.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdef
STRIPE_SECRET_KEY=sk_test_0987654321abcdef

# Social Media
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/luisgigastore
NEXT_PUBLIC_TIKTOK_URL=https://tiktok.com/@luisgigastore
```

### 6.2 Inicia el servidor de desarrollo

En la terminal (en la carpeta del proyecto):

```bash
npm run dev
```

Deberías ver algo como:
```
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.3s
```

### 6.3 Abre tu tienda

1. Abre tu navegador
2. Ve a http://localhost:3000
3. ¡Deberías ver tu tienda online!

### 6.4 Prueba la tienda

- Haz clic en "Ver Productos"
- Añade productos al carrito
- Ve a tu carrito
- Verifica que los números sean correctos

**Para detener el servidor:**
- Presiona `Ctrl + C` en la terminal

---

## Paso 7: Personalizar tu tienda

### 7.1 Cambiar el nombre

En `components/Navbar.tsx`, línea ~20:

```typescript
// ANTES:
<Link href="/" className="text-2xl font-bold text-blue-600">
  Luis GigaStore
</Link>

// DESPUÉS:
<Link href="/" className="text-2xl font-bold text-blue-600">
  Mi Tienda
</Link>
```

### 7.2 Cambiar colores

En `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#1f2937',      // Cambiar azul
      secondary: '#3b82f6',    // Cambiar acento
      accent: '#f59e0b',       // Cambiar resaltado
    },
  },
}
```

**Colores sugeridos:**
- Verde tienda: `primary: '#10b981'`
- Rojo profesional: `primary: '#ef4444'`
- Púrpura moderno: `primary: '#a855f7'`

### 7.3 Cambiar información de contacto

En `components/Footer.tsx`, busca:

```typescript
// Cambiar teléfono
<FaPhone /> +1 (555) 123-4567

// Cambiar email
<FaEnvelope /> info@luisgigastore.com

// Cambiar ubicación (en app/contact/page.tsx)
<p className="text-gray-600">Calle Principal 123, Ciudad</p>
```

### 7.4 Agregar productos reales

En `app/products/page.tsx`, edita el array `products`:

```typescript
const products = [
  {
    id: '1',
    name: 'Mi Producto 1',              // Tu nombre
    category: 'electrodomesticos',      // categoría
    price: 99.99,                       // Tu precio
    image: 'https://tu-imagen.com/img.jpg',  // Tu imagen
    description: 'Descripción del producto'
  },
  // ... más productos
]
```

### 7.5 Cambiar redes sociales

En `.env.local`:

```env
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/tu-pagina
NEXT_PUBLIC_TIKTOK_URL=https://tiktok.com/@tu-usuario
```

---

## Paso 8: Deploy en Vercel

### 8.1 Prepara tu código para GitHub

```bash
git add .
git commit -m "Initial commit: Luis GigaStore setup"
git push
```

### 8.2 Registrarse en Vercel

1. Ve a https://vercel.com
2. Haz clic en "Sign Up" (Registrarse)
3. Elige "Continue with GitHub"
4. Autoriza Vercel

### 8.3 Crea un nuevo proyecto

1. Haz clic en "New Project" (Nuevo Proyecto)
2. Busca "luis-gigastore"
3. Haz clic en "Import"

### 8.4 Configura variables de entorno

1. Busca la sección "Environment Variables"
2. Añade todas tus variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_FACEBOOK_URL`
   - `NEXT_PUBLIC_TIKTOK_URL`

### 8.5 Deploy

1. Haz clic en "Deploy"
2. Espera 2-3 minutos
3. ¡Tu tienda estará en vivo!

**Tu URL será algo como:**
```
https://luis-gigastore.vercel.app
```

---

## Solución de problemas

### ❌ Error: "Cannot find module"

**Solución:**
```bash
npm install
```

### ❌ El carrito no funciona

**Solución:**
1. Abre DevTools (F12)
2. Ve a "Application" → "Cookies"
3. Verifica que estén habilitadas

### ❌ Stripe no funciona

**Solución:**
1. Verifica que las claves en `.env.local` sean correctas
2. Reinicia el servidor: `npm run dev`
3. Limpia el caché del navegador (Ctrl + Shift + Del)

### ❌ Supabase no conecta

**Solución:**
1. Verifica la URL y clave en `.env.local`
2. Comprueba que estén sin espacios en blanco
3. En Supabase, verifica que el proyecto esté activo

### ❌ Puerto 3000 en uso

**Solución:**
```bash
npm run dev -- -p 3001
```

Esto usará el puerto 3001 en lugar de 3000.

---

## 📝 Checklist Final

- [ ] Node.js 18+ instalado
- [ ] Git instalado
- [ ] Clonaste el repositorio
- [ ] Corriste `npm install`
- [ ] Creaste `.env.local`
- [ ] Configuraste Supabase
- [ ] Obtuviste claves de Supabase
- [ ] Creaste tablas en Supabase
- [ ] Configuraste Stripe
- [ ] Obtuviste claves de Stripe
- [ ] Llenaste `.env.local` con todas las claves
- [ ] Ejecutaste `npm run dev`
- [ ] Abriste http://localhost:3000
- [ ] Probaste agregar productos al carrito
- [ ] Personalizaste colores y nombre
- [ ] Hiciste push a GitHub
- [ ] Conectaste Vercel
- [ ] Hiciste deploy exitosamente

---

## 🎉 ¡Listo!

¡Felicitaciones! Ahora tienes una tienda online profesional completamente funcional.

**Próximos pasos:**
1. Añade más productos
2. Integra un sistema de emails
3. Configura análitica con Google Analytics
4. Personaliza más el diseño
5. Prueba los pagos con Stripe (en modo test)

---

## 📞 Ayuda adicional

Si necesitas ayuda:
1. Revisa la documentación:
   - Next.js: https://nextjs.org/docs
   - Tailwind CSS: https://tailwindcss.com/docs
   - Supabase: https://supabase.com/docs
   - Stripe: https://stripe.com/docs

2. Busca en Google: `[error] + next.js`

3. Pregunta en comunidades:
   - Stack Overflow: https://stackoverflow.com
   - Reddit: https://reddit.com/r/nextjs

---

**Última actualización:** Junio 2026
**Versión:** 1.0.0
