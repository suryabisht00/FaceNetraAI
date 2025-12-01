/**
 * Refresh Token API Route
 * POST /api/auth/refresh - Refresh access token using refresh token
 */

import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/services'

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token is required' },
        { status: 400 }
      )
    }

    // Refresh the access token
    const result = await authService.refreshAccessToken(refreshToken)

    return NextResponse.json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json(
      { success: false, error: 'Invalid or expired refresh token' },
      { status: 401 }
    )
  }
}
