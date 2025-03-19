/*
  # Create Kick Counter Table

  1. New Table
    - `kick_counters`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `kicks_count` (integer) - Number of kicks recorded
      - `duration_minutes` (integer) - Duration of the counting session
      - `start_time` (timestamptz) - When the counting session started
      - `end_time` (timestamptz) - When the counting session ended
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on kick_counters table
    - Add policies for authenticated users to:
      - Create their own kick counter records
      - Read their own kick counter records
      - No update/delete policies (immutable records)

  3. Indexes
    - Index on user_id and start_time for efficient querying
*/

-- Create kick_counters table
CREATE TABLE kick_counters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  kicks_count integer NOT NULL CHECK (kicks_count >= 0),
  duration_minutes integer NOT NULL CHECK (duration_minutes >= 0),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  -- Ensure end_time is after start_time
  CONSTRAINT end_time_after_start_time CHECK (end_time > start_time)
);

-- Enable Row Level Security
ALTER TABLE kick_counters ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own kick counter records"
  ON kick_counters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own kick counter records"
  ON kick_counters
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for efficient querying
CREATE INDEX kick_counters_user_time_idx ON kick_counters (user_id, start_time DESC);