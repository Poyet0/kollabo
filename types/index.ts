/* ============================================================
   KOLLABO — Types TypeScript globaux
   ============================================================ */

export type UserType = 'creator' | 'brand' | 'admin'
export type KycStatus = 'pending' | 'verified' | 'rejected' | 'not_started'

export type Niche =
  | 'mode'
  | 'beaute'
  | 'lifestyle'
  | 'food'
  | 'tech'
  | 'gaming'
  | 'sport'
  | 'business'
  | 'parenting'
  | 'voyage'
  | 'art'
  | 'musique'
  | 'humour'
  | 'education'
  | 'sante'
  | 'immobilier'

export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook'
export type DeliverableType = 'post' | 'story' | 'reel' | 'video' | 'thread'
export type PaymentMethod = 'wave' | 'orange_money' | 'mtn_money' | 'card_cinetpay'

export type CampaignStatus = 'draft' | 'open' | 'closed' | 'completed' | 'cancelled'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'
export type ContractStatus =
  | 'pending_signatures'
  | 'active'
  | 'in_delivery'
  | 'completed'
  | 'disputed'
  | 'cancelled'
export type EscrowStatus = 'initiated' | 'held' | 'released' | 'refunded'
export type DeliverableStatus = 'pending' | 'submitted' | 'approved' | 'revision_requested' | 'rejected'
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed'

/* ---- Profils ---- */
export interface Profile {
  id: string
  userType: UserType
  fullName: string
  phone: string | null
  country: string
  city: string | null
  kycStatus: KycStatus
  kycDocuments: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export interface CreatorProfile {
  id: string
  profileId: string
  displayName: string
  bio: string | null
  niche: Niche[]
  instagramHandle: string | null
  instagramFollowers: number | null
  instagramVerified: boolean
  tiktokHandle: string | null
  tiktokFollowers: number | null
  tiktokVerified: boolean
  youtubeHandle: string | null
  youtubeSubscribers: number | null
  youtubeVerified: boolean
  baseRatePost: number | null
  baseRateStory: number | null
  baseRateReel: number | null
  baseRateVideo: number | null
  languages: string[]
  citiesCovered: string[]
  ratingAvg: number
  ratingCount: number
  totalEarnedXof: number
  completedCampaigns: number
  isActive: boolean
  isFeatured: boolean
}

export interface BrandProfile {
  id: string
  profileId: string
  companyName: string
  legalForm: string | null
  rccm: string | null
  dfe: string | null
  sector: string | null
  website: string | null
  logoUrl: string | null
  contactRole: string | null
  billingAddress: Record<string, unknown> | null
  totalSpentXof: number
  completedCampaigns: number
}

/* ---- Campagnes ---- */
export interface Campaign {
  id: string
  brandId: string
  title: string
  briefMd: string
  deliverables: CampaignDeliverable[]
  budgetXof: number
  currency: string
  startDate: string
  endDate: string
  status: CampaignStatus
  nicheTargeted: Niche[]
  minFollowers: number | null
  applicationDeadline: string | null
  createdAt: string
}

export interface CampaignDeliverable {
  type: DeliverableType
  platform: SocialPlatform
  quantity: number
  description: string
  dueDate?: string
}

/* ---- Candidatures ---- */
export interface Application {
  id: string
  campaignId: string
  creatorId: string
  pitchText: string
  proposedPriceXof: number
  proposedDeliverables: CampaignDeliverable[]
  status: ApplicationStatus
  createdAt: string
}

/* ---- Contrats ---- */
export interface Contract {
  id: string
  applicationId: string
  brandId: string
  creatorId: string
  agreedPriceXof: number
  platformFeeXof: number
  creatorNetXof: number
  rasAmountXof: number
  rasApplied: boolean
  deliverablesLocked: CampaignDeliverable[]
  contractPdfUrl: string | null
  contractHash: string | null
  signedByBrandAt: string | null
  signedByCreatorAt: string | null
  status: ContractStatus
}

/* ---- Paiements ---- */
export interface EscrowTransaction {
  id: string
  contractId: string
  amountXof: number
  paymentMethod: PaymentMethod
  cinetpayTransactionId: string | null
  status: EscrowStatus
  initiatedAt: string
  heldAt: string | null
  releasedAt: string | null
  metadata: Record<string, unknown>
}

/* ---- Livrables ---- */
export interface Deliverable {
  id: string
  contractId: string
  type: DeliverableType
  description: string
  dueDate: string
  proofUrl: string | null
  proofPlatform: SocialPlatform | null
  proofPublishedAt: string | null
  status: DeliverableStatus
  approvedAt: string | null
}

/* ---- Avis ---- */
export interface Review {
  id: string
  contractId: string
  reviewerId: string
  revieweeId: string
  rating: 1 | 2 | 3 | 4 | 5
  comment: string | null
  isPublic: boolean
  createdAt: string
}

/* ---- Messages ---- */
export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  attachments: MessageAttachment[]
  readAt: string | null
  createdAt: string
}

export interface MessageAttachment {
  name: string
  url: string
  type: string
  size: number
}

/* ---- Portefeuille ---- */
export interface Wallet {
  id: string
  creatorId: string
  availableBalanceXof: number
  pendingBalanceXof: number
  preferredPayoutMethod: PaymentMethod | null
  payoutDetails: Record<string, unknown> | null
}

/* ---- Notifications ---- */
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  link: string | null
  readAt: string | null
  createdAt: string
}

export type NotificationType =
  | 'application_received'
  | 'application_accepted'
  | 'application_rejected'
  | 'contract_signed'
  | 'payment_held'
  | 'deliverable_submitted'
  | 'deliverable_approved'
  | 'deliverable_revision'
  | 'funds_released'
  | 'payout_processed'
  | 'message_received'
  | 'kyc_validated'
  | 'kyc_rejected'

/* ---- Helpers UI ---- */
export interface StatCard {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface SelectOption<T = string> {
  value: T
  label: string
  description?: string
  disabled?: boolean
}

export type ActionResult<T = undefined> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
