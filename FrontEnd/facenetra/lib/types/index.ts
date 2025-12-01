/**
 * API Response Types
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    hasNext: boolean
    hasPrev: boolean
  }
}

/**
 * User Types
 */

export interface User {
  id: string
  vectorId: string
  randomId: string
  username: string | null
  email: string | null
  phone: string | null
  fullName: string
  bio: string | null
  profilePictureUrl: string | null
  coverPhotoUrl: string | null
  isVerified: boolean
  isActive: boolean
  privacyLevel: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY'
  createdAt: Date
  updatedAt: Date
  lastLogin: Date | null
}

export interface UserProfile extends User {
  socialLinks: SocialLink[]
  interests: Interest[]
  stats: {
    postsCount: number
    friendsCount: number
    followersCount: number
    followingCount: number
  }
}

export interface SocialLink {
  id: string
  platform: 'INSTAGRAM' | 'TWITTER' | 'LINKEDIN' | 'FACEBOOK' | 'GITHUB' | 'TIKTOK' | 'YOUTUBE'
  username: string
  profileUrl: string
  isVisible: boolean
}

export interface Interest {
  id: string
  interest: string
  category: string | null
}

/**
 * Post Types
 */

export interface Post {
  id: string
  userId: string
  content: string
  postType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'LINK'
  visibility: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY'
  likesCount: number
  commentsCount: number
  sharesCount: number
  isPinned: boolean
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    username: string | null
    fullName: string
    profilePictureUrl: string | null
    isVerified: boolean
  }
  media: PostMedia[]
}

export interface PostMedia {
  id: string
  mediaUrl: string
  mediaType: 'IMAGE' | 'VIDEO' | 'GIF'
  mediaOrder: number
  width: number | null
  height: number | null
}

export interface Comment {
  id: string
  userId: string
  content: string
  likesCount: number
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    username: string | null
    fullName: string
    profilePictureUrl: string | null
  }
}

/**
 * Connection Types
 */

export interface Connection {
  id: string
  userId: string
  connectedUserId: string
  connectionType: 'FRIEND' | 'FOLLOWING' | 'BLOCKED'
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: Date
  acceptedAt: Date | null
  connectedUser: {
    id: string
    username: string | null
    fullName: string
    profilePictureUrl: string | null
    bio: string | null
    isVerified: boolean
  }
}

/**
 * Scan Types
 */

export interface ScanRecord {
  id: string
  scannerId: string
  scannedId: string
  scanLatitude: number | null
  scanLongitude: number | null
  scanLocationName: string | null
  connectionMade: boolean
  scanConfidence: number
  createdAt: Date
  scanned: {
    id: string
    username: string | null
    fullName: string
    profilePictureUrl: string | null
    bio: string | null
    isVerified: boolean
    socialLinks?: SocialLink[]
    interests?: Interest[]
  }
}

export interface TrendingUser {
  id: string
  userId: string
  score: number
  scanCount24h: number
  newConnections24h: number
  rank: number
  user: {
    id: string
    username: string | null
    fullName: string
    profilePictureUrl: string | null
    bio: string | null
    isVerified: boolean
    socialLinks?: SocialLink[]
  }
}

/**
 * Notification Types
 */

export interface Notification {
  id: string
  type: 'SCAN' | 'CONNECTION_REQUEST' | 'CONNECTION_ACCEPTED' | 'LIKE' | 'COMMENT' | 'MENTION'
  content: string
  targetType: string | null
  targetId: string | null
  isRead: boolean
  createdAt: Date
  fromUser: {
    id: string
    username: string | null
    fullName: string
    profilePictureUrl: string | null
  }
}

/**
 * Auth Types
 */

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RegisterResponse {
  user: User
  accessToken: string
  refreshToken: string
}

/**
 * Profile Update Types
 */

export interface UpdateProfileInput {
  username?: string
  fullName?: string
  bio?: string
  profilePictureUrl?: string
  coverPhotoUrl?: string
  email?: string
  phone?: string
}

export interface SocialLinkInput {
  platform: 'INSTAGRAM' | 'TWITTER' | 'LINKEDIN' | 'FACEBOOK' | 'GITHUB' | 'TIKTOK' | 'YOUTUBE'
  username: string
  isVisible?: boolean
}

export interface InterestInput {
  interest: string
  category?: string
}

export interface ProfileResponse {
  id: string
  vectorId: string
  randomId: string
  username: string | null
  email: string | null
  phone: string | null
  fullName: string
  bio: string | null
  profilePictureUrl: string | null
  coverPhotoUrl: string | null
  isVerified: boolean
  isActive: boolean
  privacyLevel: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY'
  createdAt: Date
  updatedAt: Date
  lastLogin: Date | null
  socialLinks: SocialLink[]
  interests: Interest[]
  stats: {
    postsCount: number
    friendsCount: number
    followersCount: number
    followingCount: number
  }
  privacySettings: {
    profileVisibility: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY'
    showInSearch: boolean
    allowScanDiscovery: boolean
    showSocialLinks: boolean
    showLocation: boolean
    allowMessagesFrom: 'EVERYONE' | 'FRIENDS_ONLY' | 'NONE'
  } | null
}
