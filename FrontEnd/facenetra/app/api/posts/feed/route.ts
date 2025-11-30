import { NextRequest, NextResponse } from 'next/server'
import { postService } from '@/lib/services'
import { authService } from '@/lib/services'

/**
 * Example: Get User Feed
 * GET /api/posts/feed
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

    // Get feed posts
    const posts = await postService.getFeedPosts(payload.userId, 20, 0)

    return NextResponse.json({
      success: true,
      data: posts,
    })
  } catch (error) {
    console.error('Feed error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feed' },
      { status: 500 }
    )
  }
}

/**
 * Example: Create Post
 * POST /api/posts/feed
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

    // Create post
    const post = await postService.createPost({
      userId: payload.userId,
      content,
      postType,
      visibility,
      media,
    })

    return NextResponse.json({
      success: true,
      data: post,
    })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
