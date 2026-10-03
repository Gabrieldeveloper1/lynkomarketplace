create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base text;
  candidate text;
  i int := 0;
begin
  base := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username', ''), '[^a-zA-Z0-9_]', '', 'g'));
  if length(base) < 3 then
    base := 'user_' || substr(new.id::text, 1, 8);
  end if;
  candidate := base;
  while exists (select 1 from public.profiles p where p.username = candidate) loop
    i := i + 1;
    candidate := base || i::text;
  end loop;

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    candidate,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.lock_username()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.username is distinct from old.username
     and old.username !~ '^user_[0-9a-f]{8}$' then
    raise exception 'O nome de usuário não pode ser alterado.';
  end if;
  return new;
end;
$$;

drop trigger if exists lock_username_on_profiles on public.profiles;
create trigger lock_username_on_profiles
before update on public.profiles
for each row execute function public.lock_username();