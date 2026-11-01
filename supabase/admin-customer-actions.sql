begin;

alter table public.profiles
  add column if not exists archived_at timestamptz;

create or replace function public.is_active_account()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and status = 'active'
      and archived_at is null
      and role in ('user', 'admin')
  );
$$;

alter function public.is_active_account() owner to postgres;
revoke all on function public.is_active_account() from public, anon;
grant execute on function public.is_active_account() to authenticated;

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
      and status = 'active'
      and archived_at is null
  );
$$;

alter function public.is_active_admin() owner to postgres;
revoke all on function public.is_active_admin() from public, anon;
grant execute on function public.is_active_admin() to authenticated;

drop policy if exists "Active accounts can read profiles" on public.profiles;
create policy "Active accounts can read profiles"
on public.profiles
as restrictive
for select
to authenticated
using ((select public.is_active_account()));

drop policy if exists "Active accounts can update profiles" on public.profiles;
create policy "Active accounts can update profiles"
on public.profiles
as restrictive
for update
to authenticated
using ((select public.is_active_account()))
with check ((select public.is_active_account()));

drop policy if exists "Active accounts can read accounts" on public.accounts;
create policy "Active accounts can read accounts"
on public.accounts
as restrictive
for select
to authenticated
using ((select public.is_active_account()));

drop policy if exists "Active accounts can read transactions" on public.transactions;
create policy "Active accounts can read transactions"
on public.transactions
as restrictive
for select
to authenticated
using ((select public.is_active_account()));

drop policy if exists "Active admins can read audit logs" on public.audit_logs;
create policy "Active admins can read audit logs"
on public.audit_logs
as permissive
for select
to authenticated
using ((select public.is_active_admin()));

drop policy if exists "Active admin audit access requires active account" on public.audit_logs;
create policy "Active admin audit access requires active account"
on public.audit_logs
as restrictive
for select
to authenticated
using (
  (select public.is_active_account())
  and (select public.is_active_admin())
);

drop policy if exists "Active users can access profile photos" on storage.objects;
create policy "Active users can access profile photos"
on storage.objects
as restrictive
for select
to authenticated
using (
  bucket_id <> 'profile-photos'
  or (
    auth.uid() is not null
    and (select public.is_active_account())
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
);

drop policy if exists "Active users can upload profile photos" on storage.objects;
create policy "Active users can upload profile photos"
on storage.objects
as restrictive
for insert
to authenticated
with check (
  bucket_id <> 'profile-photos'
  or (
    auth.uid() is not null
    and (select public.is_active_account())
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
);

drop policy if exists "Active users can update profile photos" on storage.objects;
create policy "Active users can update profile photos"
on storage.objects
as restrictive
for update
to authenticated
using (
  bucket_id <> 'profile-photos'
  or (
    auth.uid() is not null
    and (select public.is_active_account())
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
)
with check (
  bucket_id <> 'profile-photos'
  or (
    auth.uid() is not null
    and (select public.is_active_account())
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
);

drop policy if exists "Active users can delete profile photos" on storage.objects;
create policy "Active users can delete profile photos"
on storage.objects
as restrictive
for delete
to authenticated
using (
  bucket_id <> 'profile-photos'
  or (
    auth.uid() is not null
    and (select public.is_active_account())
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

revoke all on function public.set_own_profile_photo(text) from public, anon, authenticated;
grant execute on function public.set_own_profile_photo(text) to authenticated;

create or replace function public.admin_set_customer_status(
  p_actor_id uuid,
  p_user_id uuid,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_previous_status text;
begin
  if p_status is null or p_status not in ('active', 'suspended') then
    raise exception 'Invalid customer status';
  end if;

  if p_actor_id = p_user_id then
    raise exception 'Administrators cannot change their own customer status';
  end if;

  perform 1
  from public.profiles
  where id = p_actor_id
    and role = 'admin'
    and status = 'active'
    and archived_at is null
  for share;

  if not found then
    raise exception 'Active administrator access is required';
  end if;

  select status
  into v_previous_status
  from public.profiles
  where id = p_user_id
    and role = 'user'
    and archived_at is null
  for update;

  if not found then
    raise exception 'Active customer not found';
  end if;

  if v_previous_status = p_status then
    return;
  end if;

  update public.profiles
  set status = p_status
  where id = p_user_id;

  insert into public.audit_logs (actor_id, target_user_id, action, details)
  values (
    p_actor_id,
    p_user_id,
    case when p_status = 'suspended' then 'customer_suspended' else 'customer_reactivated' end,
    jsonb_build_object('previous_status', v_previous_status, 'status', p_status)
  );
end;
$$;

create or replace function public.admin_archive_customer(
  p_actor_id uuid,
  p_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_previous_status text;
  v_archived_at timestamptz;
begin
  if p_actor_id = p_user_id then
    raise exception 'Administrators cannot archive their own account';
  end if;

  perform 1
  from public.profiles
  where id = p_actor_id
    and role = 'admin'
    and status = 'active'
    and archived_at is null
  for share;

  if not found then
    raise exception 'Active administrator access is required';
  end if;

  select status
  into v_previous_status
  from public.profiles
  where id = p_user_id
    and role = 'user'
    and archived_at is null
  for update;

  if not found then
    raise exception 'Active customer not found';
  end if;

  v_archived_at := pg_catalog.now();

  update public.profiles
  set status = 'suspended',
      archived_at = v_archived_at
  where id = p_user_id;

  insert into public.audit_logs (actor_id, target_user_id, action, details)
  values (
    p_actor_id,
    p_user_id,
    'customer_archived',
    jsonb_build_object(
      'previous_status', v_previous_status,
      'status', 'suspended',
      'archived_at', v_archived_at,
      'financial_history_preserved', true
    )
  );
end;
$$;

revoke all on function public.admin_set_customer_status(uuid, uuid, text) from public, anon, authenticated;
revoke all on function public.admin_archive_customer(uuid, uuid) from public, anon, authenticated;
grant execute on function public.admin_set_customer_status(uuid, uuid, text) to service_role;
grant execute on function public.admin_archive_customer(uuid, uuid) to service_role;

commit;
