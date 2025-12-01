/**
 * Interests/Hobbies API Route
 * GET /api/profile/interests - Get user's interests
 * POST /api/profile/interests - Add new interests
 * DELETE /api/profile/interests - Delete an interest
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/profile/interests
 * Get all interests for authenticated user
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const interests = await prisma.userInterest.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json({
        success: true,
        data: interests,
      })
    } catch (error) {
      console.error('Get interests error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch interests' },
        { status: 500 }
      )
    }
  })
}

/**
 * POST /api/profile/interests
 * Add new interests (can be bulk)
 */
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const body = await request.json()
      const { interests } = body

      if (!interests || !Array.isArray(interests) || interests.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Interests array is required' },
          { status: 400 }
        )
      }

      // Validate and prepare interests data
      const interestsData = interests.map((item) => {
        if (typeof item === 'string') {
          return {
            userId: user.userId,
            interest: item.trim(),
            category: null,
          }
        } else if (typeof item === 'object' && item.interest) {
          return {
            userId: user.userId,
            interest: item.interest.trim(),
            category: item.category || null,
          }
        }
        throw new Error('Invalid interest format')
      })

      // Remove duplicates
      const uniqueInterests = interestsData.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.interest === item.interest)
      )

      // Check for existing interests
      const existingInterests = await prisma.userInterest.findMany({
        where: {
          userId: user.userId,
          interest: {
            in: uniqueInterests.map((i) => i.interest),
          },
        },
      })

      const existingInterestNames = existingInterests.map((i) => i.interest)
      const newInterests = uniqueInterests.filter(
        (i) => !existingInterestNames.includes(i.interest)
      )

      if (newInterests.length === 0) {
        return NextResponse.json(
          { success: false, error: 'All interests already exist' },
          { status: 400 }
        )
      }

      // Bulk create new interests
      await prisma.userInterest.createMany({
        data: newInterests,
      })

      // Fetch all interests after creation
      const allInterests = await prisma.userInterest.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: 'desc' },
      })

      // Update search index
      const interestText = allInterests.map((i) => i.interest).join(' ')
      const currentUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { fullName: true, username: true, bio: true },
      })

      if (currentUser) {
        await prisma.userSearchIndex.upsert({
          where: { userId: user.userId },
          create: {
            userId: user.userId,
            searchText: `${currentUser.fullName} ${currentUser.username || ''} ${currentUser.bio || ''} ${interestText}`,
          },
          update: {
            searchText: `${currentUser.fullName} ${currentUser.username || ''} ${currentUser.bio || ''} ${interestText}`,
          },
        })
      }

      return NextResponse.json({
        success: true,
        data: allInterests,
        message: `${newInterests.length} interest(s) added successfully`,
      })
    } catch (error) {
      console.error('Add interests error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to add interests' },
        { status: 500 }
      )
    }
  })
}

/**
 * DELETE /api/profile/interests
 * Delete an interest
 */
export async function DELETE(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const { searchParams } = new URL(request.url)
      const id = searchParams.get('id')

      if (!id) {
        return NextResponse.json(
          { success: false, error: 'Interest ID is required' },
          { status: 400 }
        )
      }

      // Verify ownership
      const existingInterest = await prisma.userInterest.findFirst({
        where: {
          id,
          userId: user.userId,
        },
      })

      if (!existingInterest) {
        return NextResponse.json(
          { success: false, error: 'Interest not found' },
          { status: 404 }
        )
      }

      await prisma.userInterest.delete({
        where: { id },
      })

      return NextResponse.json({
        success: true,
        message: 'Interest deleted successfully',
      })
    } catch (error) {
      console.error('Delete interest error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete interest' },
        { status: 500 }
      )
    }
  })
}
