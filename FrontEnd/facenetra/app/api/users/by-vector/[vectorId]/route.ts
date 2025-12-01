import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Get user profile and public posts by vectorId (from face search)
 * GET /api/users/by-vector/[vectorId]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ vectorId: string }> }
) {
  try {
    const { vectorId } = await params

    if (!vectorId) {
      return NextResponse.json(
        { success: false, error: 'Vector ID is required' },
        { status: 400 }
      )
    }

    // Find user by vectorId
    const user = await prisma.user.findUnique({
      where: { vectorId },
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

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if profile is public
    if (user.privacyLevel !== 'PUBLIC' && !user.privacySettings?.showInSearch) {
      return NextResponse.json(
        { success: false, error: 'This profile is private' },
        { status: 403 }
      )
    }

    // Get user stats
    const [postsCount, friendsCount, followersCount, followingCount] = await Promise.all([
      prisma.post.count({ where: { userId: user.id } }),
      prisma.connection.count({
        where: { userId: user.id, connectionType: 'FRIEND', status: 'ACCEPTED' },
      }),
      prisma.connection.count({
        where: { connectedUserId: user.id, connectionType: 'FOLLOWING', status: 'ACCEPTED' },
      }),
      prisma.connection.count({
        where: { userId: user.id, connectionType: 'FOLLOWING', status: 'ACCEPTED' },
      }),
    ])

    // Get public posts with limit
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = parseInt(searchParams.get('offset') || '0')

    const posts = await prisma.post.findMany({
      where: {
        userId: user.id,
        visibility: 'PUBLIC',
      },
      include: {
        media: {
          orderBy: { mediaOrder: 'asc' },
        },
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePictureUrl: true,
            isVerified: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    // Get total public posts count for pagination
    const totalPosts = await prisma.post.count({
      where: {
        userId: user.id,
        visibility: 'PUBLIC',
      },
    })

    const profile = {
      id: user.id,
      vectorId: user.vectorId,
      randomId: user.randomId,
      username: user.username,
      fullName: user.fullName,
      bio: user.bio,
      profilePictureUrl: user.profilePictureUrl,
      coverPhotoUrl: user.coverPhotoUrl,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      socialLinks: user.socialLinks,
      interests: user.interests,
      stats: {
        postsCount,
        friendsCount,
        followersCount,
        followingCount,
      },
    }

    return NextResponse.json({
      success: true,
      data: {
        profile,
        posts,
        pagination: {
          total: totalPosts,
          limit,
          offset,
          hasMore: offset + posts.length < totalPosts,
        },
      },
    })
  } catch (error) {
    console.error('Get user by vectorId error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}
