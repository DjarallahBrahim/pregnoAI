/*
  # Fix user profile creation trigger

  1. Changes
    - Modify profile creation trigger to properly handle new user registration
    - Add proper error handling
    - Ensure username is properly set from auth metadata
    
  2. Security
    - Maintain existing RLS policies
    - Keep security definer setting for proper privilege escalation
*/

-- Drop existing trigger and function to recreate them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Recreate the function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  username_val TEXT;
BEGIN
  -- Get username from metadata if available, otherwise use email
  username_val := COALESCE(
    (new.raw_user_meta_data->>'username')::TEXT,
    SPLIT_PART(new.email, '@', 1)
  );

  -- Insert new profile
  INSERT INTO public.profiles (
    id,
    email,
    username,
    created_at,
    updated_at
  ) VALUES (
    new.id,
    new.email,
    username_val,
    now(),
    now()
  );

  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- Handle duplicate username
    username_val := username_val || '_' || FLOOR(RANDOM() * 1000)::TEXT;
    
    INSERT INTO public.profiles (
      id,
      email,
      username,
      created_at,
      updated_at
    ) VALUES (
      new.id,
      new.email,
      username_val,
      now(),
      now()
    );
    
    RETURN new;
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating user profile: %', SQLERRM;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();