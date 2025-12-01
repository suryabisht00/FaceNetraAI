/**
 * Profile API Route
 * GET /api/profile - Get current user's profile
 * PATCH /api/profile - Update current user's profile
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/profile
 * Get authenticated user's profile with all details
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const profile = await prisma.user.findUnique({
        where: { id: user.userId },
        select: {
          id: true,
          vectorId: true,
          randomId: true,
          username: true,
          email: true,
          phone: true,
          fullName: true,
          bio: true,
          profilePictureUrl: true,
          coverPhotoUrl: true,
          isVerified: true,
          isActive: true,
          privacyLevel: true,
          createdAt: true,
          updatedAt: true,
          lastLogin: true,
          socialLinks: {
            select: {
              id: true,
              platform: true,
              username: true,
              profileUrl: true,
              isVisible: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          interests: {
            select: {
              id: true,
              interest: true,
              category: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          privacySettings: true,
        },
      })

      if (!profile) {
        return NextResponse.json(
          { success: false, error: 'Profile not found' },
          { status: 404 }
        )
      }

      // Get additional stats
      const [postsCount, friendsCount, followersCount, followingCount] = await Promise.all([
        prisma.post.count({ where: { userId: user.userId } }),
        prisma.connection.count({
          where: {
            userId: user.userId,
            connectionType: 'FRIEND',
            status: 'ACCEPTED',
          },
        }),
        prisma.connection.count({
          where: {
            connectedUserId: user.userId,
            connectionType: 'FOLLOWING',
            status: 'ACCEPTED',
          },
        }),
        prisma.connection.count({
          where: {
            userId: user.userId,
            connectionType: 'FOLLOWING',
            status: 'ACCEPTED',
          },
        }),
      ])

      return NextResponse.json({
        success: true,
        data: {
          ...profile,
          stats: {
            postsCount,
            friendsCount,
            followersCount,
            followingCount,
          },
        },
      })
    } catch (error) {
      console.error('Get profile error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }
  })
}

/**
 * PATCH /api/profile
 * Update authenticated user's profile
 */
export async function PATCH(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const body = await request.json()
      const {
        username,
        fullName,
        bio,
        profilePictureUrl,
        coverPhotoUrl,
        email,
        phone,
      } = body

      // Validate username uniqueness if provided
      if (username) {
        const existingUser = await prisma.user.findFirst({
          where: {
            username,
            NOT: { id: user.userId },
          },
        })

        if (existingUser) {
          return NextResponse.json(
            { success: false, error: 'Username already taken' },
            { status: 400 }
          )
        }
      }

      // Update user profile
      const updatedUser = await prisma.user.update({
        where: { id: user.userId },
        data: {
          ...(username !== undefined && { username }),
          ...(fullName !== undefined && { fullName }),
          ...(bio !== undefined && { bio }),
          ...(profilePictureUrl !== undefined && { profilePictureUrl }),
          ...(coverPhotoUrl !== undefined && { coverPhotoUrl }),
          ...(email !== undefined && { email }),
          ...(phone !== undefined && { phone }),
        },
        select: {
          id: true,
          vectorId: true,
          randomId: true,
          username: true,
          email: true,
          phone: true,
          fullName: true,
          bio: true,
          profilePictureUrl: true,
          coverPhotoUrl: true,
          isVerified: true,
          isActive: true,
          privacyLevel: true,
          createdAt: true,
          updatedAt: true,
          socialLinks: {
            select: {
              id: true,
              platform: true,
              username: true,
              profileUrl: true,
              isVisible: true,
            },
          },
          interests: {
            select: {
              id: true,
              interest: true,
              category: true,
            },
          },
        },
      })

      // Update search index
      await prisma.userSearchIndex.upsert({
        where: { userId: user.userId },
        create: {
          userId: user.userId,
          searchText: `${updatedUser.fullName} ${updatedUser.username || ''} ${updatedUser.bio || ''}`,
        },
        update: {
          searchText: `${updatedUser.fullName} ${updatedUser.username || ''} ${updatedUser.bio || ''}`,
        },
      })

      return NextResponse.json({
        success: true,
        data: updatedUser,
        message: 'Profile updated successfully',
      })
    } catch (error) {
      console.error('Update profile error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update profile' },
        { status: 500 }
      )
    }
  })
}
