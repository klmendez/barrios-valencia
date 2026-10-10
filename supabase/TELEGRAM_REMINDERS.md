# Recordatorios en un grupo de Telegram

Los avisos de tareas, alertas y vencimientos llegan a un único grupo privado de Telegram. El bot anuncia tareas y alertas nuevas, y después avisa 3, 2 y 1 día antes y el día de la fecha programada. Si se registró una hora, avisa también una hora antes. Las anotaciones con fecha de recordatorio siguen avisando ese día. Los cálculos usan la hora de Bogotá y la base de datos evita duplicados.

Cada aviso incluye un enlace al expediente en `https://www.barriosvalencia.com/plataforma`. `PLATFORM_URL` permite cambiar esa dirección si el dominio de la plataforma cambia. Si el asunto de una alerta contiene «audiencia», el mensaje indica que la audiencia es hoy, muestra el asunto y el nombre del cliente. El enlace abre el expediente después de iniciar sesión en la plataforma.

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

1. Ejecuta [la migración de recordatorios](migrations/20261010_telegram_reminders.sql), [la migración del chat](migrations/20261011_telegram_chat.sql) y [la migración del chat guiado](migrations/20261012_telegram_guided_chat.sql), en ese orden, en SQL Editor. La migración principal de la plataforma debe existir primero. Si las dos primeras ya están aplicadas, ejecuta solo la tercera.
2. En **Edge Functions → Secrets**, crea tres valores:
   - `TELEGRAM_BOT_TOKEN`: token de BotFather.
   - `TELEGRAM_GROUP_CHAT_ID`: ID del grupo, incluido el signo menos.
   - `REMINDER_CRON_SECRET`: contraseña aleatoria larga elegida para el trabajo programado.
3. Despliega la función desde [index.ts](functions/telegram-reminders/index.ts), por ejemplo con `supabase functions deploy telegram-reminders`. La configuración `verify_jwt = false` está en [config.toml](config.toml); si la despliegas desde el Dashboard, desactiva **Verify JWT** allí.
   - Si cambias el dominio, crea el secreto `PLATFORM_URL` con la dirección completa y accesible desde el celular, por ejemplo `https://tudominio.com/plataforma`.
4. En **Cron → Jobs**, edita el trabajo HTTP existente `telegram-recordatorios` (o crea uno) para llamar con `POST` a `https://TU_PROJECT_REF.supabase.co/functions/v1/telegram-reminders` con el encabezado `Authorization: Bearer <REMINDER_CRON_SECRET>`. Usa `*/5 * * * *` GMT, cada cinco minutos. Mantén el timeout máximo que admite el formulario. La función comprueba qué avisos corresponden en ese momento y evita enviarlos dos veces.

## Comandos desde el grupo

1. Despliega también [telegram-chat](functions/telegram-chat/index.ts) en Edge Functions con **Verify JWT OFF**. Comparte con `telegram-reminders` los secretos `TELEGRAM_BOT_TOKEN` y `TELEGRAM_GROUP_CHAT_ID`.
2. Crea en **Edge Functions → Secrets** `TELEGRAM_WEBHOOK_SECRET`: un valor aleatorio de 32 caracteres o más que use solo letras, números, guiones o guiones bajos. Guarda una copia privada para configurarlo en Telegram.
3. Configura el webhook del bot en `https://TU_PROJECT_REF.supabase.co/functions/v1/telegram-chat` mediante `setWebhook`, enviando ese mismo valor como `secret_token` y `allowed_updates` como `["message"]`. Telegram enviará ese secreto en `X-Telegram-Bot-Api-Secret-Token`; la función rechaza solicitudes que no coincidan. [Documentación de Telegram](https://core.telegram.org/bots/api#setwebhook).

   Desde PowerShell puedes configurarlo sin guardar el token en archivos ni escribirlo en el historial de comandos. Sustituye solo la dirección del proyecto:

   ```powershell
   $botTokenSecure = Read-Host "Token del bot" -AsSecureString
   $webhookSecretSecure = Read-Host "TELEGRAM_WEBHOOK_SECRET" -AsSecureString
   $botToken = [System.Net.NetworkCredential]::new("", $botTokenSecure).Password
   $webhookSecret = [System.Net.NetworkCredential]::new("", $webhookSecretSecure).Password
   $webhookBody = @{ url = "https://ecrqjtvaymwvaoshdcmg.supabase.co/functions/v1/telegram-chat"; secret_token = $webhookSecret; allowed_updates = @("message") } | ConvertTo-Json -Compress
   Invoke-RestMethod -Method Post -Uri "https://api.telegram.org/bot$botToken/setWebhook" -ContentType "application/json" -Body $webhookBody
   Remove-Variable botToken, webhookSecret, botTokenSecure, webhookSecretSecure, webhookBody
   ```

   La respuesta debe incluir `ok: true`.
4. Mantén el grupo privado e invita solo a Juan y Luis. El bot acepta cambios enviados en ese grupo; no hace falta registrar sus IDs como secretos. Cada cambio guarda el nombre y el ID de Telegram del remitente en el historial del expediente.
5. Usa estos comandos en el grupo privado:

   ```text
   /tarea BV-123 | Preparar audiencia | 2026-10-15 | 09:00
   /alerta BV-123 | Audiencia de conciliación | 2026-10-15 | 09:00
   ```

   La hora es opcional. Para completar un pendiente, responde al recordatorio o a la confirmación de creación del bot con `/hecho`, `tarea realizada` o `alerta realizada`. También se puede usar `/hecho T-...` o `/hecho A-...` con el código que responde el bot. Cualquier integrante humano del grupo puede usar estos comandos; si alguien más entra al grupo, también tendría acceso a los cambios.

6. Para crear sin recordar el formato, envía `/menu` y toca `/crear_tarea` o `/crear_alerta`. El bot pregunta por el expediente, la descripción, la fecha y la hora. Para una alerta también pregunta por el enlace de la audiencia o reunión. Responde a cada pregunta del bot; puedes escribir `Omitir` cuando el dato sea opcional y `Cancelar` para salir. El expediente se puede identificar por código BV o por una parte única del nombre del cliente. La tarea o alerta solo se guarda después de responder `Confirmar`.

Los recordatorios de tareas de llamada incluyen el celular guardado en el expediente. Los avisos de audiencia incluyen el enlace guardado en la alerta, cuando exista, y todos los avisos incluyen el enlace al expediente. La plataforma también ofrece un campo de enlace al crear una alerta de calendario.

Para comprobarlo, crea una tarea pendiente con fecha de hoy y ejecuta el trabajo manualmente desde Cron. Revisa `sent` y `failed` en la respuesta o los registros de Edge Functions. Para el chat, usa `/ayuda@BarriosValenciaAvisos_bot` después de configurar el webhook.

Después de actualizar la función o el código de la plataforma, vuelve a desplegar ambos. Los recordatorios ya enviados hoy no se vuelven a enviar durante el mismo día; usa una alerta de prueba nueva para verificar el enlace.

El bot usa la API gratuita de Telegram dentro de sus límites normales. Supabase puede aplicar sus cuotas de ejecución. Los mensajes incluyen nombre del cliente y descripción del aviso, por lo que el grupo debe ser privado y contener únicamente a personas autorizadas.
