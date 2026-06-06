create table if not exists workflow_chat_turns (
  id integer primary key autoincrement,
  session_id text not null,
  turn_index integer not null,
  intent text not null,
  user_message text not null,
  assistant_reply text not null,
  response_mode text not null,
  provider text not null,
  model text not null,
  calendar_invite text not null default 'not_requested',
  ip_hash text not null,
  history_json text not null default '[]',
  reviewed_status text not null default 'unreviewed',
  reviewed_notes text,
  created_at text not null
);

create index if not exists workflow_chat_turns_created_at_idx
on workflow_chat_turns (created_at desc);

create index if not exists workflow_chat_turns_session_idx
on workflow_chat_turns (session_id, created_at desc);

create index if not exists workflow_chat_turns_ip_hash_idx
on workflow_chat_turns (ip_hash, created_at desc);

create index if not exists workflow_chat_turns_intent_idx
on workflow_chat_turns (intent, created_at desc);
