-- Aesthetic Proof: Supabase SQL Schema Setup
-- Safe to re-run: uses IF NOT EXISTS and OR REPLACE throughout.

-- 1. Create a table for users to store extra metadata (synced with auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create api_keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  key TEXT UNIQUE NOT NULL,
  credits_left INTEGER DEFAULT 25 CHECK (credits_left >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (drop first so re-runs don't error)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own api keys" ON public.api_keys;
CREATE POLICY "Users can view own api keys" ON public.api_keys
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own api keys" ON public.api_keys;
CREATE POLICY "Users can insert own api keys" ON public.api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Helper Function & Trigger to sync auth.users -> public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Grant Permissions (if needed, usually handled by Supabase)
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.api_keys TO authenticated;

-- 7. RPC Function to increment credits (used by Stripe Webhook via Service Role)
CREATE OR REPLACE FUNCTION public.increment_credits(user_id_param UUID, increment_amount INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.api_keys
  SET credits_left = credits_left + increment_amount,
      updated_at = NOW()
  WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. RPC Function to atomically deduct one credit (used by generate route via Service Role)
-- Returns TRUE if a credit was deducted, FALSE if the user had 0 credits.
CREATE OR REPLACE FUNCTION public.decrement_credit(user_id_param UUID)
RETURNS boolean AS $$
DECLARE
  rows_affected INTEGER;
BEGIN
  UPDATE public.api_keys
  SET credits_left = credits_left - 1,
      updated_at = NOW()
  WHERE user_id = user_id_param
    AND credits_left > 0;

  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
