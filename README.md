This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Plataforma interna: guardado compartido

La plataforma usa Supabase para compartir expedientes, pagos, tareas, alertas de calendario, documentos y catálogos entre Juan y Luis. Requiere `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; sin ellas se muestra un aviso de configuración y no se abre la plataforma.

1. Crea un proyecto de Supabase y ejecuta [la migración SQL](supabase/migrations/20261009_platform_storage.sql) en el SQL Editor.
2. En **Authentication → Users**, crea dos usuarios con contraseña, uno para Juan y otro para Luis. Desactiva el registro público en **Authentication → Providers → Email** para evitar cuentas nuevas no autorizadas.
3. Sustituye los correos en estas consultas y ejecútalas en el SQL Editor:

   ```sql
   insert into public.platform_members (user_id, display_name)
   select id, 'Juan Valencia' from auth.users where lower(email) = lower('CORREO_DE_JUAN')
   on conflict (user_id) do update set display_name = excluded.display_name;

   insert into public.platform_members (user_id, display_name)
   select id, 'Luis Hernando Barrios' from auth.users where lower(email) = lower('CORREO_DE_LUIS')
   on conflict (user_id) do update set display_name = excluded.display_name;
   ```

4. Copia la URL del proyecto y la clave pública (anon/publishable) a `.env.local` usando [.env.example](.env.example). Configura las mismas variables en el servicio donde publiques la web. **No uses la clave `service_role` en variables `NEXT_PUBLIC_`.**
5. Entra a `/plataforma` con una cuenta autorizada. Los datos que crees o cambies desde ese momento se guardan en Supabase. Los registros antiguos del navegador no se importan automáticamente ni se eliminan de ese navegador.

Las políticas de base de datos permiten leer solo a Juan y Luis. El guardado usa una revisión para detectar cambios simultáneos y combina automáticamente cambios independientes. Si ambos modifican el mismo dato, prevalece el último guardado. La plataforma vuelve a consultar cambios compartidos cada 30 segundos cuando no hay cambios locales pendientes.

En **Configuración → Columnas** se pueden crear campos adicionales para los casos (texto, número, fecha o lista de opciones). Sus definiciones y valores se guardan dentro de los datos compartidos; los proyectos que ya ejecutaron la migración anterior no necesitan volver a ejecutar SQL.

Las columnas personalizadas se pueden retirar desde Configuración. En la lista de Casos, los encabezados se pueden arrastrar para guardar un orden compartido. Al eliminar un expediente se retira de las vistas activas junto con sus tareas, pagos y documentos vinculados; una copia de esos registros, su historial y el evento de eliminación permanecen en Actividad para auditoría. Estas funciones usan el mismo registro JSON compartido, sin cambios adicionales en la base ya configurada.
