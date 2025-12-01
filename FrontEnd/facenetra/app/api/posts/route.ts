import { NextRequest, NextResponse } from 'next/server'
import { postService, authService } from '@/lib/services'

/**
 * Create a new post
 * POST /api/posts
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { content, postType, visibility, media } = body

    // Validate input
    if (!content && (!media || media.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Post must have content or media' },
        { status: 400 }
      )
    }

    // Validate post type
    const validPostTypes = ['TEXT', 'IMAGE', 'VIDEO', 'LINK']
    if (!validPostTypes.includes(postType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid post type' },
        { status: 400 }
      )
    }

    // Validate visibility
    const validVisibility = ['PUBLIC', 'PRIVATE', 'FRIENDS_ONLY']
    if (!validVisibility.includes(visibility)) {
      return NextResponse.json(
        { success: false, error: 'Invalid visibility' },
        { status: 400 }
      )
    }

    // Create post
    const post = await postService.createPost({
      userId: payload.userId,
      content: content || '',
      postType,
      visibility,
      media: media || [],
    })

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Post created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

/**
 * Get posts (feed or user posts based on query params)
 * GET /api/posts?userId=xxx or /api/posts (for feed)
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
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let posts

    if (userId) {
      // Get specific user's posts
      posts = await postService.getUserPosts(userId, limit, offset)
    } else {
      // Get feed posts
      posts = await postService.getFeedPosts(payload.userId, limit, offset)
    }

    return NextResponse.json({
      success: true,
      data: posts,
    })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
