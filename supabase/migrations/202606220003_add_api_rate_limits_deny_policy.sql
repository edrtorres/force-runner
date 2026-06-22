drop policy if exists api_rate_limits_no_client_access on public.api_rate_limits;

create policy api_rate_limits_no_client_access
on public.api_rate_limits
for all
to authenticated
using (false)
with check (false);
