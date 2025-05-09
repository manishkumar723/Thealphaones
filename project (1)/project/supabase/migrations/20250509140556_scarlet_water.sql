/*
  # Initial database schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users.id)
      - `full_name` (text)
      - `username` (text, unique)
      - `gender` (text)
      - `dob` (date)
      - `skill_level` (text)
      - `college_name` (text)
      - `preferred_language` (text)
      - `created_at` (timestamptz)
    - `rooms`
      - `id` (uuid, primary key)
      - `room_id` (text, unique)
      - `name` (text)
      - `host_id` (uuid, references profiles.id)
      - `max_participants` (integer)
      - `password` (text)
      - `duration_minutes` (integer)
      - `is_private` (boolean)
      - `programming_language` (text)
      - `difficulty` (text)
      - `status` (text)
      - `created_at` (timestamptz)
    - `room_participants`
      - `id` (uuid, primary key)
      - `room_id` (uuid, references rooms.id)
      - `user_id` (uuid, references profiles.id)
      - `joined_at` (timestamptz)
    - `submissions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `room_id` (uuid, references rooms.id, nullable)
      - `code` (text)
      - `language` (text)
      - `result` (json)
      - `score` (integer)
      - `time_complexity` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  username text UNIQUE,
  gender text,
  dob date,
  skill_level text,
  college_name text,
  preferred_language text,
  created_at timestamptz DEFAULT now()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text UNIQUE NOT NULL,
  name text NOT NULL,
  host_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  max_participants integer DEFAULT 10,
  password text,
  duration_minutes integer DEFAULT 60,
  is_private boolean DEFAULT false,
  programming_language text DEFAULT 'cpp',
  difficulty text DEFAULT 'medium',
  status text DEFAULT 'waiting',
  created_at timestamptz DEFAULT now()
);

-- Create room_participants table
CREATE TABLE IF NOT EXISTS room_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  room_id uuid REFERENCES rooms(id) ON DELETE SET NULL,
  code text NOT NULL,
  language text NOT NULL,
  result jsonb,
  score integer,
  time_complexity text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Rooms policies
CREATE POLICY "Anyone can read public rooms"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Host can update their own rooms"
  ON rooms
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id);

CREATE POLICY "Host can delete their own rooms"
  ON rooms
  FOR DELETE
  TO authenticated
  USING (auth.uid() = host_id);

CREATE POLICY "Authenticated users can create rooms"
  ON rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id);

-- Room participants policies
CREATE POLICY "Anyone can read room participants"
  ON room_participants
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join rooms"
  ON room_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms"
  ON room_participants
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Submissions policies
CREATE POLICY "Users can read their own submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Room host can read submissions for their room"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM rooms 
    WHERE rooms.id = submissions.room_id 
    AND rooms.host_id = auth.uid()
  ));

CREATE POLICY "Users can create their own submissions"
  ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions"
  ON submissions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);