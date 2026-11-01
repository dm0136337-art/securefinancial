insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'profile-photos',
  'profile-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Profile photo owners can read their files" on storage.objects;
create policy "Profile photo owners can read their files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Profile photo reads are owner restricted" on storage.objects;
create policy "Profile photo reads are owner restricted"
on storage.objects
as restrictive
for select
to public
using (
  bucket_id <> 'profile-photos'
  or (
    auth.uid() is not null
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
);

drop policy if exists "Profile photo owners can upload their files" on storage.objects;
create policy "Profile photo owners can upload their files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Profile photo inserts are owner restricted" on storage.objects;
create policy "Profile photo inserts are owner restricted"
on storage.objects
as restrictive
for insert
to public
with check (
  bucket_id <> 'profile-photos'
  or (
    auth.uid() is not null
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
);

drop policy if exists "Profile photo owners can update their files" on storage.objects;
create policy "Profile photo owners can update their files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Profile photo updates are owner restricted" on storage.objects;
create policy "Profile photo updates are owner restricted"
on storage.objects
as restrictive
for update
to public
using (
  bucket_id <> 'profile-photos'
  or (
    auth.uid() is not null
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
)
with check (
  bucket_id <> 'profile-photos'
  or (
    auth.uid() is not null
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
);

drop policy if exists "Profile photo owners can delete their files" on storage.objects;
create policy "Profile photo owners can delete their files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Profile photo deletes are owner restricted" on storage.objects;
create policy "Profile photo deletes are owner restricted"
on storage.objects
as restrictive
for delete
to public
using (
  bucket_id <> 'profile-photos'
  or (
    auth.uid() is not null
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
);

create or replace function public.set_own_profile_photo(photo_path text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_active_account() then
    raise exception 'Active account required';
  end if;

  if photo_path is not null
    and split_part(photo_path, '/', 1) <> auth.uid()::text then
    raise exception 'Profile photo path must belong to the authenticated user';
  end if;

  update public.profiles
  set photo_url = $1
  where id = auth.uid();

  if not found then
    raise exception 'Profile not found for authenticated user';
  end if;
end;
$$;

revoke all on function public.set_own_profile_photo(text) from public;
grant execute on function public.set_own_profile_photo(text) to authenticated;
