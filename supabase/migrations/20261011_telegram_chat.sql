-- Run after the Telegram reminder migration.
-- The server-side bot updates the shared snapshot with a revision check.
grant update on public.platform_state to service_role;

alter table public.telegram_group_reminder_deliveries
  add column if not exists message_id bigint,
  add column if not exists target_kind text,
  add column if not exists target_id text;

create index if not exists telegram_reminder_message_id_idx
  on public.telegram_group_reminder_deliveries (message_id)
  where message_id is not null;

create table if not exists public.telegram_processed_updates (
  update_id bigint primary key,
  received_at timestamptz not null default now()
);

alter table public.telegram_processed_updates enable row level security;
revoke all on public.telegram_processed_updates from anon, authenticated;
grant select, insert, delete on public.telegram_processed_updates to service_role;
