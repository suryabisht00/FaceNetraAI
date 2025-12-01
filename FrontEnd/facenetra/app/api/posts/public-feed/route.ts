import { NextRequest, NextResponse } from 'next/server'
import { postService, authService } from '@/lib/services'

/**
 * Get public feed (all public posts from all users)
 * GET /api/posts/public-feed
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = await authService.verifyAccessToken(token)

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get all public posts
    const posts = await postService.getPublicFeedPosts(payload.userId, limit, offset)

    return NextResponse.json({
      success: true,
      data: posts,
      message: 'Public feed fetched successfully',
    })
  } catch (error) {
    console.error('Get public feed error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch public feed' },
      { status: 500 }
    )
  }
}
