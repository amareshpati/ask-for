-- ============================================
-- Interactive Surprise Invitations - Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: invitations
-- ============================================
CREATE TABLE IF NOT EXISTS invitations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'date' CHECK (type IN ('date', 'travel')),
  recipient_name TEXT NOT NULL,
  welcome_message TEXT NOT NULL,
  favourite_food TEXT NOT NULL,
  favourite_location TEXT NOT NULL,
  final_question TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'shared', 'responded')),
  unique_slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations(unique_slug);
CREATE INDEX IF NOT EXISTS idx_invitations_user ON invitations(user_id);

-- ============================================
-- Table: invitation_responses
-- ============================================
CREATE TABLE IF NOT EXISTS invitation_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  response TEXT NOT NULL CHECK (response IN ('yes', 'maybe', 'no')),
  selected_date DATE,
  selected_time_slot TEXT,
  selected_food TEXT,
  selected_location TEXT,
  responded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(invitation_id)
);

-- ============================================
-- Migration Commands (Run this if tables already exist)
-- ============================================
-- ALTER TABLE invitation_responses ADD COLUMN IF NOT EXISTS selected_food TEXT;
-- ALTER TABLE invitation_responses ADD COLUMN IF NOT EXISTS selected_location TEXT;
-- CREATE POLICY "Anyone can update a response" ON invitation_responses FOR UPDATE USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_responses_invitation ON invitation_responses(invitation_id);

-- ============================================
-- Row Level Security
-- ============================================

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_responses ENABLE ROW LEVEL SECURITY;

-- Invitations policies
CREATE POLICY "Users can view own invitations"
  ON invitations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invitations"
  ON invitations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invitations"
  ON invitations FOR DELETE
  USING (auth.uid() = user_id);

-- Public read for invitation by slug (for recipients)
CREATE POLICY "Anyone can view invitation by slug"
  ON invitations FOR SELECT
  USING (true);

-- Response policies
CREATE POLICY "Anyone can create a response"
  ON invitation_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view responses to their invitations"
  ON invitation_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM invitations
      WHERE invitations.id = invitation_responses.invitation_id
      AND invitations.user_id = auth.uid()
    )
  );

-- Allow public read of responses for checking if already answered
CREATE POLICY "Anyone can check if response exists"
  ON invitation_responses FOR SELECT
  USING (true);

-- Allow public update of responses
CREATE POLICY "Anyone can update a response"
  ON invitation_responses FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Function: Update updated_at on invitations
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Trigger: Update status to 'responded' on new response
-- ============================================
CREATE OR REPLACE FUNCTION update_invitation_status_on_response()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE invitations
  SET status = 'responded'
  WHERE id = NEW.invitation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_invitation_status
  AFTER INSERT ON invitation_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_invitation_status_on_response();
