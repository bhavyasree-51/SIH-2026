create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  mobile_number text not null,
  role text not null default 'FARMER' check (role in ('FARMER', 'ADMIN')),
  state text not null,
  district text not null,
  village text not null,
  preferred_language text not null default 'en' check (preferred_language in ('en', 'hi', 'te')),
  farm_size numeric not null check (farm_size >= 0),
  main_crop text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Users can read their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Admins can read profiles" on public.profiles for select using ((auth.jwt()->'app_metadata'->>'role') = 'ADMIN');
create policy "Farmers can create their own farmer profile" on public.profiles for insert with check (auth.uid() = id and role = 'FARMER');
create policy "Users can update their own non-role profile fields" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id and role = (select p.role from public.profiles p where p.id = auth.uid()));

create or replace function public.handle_new_farmer()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, mobile_number, role, state, district, village, preferred_language, farm_size, main_crop)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email, coalesce(new.raw_user_meta_data->>'mobile_number', ''), 'FARMER', coalesce(new.raw_user_meta_data->>'state', ''), coalesce(new.raw_user_meta_data->>'district', ''), coalesce(new.raw_user_meta_data->>'village', ''), coalesce(new.raw_user_meta_data->>'preferred_language', 'en'), coalesce((new.raw_user_meta_data->>'farm_size')::numeric, 0), coalesce(new.raw_user_meta_data->>'main_crop', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_farmer on auth.users;
create trigger on_auth_user_created_farmer after insert on auth.users for each row execute procedure public.handle_new_farmer();

-- Assign ADMIN only from the Supabase dashboard or a trusted server-side process.
-- Never expose a service-role key in the frontend.
