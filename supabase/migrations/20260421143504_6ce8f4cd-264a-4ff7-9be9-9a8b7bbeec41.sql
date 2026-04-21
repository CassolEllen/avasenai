-- Remove broad public SELECT policy on avatars and rely on public URL access only
DROP POLICY IF EXISTS "Avatars publicly viewable" ON storage.objects;

-- Make bucket non-listable but still accessible via public URLs (public flag stays true)
-- Public URL fetches don't go through RLS SELECT, so images still load.
-- For in-app gallery listing, restrict to owner's folder only.
CREATE POLICY "Users list own avatar folder"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);