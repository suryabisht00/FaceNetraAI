import { NextRequest, NextResponse } from 'next/server'
import { postService, authService } from '@/lib/services'

/**
 * Like/Unlike a post
 * POST /api/posts/[id]/like
 */
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = await authService.verifyAccessToken(token)

    const result = await postService.likePost(params.id, payload.userId)

    return NextResponse.json({
      success: true,
      data: result,
      message: result.liked ? 'Post liked' : 'Post unliked',
    })
  } catch (error) {
    console.error('Like post error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to like post' },
      { status: 500 }
    )
  }
}
