# Mora Hamburguesas — Pedidos Online

Web de pedidos para Mora Hamburguesas. Funciona en Vercel como sitio estático y puede trabajar en dos modos:

- **Local:** no requiere cuentas ni base de datos. La configuración se guarda en el navegador.
- **Online:** usa Supabase para compartir configuración y pedidos entre dispositivos y proteger el panel de administración.

## Accesos separados (V4)

- **Tienda pública:** `/pedir` (para el enlace de Instagram, TikTok y WhatsApp).
- **Administración:** `/admin` (acceso con email y contraseña de Supabase).
- La tienda pública no muestra el botón del editor.
- El panel `/admin` bloquea el acceso si Supabase no está configurado; no permite administrar en modo local.

> La protección completa depende de ejecutar `supabase-schema.sql` y mantener las políticas RLS correctamente configuradas. Probá ambos accesos antes de recibir pedidos reales.

## Subir a GitHub / Vercel

1. Subí todos los archivos de esta carpeta al repositorio.
2. Vercel puede desplegarlo directamente; no requiere build command.
3. La web funciona en modo local incluso si no configurás Supabase.

## Activar modo online (recomendado)

### 1. Crear proyecto Supabase

Creá un proyecto en Supabase y abrí **SQL Editor**.

Pegá y ejecutá el contenido de `supabase-schema.sql`.

### 2. Crear el usuario administrador

En Supabase entrá a **Authentication → Users** y creá un usuario con email y contraseña.

Ese usuario será el que podrá entrar a `/admin`.

### 3. Conectar la web

Abrí `config.js` y completá:

```js
window.MORA_SUPABASE = {
  url: 'https://TU-PROYECTO.supabase.co',
  anonKey: 'TU_ANON_KEY'
};
```

Usá solamente la **anon/public key**. Nunca pongas una `service_role` key en `config.js`.

También podés configurar esos valores durante el despliegue si más adelante querés migrar la configuración a variables de entorno.

### 4. Volver a subir a GitHub

Después del cambio, Vercel desplegará la nueva versión automáticamente si el repositorio está conectado.

## Qué queda online

- Menú y precios compartidos.
- Configuración del negocio compartida.
- Zonas de delivery compartidas.
- Medios de pago compartidos.
- Pedidos almacenados en la base de datos.
- Panel protegido por login.
- Estado de cada pedido en la base de datos.

## Seguridad

La `anon key` de Supabase está diseñada para estar en aplicaciones web. La seguridad real la proporcionan las políticas RLS del archivo `supabase-schema.sql`.

**Nunca publiques una `service_role` key, contraseña de administrador ni otro secreto dentro del repositorio.**

## Próxima etapa

Una vez conectado Supabase, el siguiente paso recomendado es transformar el panel en un tablero de cocina con columnas:

`Nuevos → Confirmados → Preparando → Listos → Enviados → Entregados`

y agregar impresión de comandas, horarios de atención, cierre temporal de pedidos y estadísticas.


## URLs después del despliegue

- Tienda: `https://TU-DOMINIO/pedir`
- Administración: `https://TU-DOMINIO/admin`

Usá `/pedir` en la biografía de redes. Antes de recibir pedidos reales, reemplazá los precios, productos, zonas y WhatsApp de demostración por los datos reales de Mora.
