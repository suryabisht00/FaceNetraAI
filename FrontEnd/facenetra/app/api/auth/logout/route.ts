/**
 * Logout API Route
 * POST /api/auth/logout - Logout user and invalidate session
 */

import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/auth'
import { authService } from '@/lib/services'

/**
 * POST /api/auth/logout
 * Logout current user session
 */
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const authHeader = request.headers.get('authorization')
      const token = authHeader?.substring(7) // Remove 'Bearer ' prefix

      if (token) {
        await authService.logout(user.userId, token)
      }

      return NextResponse.json({
        success: true,
        message: 'Logged out successfully',
      })
    } catch (error) {
      console.error('Logout error:', error)
      return NextResponse.json(
        { success: false, error: 'Logout failed' },
        { status: 500 }
      )
    }
  })
}
