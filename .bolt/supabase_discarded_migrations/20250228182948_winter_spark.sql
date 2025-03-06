/*
  # Pregnancy Tracking Schema

  1. New Tables
    - `pregnancies`
      - Core table for tracking pregnancy information
      - Stores due date, LMP date, and basic pregnancy data
      - Links to user profile
    
    - `pregnancy_logs`
      - Daily tracking of mood and notes
      - Enables historical mood tracking
      - One-to-many relationship with pregnancies

  2. Security
    - RLS enabled on all tables
    - Policies ensure users can only access their own data
    - Authenticated users can read/write their own records

  3. Changes
    - Adds foreign key constraints for data integrity
    - Creates indexes for common query patterns
    - Implements automatic timestamp management
*/

-- Create pregnancies table
CREATE TABLE pregnancies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  date_of_birth date NOT NULL,
  last_menstrual_period date NOT NULL,
  due_date date NOT NULL,
  initial_mood smallint CHECK (initial_mood >= 0 AND initial_mood <= 4),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure one active pregnancy per user
  UNIQUE (user_id)
);

-- Create pregnancy_logs table for daily tracking
CREATE TABLE pregnancy_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pregnancy_id uuid REFERENCES pregnancies ON DELETE CASCADE NOT NULL,
  log_date date DEFAULT CURRENT_DATE NOT NULL,
  mood smallint CHECK (mood >= 0 AND mood <= 4),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure one log per day per pregnancy
  UNIQUE (pregnancy_id, log_date)
);

-- Enable RLS
ALTER TABLE pregnancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE pregnancy_logs ENABLE ROW LEVEL SECURITY;

-- Policies for pregnancies table
CREATE POLICY "Users can view own pregnancy"
  ON pregnancies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pregnancy"
  ON pregnancies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pregnancy"
  ON pregnancies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for pregnancy_logs table
CREATE POLICY "Users can view own pregnancy logs"
  ON pregnancy_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pregnancies
      WHERE id = pregnancy_logs.pregnancy_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own pregnancy logs"
  ON pregnancy_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pregnancies
      WHERE id = pregnancy_logs.pregnancy_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own pregnancy logs"
  ON pregnancy_logs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pregnancies
      WHERE id = pregnancy_logs.pregnancy_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pregnancies
      WHERE id = pregnancy_logs.pregnancy_id
      AND user_id = auth.uid()
    )
  );

-- Create indexes for common queries
CREATE INDEX pregnancies_user_id_idx ON pregnancies(user_id);
CREATE INDEX pregnancy_logs_pregnancy_id_idx ON pregnancy_logs(pregnancy_id);
CREATE INDEX pregnancy_logs_log_date_idx ON pregnancy_logs(log_date);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_pregnancies_updated_at
  BEFORE UPDATE ON pregnancies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pregnancy_logs_updated_at
  BEFORE UPDATE ON pregnancy_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();