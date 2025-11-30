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
    return await prisma.user.findUnique({
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
}
