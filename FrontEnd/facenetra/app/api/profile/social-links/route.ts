/**
 * Social Links API Route
 * GET /api/profile/social-links - Get user's social links
 * POST /api/profile/social-links - Add a new social link
 * PATCH /api/profile/social-links/[id] - Update a social link
 * DELETE /api/profile/social-links/[id] - Delete a social link
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/profile/social-links
 * Get all social links for authenticated user
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const socialLinks = await prisma.userSocialLink.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json({
        success: true,
        data: socialLinks,
      })
    } catch (error) {
      console.error('Get social links error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch social links' },
        { status: 500 }
      )
    }
  })
}

/**
 * POST /api/profile/social-links
 * Add a new social link
 */
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const body = await request.json()
      const { platform, username, isVisible = true } = body

      if (!platform || !username) {
        return NextResponse.json(
          { success: false, error: 'Platform and username are required' },
          { status: 400 }
        )
      }

      // Validate platform
      const validPlatforms = [
        'INSTAGRAM',
        'TWITTER',
        'LINKEDIN',
        'FACEBOOK',
        'GITHUB',
        'TIKTOK',
        'YOUTUBE',
      ]

      if (!validPlatforms.includes(platform)) {
        return NextResponse.json(
          { success: false, error: 'Invalid platform' },
          { status: 400 }
        )
      }

      // Check if link already exists for this platform
      const existingLink = await prisma.userSocialLink.findFirst({
        where: {
          userId: user.userId,
          platform,
        },
      })

      if (existingLink) {
        return NextResponse.json(
          { success: false, error: 'Social link for this platform already exists' },
          { status: 400 }
        )
      }

      // Generate profile URL based on platform
      const profileUrl = generateProfileUrl(platform, username)

      const socialLink = await prisma.userSocialLink.create({
        data: {
          userId: user.userId,
          platform,
          username,
          profileUrl,
          isVisible,
        },
      })

      return NextResponse.json({
        success: true,
        data: socialLink,
        message: 'Social link added successfully',
      })
    } catch (error) {
      console.error('Add social link error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to add social link' },
        { status: 500 }
      )
    }
  })
}

/**
 * PATCH /api/profile/social-links
 * Update a social link
 */
export async function PATCH(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const body = await request.json()
      const { id, username, isVisible } = body

      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Social link ID is required' },
          { status: 400 }
        )
      }

      // Verify ownership
      const existingLink = await prisma.userSocialLink.findFirst({
        where: {
          id,
          userId: user.userId,
        },
      })

      if (!existingLink) {
        return NextResponse.json(
          { success: false, error: 'Social link not found' },
          { status: 404 }
        )
      }

      const updateData: any = {}
      if (username !== undefined) {
        updateData.username = username
        updateData.profileUrl = generateProfileUrl(existingLink.platform, username)
      }
      if (isVisible !== undefined) {
        updateData.isVisible = isVisible
      }

      const updatedLink = await prisma.userSocialLink.update({
        where: { id },
        data: updateData,
      })

      return NextResponse.json({
        success: true,
        data: updatedLink,
        message: 'Social link updated successfully',
      })
    } catch (error) {
      console.error('Update social link error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update social link' },
        { status: 500 }
      )
    }
  })
}

/**
 * DELETE /api/profile/social-links
 * Delete a social link
 */
export async function DELETE(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const { searchParams } = new URL(request.url)
      const id = searchParams.get('id')

      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Social link ID is required' },
          { status: 400 }
        )
      }

      // Verify ownership
      const existingLink = await prisma.userSocialLink.findFirst({
        where: {
          id,
          userId: user.userId,
        },
      })

      if (!existingLink) {
        return NextResponse.json(
          { success: false, error: 'Social link not found' },
          { status: 404 }
        )
      }

      await prisma.userSocialLink.delete({
        where: { id },
      })

      return NextResponse.json({
        success: true,
        message: 'Social link deleted successfully',
      })
    } catch (error) {
      console.error('Delete social link error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete social link' },
        { status: 500 }
      )
    }
  })
}

/**
 * Helper function to generate profile URLs
 */
function generateProfileUrl(platform: string, username: string): string {
  const baseUrls: Record<string, string> = {
    INSTAGRAM: 'https://instagram.com/',
    TWITTER: 'https://twitter.com/',
    LINKEDIN: 'https://linkedin.com/in/',
    FACEBOOK: 'https://facebook.com/',
    GITHUB: 'https://github.com/',
    TIKTOK: 'https://tiktok.com/@',
    YOUTUBE: 'https://youtube.com/@',
  }

  const cleanUsername = username.startsWith('@') ? username.substring(1) : username
  return `${baseUrls[platform]}${cleanUsername}`
}
