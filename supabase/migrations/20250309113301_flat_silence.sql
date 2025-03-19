/*
  # Create pregnancy planning table with day specification

  1. New Table
    - `planning_tasks`
      - `id` (uuid, primary key)
      - `week` (integer) - Week number (1-42)
      - `day` (integer) - Day of the week (1-7, where 1 is Monday)
      - `category` (text) - Category name (health, finance, paperwork, family)
      - `description` (text) - Task description
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policy for public read access since this is shared data

  3. Constraints
    - Week must be between 1 and 42
    - Day must be between 1 and 7
    - Category must be one of the predefined values
*/

-- Create planning tasks table
CREATE TABLE IF NOT EXISTS planning_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week integer NOT NULL CHECK (week >= 1 AND week <= 42),
  day integer NOT NULL CHECK (day >= 1 AND day <= 7),
  category text NOT NULL CHECK (category IN ('health', 'finance', 'paperwork', 'family')),
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE planning_tasks ENABLE ROW LEVEL SECURITY;

-- Add policy for public read access
CREATE POLICY "Allow public read access to tasks" ON planning_tasks
  FOR SELECT USING (true);

-- Insert tasks for weeks 1-11 with specific days
INSERT INTO planning_tasks (week, day, category, description) VALUES
  -- Week 1
  (1, 1, 'health', 'Prendre un rendez-vous médical pour confirmer la grossesse'),
  (1, 3, 'health', 'Arrêter l''alcool, privilégier une hygiène stricte'),

  -- Week 2
  (2, 2, 'health', 'Premier RDV pour vérifier la grossesse'),
  (2, 4, 'family', 'Annoncer la grossesse à son conjoint'),

  -- Week 3
  (3, 1, 'health', 'Prendre le carnet et les antécédents médicaux'),
  (3, 3, 'paperwork', 'Débuter l''envoi de l''acide folique'),

  -- Week 4
  (4, 2, 'health', 'Premier rendez-vous médical: vérification, examens, etc'),
  (4, 4, 'health', 'Arrêter l''alcool, privilégier une hygiène stricte'),

  -- Week 5
  (5, 1, 'health', 'Mise à jour des vaccins'),
  (5, 3, 'health', 'Mise à jour des dossiers médicaux'),

  -- Week 6
  (6, 2, 'health', 'Première consultation médicale'),
  (6, 4, 'family', 'partager les préoccupations pour renforcer la communication du couple'),

  -- Week 7
  (7, 1, 'health', 'Prendre les examens prénataux pour la Trisomie'),
  (7, 3, 'health', 'Faire les premiers prélèvements'),

  -- Week 8
  (8, 2, 'health', 'Prendre les examens prénataux pour la Trisomie'),
  (8, 4, 'health', 'Faire les examens sanguins'),

  -- Week 9
  (9, 1, 'health', 'Échographie de datation, vérification du bon développement'),
  (9, 3, 'paperwork', 'Bien distribuer les tâches'),

  -- Week 10
  (10, 2, 'health', 'Vérifier son poids pour l''examen'),
  (10, 4, 'finance', 'Mise à jour des dossiers médicaux'),

  -- Week 11
  (11, 1, 'health', 'Première échographie'),
  (11, 3, 'health', 'Prendre les vitamines prénatales pour la grossesse');

-- Add index for common queries
CREATE INDEX planning_tasks_week_day_idx ON planning_tasks (week, day);