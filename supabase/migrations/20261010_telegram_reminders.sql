-- Run after 20261009_platform_storage.sql.
-- A single private Telegram group receives all reminders.
-- The Edge Function reads the shared state with the service role.
grant select on public.platform_state to service_role;

create table if not exists public.telegram_group_reminder_deliveries (
  reminder_key text not null,
  reminder_date date not null,
  sent_at timestamptz,
  primary key (reminder_key, reminder_date)
);

alter table public.telegram_group_reminder_deliveries enable row level security;
revoke all on public.telegram_group_reminder_deliveries from anon, authenticated;
grant select, insert, update, delete on public.telegram_group_reminder_deliveries to service_role;

-- Atomic reservation prevents duplicate sends if scheduled runs overlap.
create or replace function public.claim_telegram_group_reminder(item_key text, item_date date)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.telegram_group_reminder_deliveries (reminder_key, reminder_date)
  values (item_key, item_date)
  on conflict do nothing;
  return found;
end;
$$;

revoke all on function public.claim_telegram_group_reminder(text, date) from public, anon, authenticated;
grant execute on function public.claim_telegram_group_reminder(text, date) to service_role;
