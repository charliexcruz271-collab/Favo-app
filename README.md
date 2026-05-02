# Favo App 🤝

La app de microservicios entre estudiantes de la Universidad de los Andes.

---

## Estructura del proyecto

```
favo/
├── public/
├── src/
│   ├── components/
│   │   └── index.js          ← Toast, BottomNav, Incoming (contraoferta)
│   ├── hooks/
│   │   └── useFavo.js        ← Toda la lógica de Supabase (auth, favores, chat...)
│   ├── lib/
│   │   ├── supabase.js       ← Cliente de Supabase
│   │   └── constants.js      ← Categorías, carreras, formatos
│   ├── screens/
│   │   ├── AllScreens.jsx    ← Prototipo visual completo (referencia)
│   │   └── index.js          ← Barrel de pantallas
│   ├── App.js                ← Router principal + estado global
│   └── index.css             ← Tokens de diseño globales
├── supabase_schema.sql       ← ⭐ Ejecuta esto primero en Supabase
├── .env.example              ← Copia como .env y agrega tus keys
└── package.json
```

---

## Instalación paso a paso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Supabase
1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor → New Query**
3. Pega y ejecuta todo el contenido de `supabase_schema.sql`
4. Ve a **Settings → API** y copia tu URL y anon key

### 3. Variables de entorno
```bash
cp .env.example .env
# Edita .env con tus credenciales reales
```

### 4. Correr en desarrollo
```bash
npm start
```

### 5. Build para producción
```bash
npm run build
```

---

## Cómo hacer cambios

### Cambiar colores o tipografía
Edita las variables CSS en `src/index.css`:
```css
:root {
  --accent:  #E8621A;  /* naranja principal */
  --bg:      #1A1208;  /* fondo oscuro */
  ...
}
```

### Cambiar una pantalla
Cada pantalla está en `src/screens/`. Por ejemplo para cambiar el Home:
- Abre `src/screens/AllScreens.jsx`
- Busca `function Home(`
- Modifica lo que necesites

### Agregar una categoría nueva
Edita `src/lib/constants.js` → array `CATS`
Y también agrega el registro en `supabase_schema.sql` → tabla `categorias`

### Cambiar el % de comisión
Edita `src/lib/constants.js`:
```js
export const COMISION = 0.10; // 10% → cámbialo aquí
```
Y también en `src/hooks/useFavo.js` → función `aceptarFavor`

### Agregar un campo nuevo al perfil
1. Agrégalo a la tabla `usuarios` en Supabase (SQL Editor)
2. Agrégalo al formulario en `RegUserType` en `AllScreens.jsx`
3. Agrégalo a `guardarPerfil` en `useFavo.js`

---

## Funcionalidades implementadas

### ✅ Onboarding
- [x] Registro con @uniandes.edu.co
- [x] Verificación de código estudiantil único
- [x] OTP por correo
- [x] Selección de rol (Cliente / Prestador / Los dos) + info personal en una sola pantalla
- [x] Configuración de habilidades (si es prestador)

### ✅ Flujo de favor
- [x] Selección de categoría
- [x] Descripción del favor + filtro por carrera
- [x] Usuarios cercanos en tiempo real
- [x] Definición de tiempos (inicio y límite)
- [x] Negociación con slider dentro del rango
- [x] Comunicación: chat, llamada, GPS
- [x] Confirmación y retención del pago
- [x] Seguimiento en mapa
- [x] Calificación con estrellas

### ✅ Lado del prestador
- [x] Toggle de modo disponible
- [x] Recibir solicitudes entrantes
- [x] Aceptar / Rechazar solicitud
- [x] **Contraoferta** con slider
- [x] Compartir ubicación

### ✅ Otras pantallas
- [x] Billetera con historial de transacciones
- [x] Alertas / Notificaciones
- [x] Perfil con tabs: Info / Pedidos / Prestador / Habilidades
- [x] Anti-plagio en Académico y Diseño

---

## Despliegue en producción

### Opción A — Vercel (recomendado, gratis)
```bash
npm install -g vercel
vercel
# Agrega las env vars en el dashboard de Vercel
```

### Opción B — Netlify
```bash
npm run build
# Arrastra la carpeta /build a netlify.com
```

---

## Base de datos — Tablas principales

| Tabla          | Descripción                          |
|----------------|--------------------------------------|
| `usuarios`     | Perfiles verificados por Uniandes    |
| `habilidades`  | Habilidades de cada prestador        |
| `categorias`   | Las 6 categorías de favores          |
| `favores`      | Solicitudes activas y completadas    |
| `negociaciones`| Ofertas y contraofertas              |
| `mensajes`     | Chat en tiempo real                  |
| `calificaciones`| Reseñas bidireccionales             |
| `transacciones`| Pagos retenidos y liberados          |
| `objetos`      | Objetos disponibles en préstamo      |
| `ubicaciones`  | GPS en tiempo real                   |

---

## Equipo Favo 🚀

Proyecto universitario — Universidad de los Andes
