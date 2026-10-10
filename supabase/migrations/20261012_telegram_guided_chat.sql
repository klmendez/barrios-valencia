create table if not exists public.telegram_chat_drafts (
  chat_id bigint not null,
  user_id bigint not null,
  kind text not null check (kind in ('tarea', 'alerta')),
  step text not null check (step in ('case', 'title', 'date', 'time', 'url', 'confirm')),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (chat_id, user_id)
);

alter table public.telegram_chat_drafts enable row level security;
revoke all on public.telegram_chat_drafts from anon, authenticated;
grant select, insert, update, delete on public.telegram_chat_drafts to service_role;
