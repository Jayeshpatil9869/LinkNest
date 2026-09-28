-- Allow the Reference category on existing urls rows.
-- Run once in the Supabase SQL editor.

alter table public.urls drop constraint if exists urls_category_check;

alter table public.urls
  add constraint urls_category_check
  check (
    category is null
    or category in (
      'Reference',
      'Design',
      'Development',
      'Inspiration',
      'Tools',
      'Articles',
      'Resources'
    )
  );
