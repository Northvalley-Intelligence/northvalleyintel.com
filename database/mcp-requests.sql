-- Requests that arrived through the agent-native MCP surface.
--
-- Two jobs: give the write path a durable throttle that survives Worker
-- isolates, and keep an audit trail of assistant-origin requests. Rows count
-- toward the throttle in the same way workflow_chat_turns already does, so the
-- gate costs nothing beyond the D1 database this project already binds.
--
-- Contact details are stored hashed. The readable copy of a request lives in
-- the notification email, not here.

create table if not exists mcp_requests (
  id integer primary key autoincrement,
  tool text not null,
  contact_hash text not null,
  ip_hash text not null,
  -- Assistant-origin requests are always pending. No code path writes a
  -- confirmed state: the owner confirms the work, never the assistant.
  status text not null default 'pending',
  source text not null default 'mcp_assistant',
  created_at text not null
);

create index if not exists mcp_requests_created_at_idx
on mcp_requests (created_at desc);

create index if not exists mcp_requests_contact_idx
on mcp_requests (contact_hash, created_at desc);

create index if not exists mcp_requests_ip_idx
on mcp_requests (ip_hash, created_at desc);
