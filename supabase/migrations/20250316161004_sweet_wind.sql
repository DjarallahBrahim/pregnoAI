/*
  # Update kick_counters table to use pregnancy_month instead of pregnancy_week

  1. Changes
    - Drop pregnancy_week column and index
    - Add pregnancy_month column (1-10)
    - Update index for efficient querying

  2. Data Migration
    - Add new column with constraint
    - Create index for month-based queries
*/

-- Drop the old week-based column and index
DROP INDEX IF EXISTS kick_counters_week_idx;
ALTER TABLE kick_counters DROP COLUMN IF EXISTS pregnancy_week;

-- Add pregnancy_month column with constraint
ALTER TABLE kick_counters
ADD COLUMN pregnancy_month integer CHECK (pregnancy_month >= 1 AND pregnancy_month <= 10);

-- Create index for efficient querying by month
CREATE INDEX kick_counters_month_idx ON kick_counters (pregnancy_month);