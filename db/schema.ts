import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  numeric,
  check,
  index,
  unique,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

/* ============================================================
   ENUMS
   ============================================================ */

export const userTypeEnum = pgEnum('user_type', ['creator', 'brand', 'admin'])
export const kycStatusEnum = pgEnum('kyc_status', ['not_started', 'pending', 'verified', 'rejected'])
export const campaignStatusEnum = pgEnum('campaign_status', ['draft', 'open', 'closed', 'completed', 'cancelled'])
export const applicationStatusEnum = pgEnum('application_status', ['pending', 'accepted', 'rejected', 'withdrawn'])
export const contractStatusEnum = pgEnum('contract_status', [
  'pending_signatures',
  'active',
  'in_delivery',
  'completed',
  'disputed',
  'cancelled',
])
export const escrowStatusEnum = pgEnum('escrow_status', ['initiated', 'held', 'released', 'refunded'])
export const deliverableTypeEnum = pgEnum('deliverable_type', ['post', 'story', 'reel', 'video', 'thread'])
export const deliverableStatusEnum = pgEnum('deliverable_status', [
  'pending',
  'submitted',
  'approved',
  'revision_requested',
  'rejected',
])
export const paymentMethodEnum = pgEnum('payment_method', ['wave', 'orange_money', 'mtn_money', 'card_cinetpay'])
export const payoutStatusEnum = pgEnum('payout_status', ['pending', 'processing', 'completed', 'failed'])
export const socialPlatformEnum = pgEnum('social_platform', ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook'])

/* ============================================================
   PROFILES — étend auth.users de Supabase
   ============================================================ */

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // = auth.users.id
  userType: userTypeEnum('user_type').notNull(),
  fullName: text('full_name').notNull(),
  phone: text('phone'),
  country: text('country').notNull().default('CI'),
  city: text('city'),
  avatarUrl: text('avatar_url'),
  kycStatus: kycStatusEnum('kyc_status').notNull().default('not_started'),
  kycDocuments: jsonb('kyc_documents'),
  onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
  onboardingStep: integer('onboarding_step').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

/* ============================================================
   CREATOR PROFILES
   ============================================================ */

export const creatorProfiles = pgTable(
  'creator_profiles',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    profileId: uuid('profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    displayName: text('display_name').notNull(),
    bio: text('bio'),
    niche: text('niche').array().notNull().default(sql`'{}'::text[]`),
    instagramHandle: text('instagram_handle'),
    instagramFollowers: integer('instagram_followers'),
    instagramVerified: boolean('instagram_verified').notNull().default(false),
    instagramAccessToken: text('instagram_access_token'),
    tiktokHandle: text('tiktok_handle'),
    tiktokFollowers: integer('tiktok_followers'),
    tiktokVerified: boolean('tiktok_verified').notNull().default(false),
    youtubeHandle: text('youtube_handle'),
    youtubeSubscribers: integer('youtube_subscribers'),
    youtubeVerified: boolean('youtube_verified').notNull().default(false),
    baseRatePost: integer('base_rate_post'),
    baseRateStory: integer('base_rate_story'),
    baseRateReel: integer('base_rate_reel'),
    baseRateVideo: integer('base_rate_video'),
    languages: text('languages').array().notNull().default(sql`'{}'::text[]`),
    citiesCovered: text('cities_covered').array().notNull().default(sql`'{}'::text[]`),
    ratingAvg: numeric('rating_avg', { precision: 3, scale: 2 }).notNull().default('0'),
    ratingCount: integer('rating_count').notNull().default(0),
    totalEarnedXof: integer('total_earned_xof').notNull().default(0),
    completedCampaigns: integer('completed_campaigns').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    isFeatured: boolean('is_featured').notNull().default(false),
    ribWave: text('rib_wave'),
    ribOrangeMoney: text('rib_orange_money'),
  },
  (t) => [
    unique('creator_profiles_profile_id_unique').on(t.profileId),
    index('creator_profiles_niche_idx').on(t.niche),
    index('creator_profiles_rating_idx').on(t.ratingAvg),
  ],
)

/* ============================================================
   BRAND PROFILES
   ============================================================ */

export const brandProfiles = pgTable(
  'brand_profiles',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    profileId: uuid('profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    companyName: text('company_name').notNull(),
    legalForm: text('legal_form'),
    rccm: text('rccm'),
    dfe: text('dfe'),
    sector: text('sector'),
    website: text('website'),
    logoUrl: text('logo_url'),
    contactRole: text('contact_role'),
    billingAddress: jsonb('billing_address'),
    totalSpentXof: integer('total_spent_xof').notNull().default(0),
    completedCampaigns: integer('completed_campaigns').notNull().default(0),
  },
  (t) => [unique('brand_profiles_profile_id_unique').on(t.profileId)],
)

/* ============================================================
   CAMPAIGNS
   ============================================================ */

export const campaigns = pgTable(
  'campaigns',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    brandId: uuid('brand_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    briefMd: text('brief_md').notNull(),
    deliverables: jsonb('deliverables').notNull().default(sql`'[]'::jsonb`),
    budgetXof: integer('budget_xof').notNull(),
    currency: text('currency').notNull().default('XOF'),
    startDate: timestamp('start_date', { withTimezone: true }).notNull(),
    endDate: timestamp('end_date', { withTimezone: true }).notNull(),
    status: campaignStatusEnum('status').notNull().default('draft'),
    nicheTargeted: text('niche_targeted').array().notNull().default(sql`'{}'::text[]`),
    minFollowers: integer('min_followers'),
    applicationDeadline: timestamp('application_deadline', { withTimezone: true }),
    isInviteOnly: boolean('is_invite_only').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('campaigns_brand_id_idx').on(t.brandId),
    index('campaigns_status_idx').on(t.status),
    index('campaigns_niche_idx').on(t.nicheTargeted),
  ],
)

/* ============================================================
   APPLICATIONS (Candidatures / Pitches)
   ============================================================ */

export const applications = pgTable(
  'applications',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    campaignId: uuid('campaign_id')
      .notNull()
      .references(() => campaigns.id, { onDelete: 'cascade' }),
    creatorId: uuid('creator_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    pitchText: text('pitch_text').notNull(),
    proposedPriceXof: integer('proposed_price_xof').notNull(),
    proposedDeliverables: jsonb('proposed_deliverables').notNull().default(sql`'[]'::jsonb`),
    status: applicationStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique('applications_campaign_creator_unique').on(t.campaignId, t.creatorId),
    index('applications_campaign_id_idx').on(t.campaignId),
    index('applications_creator_id_idx').on(t.creatorId),
  ],
)

/* ============================================================
   CONTRACTS
   ============================================================ */

export const contracts = pgTable(
  'contracts',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    applicationId: uuid('application_id')
      .notNull()
      .references(() => applications.id),
    brandId: uuid('brand_id')
      .notNull()
      .references(() => profiles.id),
    creatorId: uuid('creator_id')
      .notNull()
      .references(() => profiles.id),
    agreedPriceXof: integer('agreed_price_xof').notNull(),
    platformFeeXof: integer('platform_fee_xof').notNull(),
    platformFeeTvaXof: integer('platform_fee_tva_xof').notNull(),
    creatorNetXof: integer('creator_net_xof').notNull(),
    rasAmountXof: integer('ras_amount_xof').notNull().default(0),
    rasApplied: boolean('ras_applied').notNull().default(false),
    deliverablesLocked: jsonb('deliverables_locked').notNull().default(sql`'[]'::jsonb`),
    contractPdfUrl: text('contract_pdf_url'),
    contractHash: text('contract_hash'),
    yousignEnvelopeId: text('yousign_envelope_id'),
    signedByBrandAt: timestamp('signed_by_brand_at', { withTimezone: true }),
    brandSignatureMeta: jsonb('brand_signature_meta'),
    signedByCreatorAt: timestamp('signed_by_creator_at', { withTimezone: true }),
    creatorSignatureMeta: jsonb('creator_signature_meta'),
    status: contractStatusEnum('status').notNull().default('pending_signatures'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('contracts_brand_id_idx').on(t.brandId),
    index('contracts_creator_id_idx').on(t.creatorId),
    index('contracts_status_idx').on(t.status),
  ],
)

/* ============================================================
   ESCROW TRANSACTIONS
   ============================================================ */

export const escrowTransactions = pgTable(
  'escrow_transactions',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    contractId: uuid('contract_id')
      .notNull()
      .references(() => contracts.id),
    amountXof: integer('amount_xof').notNull(),
    paymentMethod: paymentMethodEnum('payment_method').notNull(),
    cinetpayTransactionId: text('cinetpay_transaction_id'),
    status: escrowStatusEnum('status').notNull().default('initiated'),
    initiatedAt: timestamp('initiated_at', { withTimezone: true }).notNull().defaultNow(),
    heldAt: timestamp('held_at', { withTimezone: true }),
    releasedAt: timestamp('released_at', { withTimezone: true }),
    metadata: jsonb('metadata').notNull().default(sql`'{}'::jsonb`),
  },
  (t) => [index('escrow_contract_id_idx').on(t.contractId)],
)

/* ============================================================
   DELIVERABLES
   ============================================================ */

export const deliverables = pgTable(
  'deliverables',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    contractId: uuid('contract_id')
      .notNull()
      .references(() => contracts.id, { onDelete: 'cascade' }),
    type: deliverableTypeEnum('type').notNull(),
    description: text('description').notNull(),
    dueDate: timestamp('due_date', { withTimezone: true }).notNull(),
    proofUrl: text('proof_url'),
    proofPlatform: socialPlatformEnum('proof_platform'),
    proofPublishedAt: timestamp('proof_published_at', { withTimezone: true }),
    status: deliverableStatusEnum('status').notNull().default('pending'),
    revisionNote: text('revision_note'),
    approvedAt: timestamp('approved_at', { withTimezone: true }),
    autoReleasedAt: timestamp('auto_released_at', { withTimezone: true }),
  },
  (t) => [index('deliverables_contract_id_idx').on(t.contractId)],
)

/* ============================================================
   REVIEWS (Avis croisés)
   ============================================================ */

export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    contractId: uuid('contract_id')
      .notNull()
      .references(() => contracts.id),
    reviewerId: uuid('reviewer_id')
      .notNull()
      .references(() => profiles.id),
    revieweeId: uuid('reviewee_id')
      .notNull()
      .references(() => profiles.id),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    isPublic: boolean('is_public').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check('rating_check', sql`${t.rating} BETWEEN 1 AND 5`),
    unique('reviews_contract_reviewer_unique').on(t.contractId, t.reviewerId),
    index('reviews_reviewee_id_idx').on(t.revieweeId),
  ],
)

/* ============================================================
   MESSAGING
   ============================================================ */

export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    contractId: uuid('contract_id')
      .notNull()
      .references(() => contracts.id, { onDelete: 'cascade' }),
    brandId: uuid('brand_id')
      .notNull()
      .references(() => profiles.id),
    creatorId: uuid('creator_id')
      .notNull()
      .references(() => profiles.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('conversations_contract_unique').on(t.contractId)],
)

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    senderId: uuid('sender_id')
      .notNull()
      .references(() => profiles.id),
    content: text('content').notNull(),
    attachments: jsonb('attachments').notNull().default(sql`'[]'::jsonb`),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('messages_conversation_id_idx').on(t.conversationId)],
)

/* ============================================================
   WALLETS & PAYOUTS
   ============================================================ */

export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  creatorId: uuid('creator_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  availableBalanceXof: integer('available_balance_xof').notNull().default(0),
  pendingBalanceXof: integer('pending_balance_xof').notNull().default(0),
  preferredPayoutMethod: paymentMethodEnum('preferred_payout_method'),
  payoutDetails: jsonb('payout_details'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const payouts = pgTable(
  'payouts',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    walletId: uuid('wallet_id')
      .notNull()
      .references(() => wallets.id),
    amountXof: integer('amount_xof').notNull(),
    method: paymentMethodEnum('method').notNull(),
    status: payoutStatusEnum('status').notNull().default('pending'),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    cinetpayPayoutId: text('cinetpay_payout_id'),
    metadata: jsonb('metadata').notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('payouts_wallet_id_idx').on(t.walletId)],
)

/* ============================================================
   NOTIFICATIONS
   ============================================================ */

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    link: text('link'),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('notifications_user_id_idx').on(t.userId),
    index('notifications_read_at_idx').on(t.readAt),
  ],
)

/* ============================================================
   AUDIT LOG & RGPD
   ============================================================ */

export const auditLog = pgTable(
  'audit_log',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    actorId: uuid('actor_id').references(() => profiles.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    entityType: text('entity_type').notNull(),
    entityId: uuid('entity_id'),
    metadata: jsonb('metadata').notNull().default(sql`'{}'::jsonb`),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('audit_log_actor_id_idx').on(t.actorId),
    index('audit_log_entity_idx').on(t.entityType, t.entityId),
    index('audit_log_created_at_idx').on(t.createdAt),
  ],
)

export const dataExportRequests = pgTable('data_export_requests', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('pending'),
  exportUrl: text('export_url'),
  requestedAt: timestamp('requested_at', { withTimezone: true }).notNull().defaultNow(),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
})

export const dataDeletionRequests = pgTable('data_deletion_requests', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id),
  reason: text('reason'),
  status: text('status').notNull().default('pending'),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  requestedAt: timestamp('requested_at', { withTimezone: true }).notNull().defaultNow(),
})

/* ============================================================
   RELATIONS
   ============================================================ */

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  creatorProfile: one(creatorProfiles, {
    fields: [profiles.id],
    references: [creatorProfiles.profileId],
  }),
  brandProfile: one(brandProfiles, {
    fields: [profiles.id],
    references: [brandProfiles.profileId],
  }),
  campaigns: many(campaigns),
  applications: many(applications),
  contractsAsBrand: many(contracts, { relationName: 'brand' }),
  contractsAsCreator: many(contracts, { relationName: 'creator' }),
  wallet: one(wallets, { fields: [profiles.id], references: [wallets.creatorId] }),
  notifications: many(notifications),
}))

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  brand: one(profiles, { fields: [campaigns.brandId], references: [profiles.id] }),
  applications: many(applications),
}))

export const applicationsRelations = relations(applications, ({ one }) => ({
  campaign: one(campaigns, { fields: [applications.campaignId], references: [campaigns.id] }),
  creator: one(profiles, { fields: [applications.creatorId], references: [profiles.id] }),
  contract: one(contracts, { fields: [applications.id], references: [contracts.applicationId] }),
}))

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  application: one(applications, {
    fields: [contracts.applicationId],
    references: [applications.id],
  }),
  brand: one(profiles, {
    fields: [contracts.brandId],
    references: [profiles.id],
    relationName: 'brand',
  }),
  creator: one(profiles, {
    fields: [contracts.creatorId],
    references: [profiles.id],
    relationName: 'creator',
  }),
  escrowTransactions: many(escrowTransactions),
  deliverables: many(deliverables),
  reviews: many(reviews),
  conversation: one(conversations, {
    fields: [contracts.id],
    references: [conversations.contractId],
  }),
}))
