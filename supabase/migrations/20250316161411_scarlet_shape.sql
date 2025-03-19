/*
  # Add sample kick counter data for months 3-7
  
  1. Data Characteristics
    - Month 3: Very few movements (just starting to feel)
    - Month 4: Increasing but still subtle movements
    - Month 5: More consistent movements
    - Month 6: Regular, stronger movements
    - Month 7: Very active periods
    
  2. Patterns
    - Multiple entries per month
    - Realistic kick counts based on gestational age
    - Varied durations and times of day
    - Natural progression in movement frequency
*/

-- Insert sample kick counter data for months 3-7
INSERT INTO kick_counters 
(user_id, kicks_count, duration_minutes, start_time, end_time, pregnancy_month)
VALUES
  -- Month 3: Very subtle, rare movements (12-16 weeks)
  ('ce737c92-be11-4007-8f22-c321047774b6', 2, 20, '2024-03-01 14:30:00+00', '2024-03-01 14:50:00+00', 3),
  ('ce737c92-be11-4007-8f22-c321047774b6', 3, 25, '2024-03-15 20:15:00+00', '2024-03-15 20:40:00+00', 3),

  -- Month 4: More noticeable but still gentle movements
  ('ce737c92-be11-4007-8f22-c321047774b6', 5, 20, '2024-04-01 15:00:00+00', '2024-04-01 15:20:00+00', 4),
  ('ce737c92-be11-4007-8f22-c321047774b6', 7, 25, '2024-04-10 19:30:00+00', '2024-04-10 19:55:00+00', 4),
  ('ce737c92-be11-4007-8f22-c321047774b6', 8, 30, '2024-04-20 21:00:00+00', '2024-04-20 21:30:00+00', 4),

  -- Month 5: Regular movements becoming stronger
  ('ce737c92-be11-4007-8f22-c321047774b6', 12, 30, '2024-05-01 16:15:00+00', '2024-05-01 16:45:00+00', 5),
  ('ce737c92-be11-4007-8f22-c321047774b6', 15, 35, '2024-05-10 20:45:00+00', '2024-05-10 21:20:00+00', 5),
  ('ce737c92-be11-4007-8f22-c321047774b6', 18, 40, '2024-05-20 14:30:00+00', '2024-05-20 15:10:00+00', 5),
  ('ce737c92-be11-4007-8f22-c321047774b6', 20, 45, '2024-05-30 22:00:00+00', '2024-05-30 22:45:00+00', 5),

  -- Month 6: Strong, regular movements
  ('ce737c92-be11-4007-8f22-c321047774b6', 22, 35, '2024-06-05 13:20:00+00', '2024-06-05 13:55:00+00', 6),
  ('ce737c92-be11-4007-8f22-c321047774b6', 25, 40, '2024-06-15 17:45:00+00', '2024-06-15 18:25:00+00', 6),
  ('ce737c92-be11-4007-8f22-c321047774b6', 28, 45, '2024-06-25 21:30:00+00', '2024-06-25 22:15:00+00', 6),

  -- Month 7: Very active periods
  ('ce737c92-be11-4007-8f22-c321047774b6', 30, 40, '2024-07-05 15:30:00+00', '2024-07-05 16:10:00+00', 7),
  ('ce737c92-be11-4007-8f22-c321047774b6', 32, 45, '2024-07-15 19:15:00+00', '2024-07-15 20:00:00+00', 7),
  ('ce737c92-be11-4007-8f22-c321047774b6', 35, 50, '2024-07-25 22:00:00+00', '2024-07-25 22:50:00+00', 7);