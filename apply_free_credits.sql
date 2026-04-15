-- Run this in your Supabase SQL Editor to grant existing users the 25 free credits!
UPDATE public.api_keys
SET credits_left = 25
WHERE credits_left = 0 AND key IS NOT NULL;
