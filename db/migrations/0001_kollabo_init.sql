-- ============================================================
-- KOLLABO — Migration initiale
-- Supabase Postgres + RLS
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- pour la recherche full-text

-- Enums
DO $$ BEGIN
  CREATE TYPE user_type AS ENUM ('creator', 'brand', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE kyc_status AS ENUM ('not_started', 'pending', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE campaign_status AS ENUM ('draft', 'open', 'closed', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE contract_status AS ENUM ('pending_signatures', 'active', 'in_delivery', 'completed', 'disputed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE escrow_status AS ENUM ('initiated', 'held', 'released', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE deliverable_type AS ENUM ('post', 'story', 'reel', 'video', 'thread');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE deliverable_status AS ENUM ('pending', 'submitted', 'approved', 'revision_requested', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('wave', 'orange_money', 'mtn_money', 'card_cinetpay');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE social_platform AS ENUM ('instagram', 'tiktok', 'youtube', 'twitter', 'facebook');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  user_type user_type NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL DEFAULT 'CI',
  city TEXT,
  avatar_url TEXT,
  kyc_status kyc_status NOT NULL DEFAULT 'not_started',
  kyc_documents JSONB,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_step INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  bio TEXT,
  niche TEXT[] NOT NULL DEFAULT '{}',
  instagram_handle TEXT,
  instagram_followers INTEGER,
  instagram_verified BOOLEAN NOT NULL DEFAULT FALSE,
  instagram_access_token TEXT,
  tiktok_handle TEXT,
  tiktok_followers INTEGER,
  tiktok_verified BOOLEAN NOT NULL DEFAULT FALSE,
  youtube_handle TEXT,
  youtube_subscribers INTEGER,
  youtube_verified BOOLEAN NOT NULL DEFAULT FALSE,
  base_rate_post INTEGER,
  base_rate_story INTEGER,
  base_rate_reel INTEGER,
  base_rate_video INTEGER,
  languages TEXT[] NOT NULL DEFAULT '{}',
  cities_covered TEXT[] NOT NULL DEFAULT '{}',
  rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  total_earned_xof INTEGER NOT NULL DEFAULT 0,
  completed_campaigns INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  rib_wave TEXT,
  rib_orange_money TEXT
);

CREATE TABLE IF NOT EXISTS brand_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  legal_form TEXT,
  rccm TEXT,
  dfe TEXT,
  sector TEXT,
  website TEXT,
  logo_url TEXT,
  contact_role TEXT,
  billing_address JSONB,
  total_spent_xof INTEGER NOT NULL DEFAULT 0,
  completed_campaigns INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  brief_md TEXT NOT NULL,
  deliverables JSONB NOT NULL DEFAULT '[]',
  budget_xof INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'XOF',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status campaign_status NOT NULL DEFAULT 'draft',
  niche_targeted TEXT[] NOT NULL DEFAULT '{}',
  min_followers INTEGER,
  application_deadline TIMESTAMPTZ,
  is_invite_only BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pitch_text TEXT NOT NULL,
  proposed_price_xof INTEGER NOT NULL,
  proposed_deliverables JSONB NOT NULL DEFAULT '[]',
  status application_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(campaign_id, creator_id)
);

CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id),
  brand_id UUID NOT NULL REFERENCES profiles(id),
  creator_id UUID NOT NULL REFERENCES profiles(id),
  agreed_price_xof INTEGER NOT NULL,
  platform_fee_xof INTEGER NOT NULL,
  platform_fee_tva_xof INTEGER NOT NULL,
  creator_net_xof INTEGER NOT NULL,
  ras_amount_xof INTEGER NOT NULL DEFAULT 0,
  ras_applied BOOLEAN NOT NULL DEFAULT FALSE,
  deliverables_locked JSONB NOT NULL DEFAULT '[]',
  contract_pdf_url TEXT,
  contract_hash TEXT,
  yousign_envelope_id TEXT,
  signed_by_brand_at TIMESTAMPTZ,
  brand_signature_meta JSONB,
  signed_by_creator_at TIMESTAMPTZ,
  creator_signature_meta JSONB,
  status contract_status NOT NULL DEFAULT 'pending_signatures',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS escrow_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id),
  amount_xof INTEGER NOT NULL,
  payment_method payment_method NOT NULL,
  cinetpay_transaction_id TEXT,
  status escrow_status NOT NULL DEFAULT 'initiated',
  initiated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  held_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  type deliverable_type NOT NULL,
  description TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  proof_url TEXT,
  proof_platform social_platform,
  proof_published_at TIMESTAMPTZ,
  status deliverable_status NOT NULL DEFAULT 'pending',
  revision_note TEXT,
  approved_at TIMESTAMPTZ,
  auto_released_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id),
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  reviewee_id UUID NOT NULL REFERENCES profiles(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(contract_id, reviewer_id)
);

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL UNIQUE REFERENCES contracts(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES profiles(id),
  creator_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  attachments JSONB NOT NULL DEFAULT '[]',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  available_balance_xof INTEGER NOT NULL DEFAULT 0,
  pending_balance_xof INTEGER NOT NULL DEFAULT 0,
  preferred_payout_method payment_method,
  payout_details JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id),
  amount_xof INTEGER NOT NULL,
  method payment_method NOT NULL,
  status payout_status NOT NULL DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  cinetpay_payout_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_export_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  export_url TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS data_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  scheduled_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEX
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_creator_profiles_niche ON creator_profiles USING GIN (niche);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_rating ON creator_profiles (rating_avg DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns (status);
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON campaigns (brand_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_niche ON campaigns USING GIN (niche_targeted);
CREATE INDEX IF NOT EXISTS idx_applications_campaign_id ON applications (campaign_id);
CREATE INDEX IF NOT EXISTS idx_applications_creator_id ON applications (creator_id);
CREATE INDEX IF NOT EXISTS idx_contracts_brand_id ON contracts (brand_id);
CREATE INDEX IF NOT EXISTS idx_contracts_creator_id ON contracts (creator_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts (status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications (user_id) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log (entity_type, entity_id);

-- ============================================================
-- TRIGGER : updated_at automatique
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TRIGGER : créer profil + wallet après inscription Supabase
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_type user_type;
  v_company_name TEXT;
BEGIN
  v_user_type := COALESCE(NEW.raw_user_meta_data->>'user_type', 'creator')::user_type;
  v_company_name := NEW.raw_user_meta_data->>'company_name';

  INSERT INTO profiles (id, user_type, full_name, phone)
  VALUES (
    NEW.id,
    v_user_type,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'phone'
  );

  IF v_user_type = 'creator' THEN
    INSERT INTO creator_profiles (profile_id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

    INSERT INTO wallets (creator_id) VALUES (NEW.id);
  END IF;

  IF v_user_type = 'brand' THEN
    INSERT INTO brand_profiles (profile_id, company_name)
    VALUES (NEW.id, COALESCE(v_company_name, 'Mon entreprise'));
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- RLS — Row Level Security
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_export_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_deletion_requests ENABLE ROW LEVEL SECURITY;

-- ---- Profiles ----
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profils créateurs publics : lisibles par tout le monde (pour la marketplace)
CREATE POLICY "creator_profiles_select_public" ON creator_profiles
  FOR SELECT USING (
    is_active = TRUE
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'admin')
    OR profile_id = auth.uid()
  );

CREATE POLICY "creator_profiles_update_own" ON creator_profiles
  FOR UPDATE USING (profile_id = auth.uid());

-- ---- Brand profiles ----
CREATE POLICY "brand_profiles_select_own" ON brand_profiles
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "brand_profiles_update_own" ON brand_profiles
  FOR UPDATE USING (profile_id = auth.uid());

-- ---- Campaigns ----
-- Marques voient leurs propres campagnes
CREATE POLICY "campaigns_select_own_brand" ON campaigns
  FOR SELECT USING (brand_id = auth.uid());

-- Campagnes ouvertes visibles par les créateurs
CREATE POLICY "campaigns_select_open_creators" ON campaigns
  FOR SELECT USING (
    status = 'open'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'creator')
  );

CREATE POLICY "campaigns_insert_own" ON campaigns
  FOR INSERT WITH CHECK (brand_id = auth.uid());

CREATE POLICY "campaigns_update_own" ON campaigns
  FOR UPDATE USING (brand_id = auth.uid());

-- ---- Applications ----
CREATE POLICY "applications_select_brand" ON applications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM campaigns WHERE id = campaign_id AND brand_id = auth.uid())
  );

CREATE POLICY "applications_select_own_creator" ON applications
  FOR SELECT USING (creator_id = auth.uid());

CREATE POLICY "applications_insert_creator" ON applications
  FOR INSERT WITH CHECK (
    creator_id = auth.uid()
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'creator')
  );

CREATE POLICY "applications_update_own_creator" ON applications
  FOR UPDATE USING (creator_id = auth.uid() AND status = 'pending');

-- ---- Contracts ----
CREATE POLICY "contracts_select_parties" ON contracts
  FOR SELECT USING (brand_id = auth.uid() OR creator_id = auth.uid());

CREATE POLICY "contracts_update_parties" ON contracts
  FOR UPDATE USING (brand_id = auth.uid() OR creator_id = auth.uid());

-- ---- Escrow ----
CREATE POLICY "escrow_select_brand" ON escrow_transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM contracts WHERE id = contract_id AND brand_id = auth.uid())
  );

CREATE POLICY "escrow_select_creator" ON escrow_transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM contracts WHERE id = contract_id AND creator_id = auth.uid())
  );

-- ---- Deliverables ----
CREATE POLICY "deliverables_select_parties" ON deliverables
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contracts
      WHERE id = contract_id AND (brand_id = auth.uid() OR creator_id = auth.uid())
    )
  );

CREATE POLICY "deliverables_insert_creator" ON deliverables
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM contracts
      WHERE id = contract_id AND creator_id = auth.uid() AND status = 'in_delivery'
    )
  );

CREATE POLICY "deliverables_update_creator" ON deliverables
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM contracts WHERE id = contract_id AND creator_id = auth.uid()
    )
  );

-- ---- Reviews ----
CREATE POLICY "reviews_select_public" ON reviews
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "reviews_select_own" ON reviews
  FOR SELECT USING (reviewer_id = auth.uid() OR reviewee_id = auth.uid());

CREATE POLICY "reviews_insert_parties" ON reviews
  FOR INSERT WITH CHECK (
    reviewer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM contracts
      WHERE id = contract_id
        AND status = 'completed'
        AND (brand_id = auth.uid() OR creator_id = auth.uid())
    )
  );

-- ---- Messages ----
CREATE POLICY "conversations_select_parties" ON conversations
  FOR SELECT USING (brand_id = auth.uid() OR creator_id = auth.uid());

CREATE POLICY "messages_select_parties" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id AND (brand_id = auth.uid() OR creator_id = auth.uid())
    )
  );

CREATE POLICY "messages_insert_parties" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id AND (brand_id = auth.uid() OR creator_id = auth.uid())
    )
  );

-- ---- Wallets ----
CREATE POLICY "wallets_select_own" ON wallets
  FOR SELECT USING (creator_id = auth.uid());

CREATE POLICY "wallets_update_own" ON wallets
  FOR UPDATE USING (creator_id = auth.uid());

-- ---- Payouts ----
CREATE POLICY "payouts_select_own" ON payouts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM wallets WHERE id = wallet_id AND creator_id = auth.uid())
  );

-- ---- Notifications ----
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- ---- Audit log — écriture seule depuis l'app, lecture admin ----
CREATE POLICY "audit_log_insert" ON audit_log
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "audit_log_select_admin" ON audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'admin')
  );

-- ---- RGPD ----
CREATE POLICY "data_export_select_own" ON data_export_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "data_export_insert_own" ON data_export_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "data_deletion_select_own" ON data_deletion_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "data_deletion_insert_own" ON data_deletion_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());
