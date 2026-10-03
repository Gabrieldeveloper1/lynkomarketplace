insert into public.profiles (id, username, display_name)
select u.id,
       'user_' || substr(u.id::text, 1, 8),
       coalesce(u.raw_user_meta_data->>'display_name', split_part(u.email, '@', 1))
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;