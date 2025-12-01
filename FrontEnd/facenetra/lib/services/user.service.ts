import { prisma } from '@/lib/prisma'

/**
 * User Service - Handles all user-related database operations
 */

export interface CreateUserInput {
  vectorId: string
  randomId: string
  fullName: string
  email?: string
  phone?: string
  username?: string
  bio?: string
  profilePictureUrl?: string
}

export interface UpdateUserInput {
  username?: string
  fullName?: string
  bio?: string
  profilePictureUrl?: string
  coverPhotoUrl?: string
  email?: string
  phone?: string
}

export const userService = {
  /**
   * Create a new user after face registration
   */
  async createUser(data: CreateUserInput) {
    return await prisma.user.create({
      data: {
        vectorId: data.vectorId,
        randomId: data.randomId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        username: data.username,
        bio: data.bio,
        profilePictureUrl: data.profilePictureUrl,
      },
      include: {
        privacySettings: true,
        faceVectors: true,
      },
    })
  },

  /**
   * Find user by vector ID (for login)
   */
  async findByVectorId(vectorId: string) {
    return await prisma.user.findUnique({
      where: { vectorId },
      include: {
        faceVectors: true,
        privacySettings: true,
        socialLinks: true,
        interests: true,
      },
    })
  },

  /**
   * Find user by ID
   */
  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        privacySettings: true,
        socialLinks: true,
        interests: true,
        faceVectors: {
          where: { isPrimary: true },
        },
      },
    })
  },

  /**
   * Find user by username
   */
  async findByUsername(username: string) {
    return await prisma.user.findFirst({
      where: { username },
      include: {
        privacySettings: true,
        socialLinks: {
          where: { isVisible: true },
        },
        interests: true,
      },
    })
  },

  /**
   * Update user profile
   */
  async updateUser(id: string, data: UpdateUserInput) {
    return await prisma.user.update({
      where: { id },
      data,
      include: {
        privacySettings: true,
        socialLinks: true,
        interests: true,
      },
    })
  },

  /**
   * Update last login time
   */
  async updateLastLogin(id: string) {
    return await prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() },
    })
  },

  /**
   * Search users by text, interests, or social links
   */
  async searchUsers(query: string, limit = 20, offset = 0) {
    return await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { fullName: { contains: query, mode: 'insensitive' } },
          { bio: { contains: query, mode: 'insensitive' } },
          {
            interests: {
              some: {
                interest: { contains: query, mode: 'insensitive' },
              },
            },
          },
        ],
        isActive: true,
        privacyLevel: 'PUBLIC',
      },
      include: {
        socialLinks: {
          where: { isVisible: true },
        },
        interests: true,
        trendingUser: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        trendingUser: {
          score: 'desc',
        },
      },
    })
  },

  /**
   * Get user's connections
   */
  async getUserConnections(userId: string, type?: 'FRIEND' | 'FOLLOWING' | 'BLOCKED') {
    return await prisma.connection.findMany({
      where: {
        userId,
        ...(type && { connectionType: type }),
        status: 'ACCEPTED',
      },
      include: {
        connectedUser: {
          include: {
            socialLinks: {
              where: { isVisible: true },
            },
          },
        },
      },
    })
  },

  /**
   * Delete user account
   */
  async deleteUser(id: string) {
    return await prisma.user.delete({
      where: { id },
    })
  },

  /**
   * Add social link for user
   */
  async addSocialLink(
    userId: string,
    platform: string,
    username: string,
    isVisible = true
  ) {
    const profileUrls: Record<string, string> = {
      INSTAGRAM: 'https://instagram.com/',
      TWITTER: 'https://twitter.com/',
      LINKEDIN: 'https://linkedin.com/in/',
      FACEBOOK: 'https://facebook.com/',
      GITHUB: 'https://github.com/',
      TIKTOK: 'https://tiktok.com/@',
      YOUTUBE: 'https://youtube.com/@',
    }

    const cleanUsername = username.startsWith('@') ? username.substring(1) : username
    const profileUrl = `${profileUrls[platform]}${cleanUsername}`

    return await prisma.userSocialLink.create({
      data: {
        userId,
        platform: platform as any,
        username: cleanUsername,
        profileUrl,
        isVisible,
      },
    })
  },

  /**
   * Update social link
   */
  async updateSocialLink(linkId: string, username?: string, isVisible?: boolean) {
    const link = await prisma.userSocialLink.findUnique({
      where: { id: linkId },
    })

    if (!link) throw new Error('Social link not found')

    const updateData: any = {}
    if (username !== undefined) {
      const profileUrls: Record<string, string> = {
        INSTAGRAM: 'https://instagram.com/',
        TWITTER: 'https://twitter.com/',
        LINKEDIN: 'https://linkedin.com/in/',
        FACEBOOK: 'https://facebook.com/',
        GITHUB: 'https://github.com/',
        TIKTOK: 'https://tiktok.com/@',
        YOUTUBE: 'https://youtube.com/@',
      }
      const cleanUsername = username.startsWith('@') ? username.substring(1) : username
      updateData.username = cleanUsername
      updateData.profileUrl = `${profileUrls[link.platform]}${cleanUsername}`
    }
    if (isVisible !== undefined) {
      updateData.isVisible = isVisible
    }

    return await prisma.userSocialLink.update({
      where: { id: linkId },
      data: updateData,
    })
  },

  /**
   * Delete social link
   */
  async deleteSocialLink(linkId: string) {
    return await prisma.userSocialLink.delete({
      where: { id: linkId },
    })
  },

  /**
   * Add interests for user (bulk)
   */
  async addInterests(userId: string, interests: string[]) {
    // Filter out existing interests first
    const existingInterests = await prisma.userInterest.findMany({
      where: {
        userId,
        interest: { in: interests.map(i => i.trim()) },
      },
    })

    const existingInterestNames = existingInterests.map(i => i.interest)
    const newInterests = interests
      .map(i => i.trim())
      .filter(i => !existingInterestNames.includes(i))
      .map(interest => ({ userId, interest }))

    if (newInterests.length === 0) {
      return { count: 0 }
    }

    return await prisma.userInterest.createMany({
      data: newInterests,
    })
  },

  /**
   * Delete interest
   */
  async deleteInterest(interestId: string) {
    return await prisma.userInterest.delete({
      where: { id: interestId },
    })
  },

  /**
   * Get user's full profile with stats
   */
  async getFullProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        socialLinks: {
          where: { isVisible: true },
          orderBy: { createdAt: 'desc' },
        },
        interests: {
          orderBy: { createdAt: 'desc' },
        },
        privacySettings: true,
      },
    })

    if (!user) return null

    const [postsCount, friendsCount, followersCount, followingCount] = await Promise.all([
      prisma.post.count({ where: { userId } }),
      prisma.connection.count({
        where: { userId, connectionType: 'FRIEND', status: 'ACCEPTED' },
      }),
      prisma.connection.count({
        where: { connectedUserId: userId, connectionType: 'FOLLOWING', status: 'ACCEPTED' },
      }),
      prisma.connection.count({
        where: { userId, connectionType: 'FOLLOWING', status: 'ACCEPTED' },
      }),
    ])

    return {
      ...user,
      stats: {
        postsCount,
        friendsCount,
        followersCount,
        followingCount,
      },
    }
  },
}
