/*
  # Add OpenRouter API Key to Profiles

  1. Changes
    - Add openrouter_key column to profiles table
    - Add index for faster lookups
    - Maintain existing RLS policies

  2. Security
    - Ensure RLS policies cover the new column
    - Only allow users to read their own API key
*/

-- Add openrouter_key column to profiles table
ALTER TABLE profiles
ADD COLUMN openrouter_key text;

-- Add index for faster lookups
CREATE INDEX profiles_openrouter_key_idx ON profiles (openrouter_key)
WHERE openrouter_key IS NOT NULL;

-- Existing RLS policies will automatically cover the new column
-- since they're based on user ID matching