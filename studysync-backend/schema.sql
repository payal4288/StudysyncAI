-- StudySync AI Database Schema (Supabase PostgreSQL)

-- 1. Documents table: stores uploaded PDF metadata and extracted text
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  extracted_text text not null,
  created_at timestamptz default now()
);

-- 2. Chat history table: stores student doubts and AI responses linked to the document
create table if not exists public.chat_history (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.documents enable row level security;
alter table public.chat_history enable row level security;

-- Default policies (allow service role full access; customizable for authenticated users)
create policy "Allow service_role full access to documents"
  on public.documents
  for all
  using (true)
  with check (true);

create policy "Allow service_role full access to chat_history"
  on public.chat_history
  for all
  using (true)
  with check (true);
