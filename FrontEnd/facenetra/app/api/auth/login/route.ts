import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/services'
import { base64ToUint8Array } from '@/lib/utils/converter'

/**
 * Example: User Login with Face Recognition
 * POST /api/auth/login
 * 
 * Flow:
 * 1. Client sends face vector embedding
 * 2. Backend compares with stored vectors (using Python/ML service)
 * 3. If match found, call this endpoint with userId
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, faceVectorEmbedding } = body

    if (!userId || !faceVectorEmbedding) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert base64 face vector to Uint8Array
    const vectorBuffer = base64ToUint8Array(faceVectorEmbedding)

    // Login user (face comparison should be done before this)
    const result = await authService.loginWithFace(userId, {
      faceVectorEmbedding: vectorBuffer,
      deviceInfo: {
        userAgent: request.headers.get('user-agent') || 'unknown',
        platform: 'web',
      },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
    })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          fullName: result.user.fullName,
          username: result.user.username,
          email: result.user.email,
          profilePictureUrl: result.user.profilePictureUrl,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}
