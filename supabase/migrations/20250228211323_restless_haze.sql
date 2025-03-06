/*
  # Create Auth and Profiles Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `email` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users to:
      - View own profile
      - Update own profile

  3. Automation
    - Add trigger for automatic user profile creation
    - Add function to handle username conflicts
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user creation with improved error handling
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

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();