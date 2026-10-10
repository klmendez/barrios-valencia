# Recordatorios en un grupo de Telegram

Los avisos de tareas, alertas, vencimientos y anotaciones de la plataforma llegan a un único grupo privado de Telegram. Cada mensaje indica el responsable. Solo se envían los que corresponden a la fecha actual de Bogotá y la base de datos evita enviarlos dos veces.

Cada aviso incluye un enlace al expediente cuando se configura `PLATFORM_URL`. Si el asunto de una alerta contiene «audiencia», el mensaje indica que la audiencia es hoy, muestra el asunto y el nombre del cliente. El enlace abre el expediente después de iniciar sesión en la plataforma.

## Lo que se hace en Telegram

1. Crea un bot hablando con [@BotFather](https://t.me/BotFather) y enviando `/newbot`. Conserva el token en privado.
2. Crea un grupo privado con Juan y Luis, añade el bot y envía `/start` en ese grupo.
3. Obtén el ID del grupo. En una terminal privada de PowerShell puedes usar:

   ```powershell
   $botToken = Read-Host "Token del bot"
   $updates = (Invoke-RestMethod "https://api.telegram.org/bot$botToken/getUpdates").result
   $updates | ForEach-Object { $_.message.chat; $_.my_chat_member.chat } | Where-Object id | Sort-Object id -Unique | Select-Object id,title
   Remove-Variable botToken
   ```

   Busca la fila con el nombre del grupo y copia el ID completo, incluido el signo menos. Los grupos normales tienen ID negativo; los supergrupos suelen empezar por `-100`. No compartas el token ni lo guardes en el repositorio. Si el resultado sale vacío, envía un mensaje nuevo al grupo y repite la consulta.

## Lo que se hace en Supabase

1. Ejecuta [la migración de recordatorios](migrations/20261010_telegram_reminders.sql) en SQL Editor. La migración principal de la plataforma debe existir primero.
2. En **Edge Functions → Secrets**, crea tres valores:
   - `TELEGRAM_BOT_TOKEN`: token de BotFather.
   - `TELEGRAM_GROUP_CHAT_ID`: ID del grupo, incluido el signo menos.
   - `REMINDER_CRON_SECRET`: contraseña aleatoria larga elegida para el trabajo programado.
3. Despliega la función desde [index.ts](functions/telegram-reminders/index.ts), por ejemplo con `supabase functions deploy telegram-reminders`. La configuración `verify_jwt = false` está en [config.toml](config.toml); si la despliegas desde el Dashboard, desactiva **Verify JWT** allí.
   - Crea también el secreto `PLATFORM_URL` con la dirección completa y accesible desde el celular, por ejemplo `https://tudominio.com/plataforma`. Sin esa dirección, los avisos siguen llegando, pero no contienen enlace.
4. En **Cron → Jobs**, crea un trabajo HTTP `POST` a `https://TU_PROJECT_REF.supabase.co/functions/v1/telegram-reminders` con el encabezado `Authorization: Bearer <REMINDER_CRON_SECRET>`. Usa `0 13,14,15 * * *` UTC para enviar desde las 8 a. m. de Bogotá y reintentar a las 9 y 10 a. m. Los reintentos no duplican avisos ya entregados.

Para comprobarlo, crea una tarea pendiente con fecha de hoy y ejecuta el trabajo manualmente desde Cron. Revisa `sent` y `failed` en la respuesta o los registros de Edge Functions.

Después de actualizar la función o el código de la plataforma, vuelve a desplegar ambos. Los recordatorios ya enviados hoy no se vuelven a enviar durante el mismo día; usa una alerta de prueba nueva para verificar el enlace.

El bot usa la API gratuita de Telegram dentro de sus límites normales. Supabase puede aplicar sus cuotas de ejecución. Los mensajes incluyen nombre del cliente y descripción del aviso, por lo que el grupo debe ser privado y contener únicamente a personas autorizadas.
