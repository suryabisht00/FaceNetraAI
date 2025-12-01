/**
 * JWT Authentication Middleware for API Routes
 * Use this to protect API routes and extract user information from JWT tokens
 */

import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string
    vectorId: string
    randomId: string
  }
}

/**
 * Extract and verify JWT token from Authorization header
 */
export async function verifyToken(request: NextRequest): Promise<{
  userId: string
  vectorId: string
  randomId: string
} | null> {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = verify(token, JWT_SECRET) as {
      userId: string
      vectorId: string
      randomId: string
    }

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, isActive: true },
    })

    if (!user || !user.isActive) {
      return null
    }

    return decoded
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

/**
 * Middleware wrapper to protect API routes
 * Usage:
 * 
 * export async function GET(request: NextRequest) {
 *   return withAuth(request, async (req, user) => {
 *     // Your protected route logic here
 *     // user.userId, user.vectorId, user.randomId are available
 *     return NextResponse.json({ data: 'protected data' })
 *   })
 * }
 */
export async function withAuth(
  request: NextRequest,
  handler: (
    request: NextRequest,
    user: { userId: string; vectorId: string; randomId: string }
  ) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await verifyToken(request)

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized - Invalid or missing token' },
      { status: 401 }
    )
  }

  return handler(request, user)
}

/**
 * Optional auth middleware - doesn't require authentication but extracts user if token is present
 */
export async function withOptionalAuth(
  request: NextRequest,
  handler: (
    request: NextRequest,
    user: { userId: string; vectorId: string; randomId: string } | null
  ) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await verifyToken(request)
  return handler(request, user)
}
