/*
  # Create Pregnancy Profiles Schema

  1. New Tables
    - `pregnancy_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text) - User's preferred name/nickname
      - `date_of_birth` (date) - User's birthday
      - `last_menstrual_period` (date) - LMP date for due date calculation
      - `due_date` (date) - Calculated or adjusted due date
      - `initial_mood` (smallint) - Initial mood selection (0-4)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on pregnancy_profiles table
    - Add policies for authenticated users to:
      - Read their own profile
      - Create their profile
      - Update their own profile

  3. Constraints
    - One profile per user (unique user_id)
    - Required fields: name, date_of_birth, last_menstrual_period, due_date
    - Mood must be between 0 and 4
*/

-- Create the pregnancy_profiles table
CREATE TABLE pregnancy_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  date_of_birth date NOT NULL,
  last_menstrual_period date NOT NULL,
  due_date date NOT NULL,
  initial_mood smallint CHECK (initial_mood >= 0 AND initial_mood <= 4),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE pregnancy_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own pregnancy profile"
  ON pregnancy_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their pregnancy profile"
  ON pregnancy_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pregnancy profile"
  ON pregnancy_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_pregnancy_profiles_updated_at
  BEFORE UPDATE
  ON pregnancy_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();