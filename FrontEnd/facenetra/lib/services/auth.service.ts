import { prisma } from '@/lib/prisma'
import { hash, compare } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'

export interface FaceRegistrationData {
  fullName: string
  email?: string
  phone?: string
  username?: string
  faceVectorEmbedding: Uint8Array // Binary face embedding
  vectorVersion: string
  deviceInfo?: object
  ipAddress?: string
}

export interface FaceLoginData {
  faceVectorEmbedding: Uint8Array
  deviceInfo?: object
  ipAddress?: string
}

export interface JWTPayload {
  userId: string
  vectorId: string
  randomId: string
}

export const authService = {
  /**
   * Register a new user with face vector
   */
  async registerWithFace(data: FaceRegistrationData) {
    try {
      // Generate unique vector ID and random ID
      const vectorId = `vec_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      const randomId = `usr_${Math.random().toString(36).substring(2, 15)}`

      // Create user and face vector in transaction
      const user = await prisma.$transaction(async (tx) => {
        // Create user
        const newUser = await tx.user.create({
          data: {
            vectorId,
            randomId,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            username: data.username,
          },
        })

        // Create face vector (encrypted)
        await tx.faceVector.create({
          data: {
            userId: newUser.id,
            vectorEmbedding: Buffer.from(data.faceVectorEmbedding),
            vectorVersion: data.vectorVersion,
            isPrimary: true,
          },
        })

        // Create default privacy settings
        await tx.privacySettings.create({
          data: {
            userId: newUser.id,
          },
        })

        // Create search index
        await tx.userSearchIndex.create({
          data: {
            userId: newUser.id,
            searchText: `${newUser.fullName} ${newUser.username || ''}`,
          },
        })

        return newUser
      })

      // Generate JWT tokens
      const { accessToken, refreshToken } = await this.generateTokens({
        userId: user.id,
        vectorId: user.vectorId,
        randomId: user.randomId,
      })

      // Create login session
      await this.createLoginSession({
        userId: user.id,
        accessToken,
        refreshToken,
        deviceInfo: data.deviceInfo,
        ipAddress: data.ipAddress,
        loginMethod: 'FACE_SCAN',
      })

      return {
        user,
        accessToken,
        refreshToken,
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw new Error('Failed to register user')
    }
  },

  /**
   * Login with face recognition
   * This should be called after face vector comparison is successful
   */
  async loginWithFace(userId: string, data: FaceLoginData) {
    try {
      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          faceVectors: {
            where: { isPrimary: true },
          },
        },
      })

      if (!user || !user.isActive) {
        throw new Error('User not found or inactive')
      }

      // Update last login
      await prisma.user.update({
        where: { id: userId },
        data: { lastLogin: new Date() },
      })

      // Generate JWT tokens
      const { accessToken, refreshToken } = await this.generateTokens({
        userId: user.id,
        vectorId: user.vectorId,
        randomId: user.randomId,
      })

      // Create login session
      await this.createLoginSession({
        userId: user.id,
        accessToken,
        refreshToken,
        deviceInfo: data.deviceInfo,
        ipAddress: data.ipAddress,
        loginMethod: 'FACE_SCAN',
      })

      return {
        user,
        accessToken,
        refreshToken,
      }
    } catch (error) {
      console.error('Login error:', error)
      throw new Error('Failed to login')
    }
  },

  /**
   * Generate JWT access and refresh tokens
   */
  async generateTokens(payload: JWTPayload) {
    const accessToken = sign(payload, JWT_SECRET, { expiresIn: '1h' })
    const refreshToken = sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' })

    return { accessToken, refreshToken }
  },

  /**
   * Verify JWT access token
   */
  async verifyAccessToken(token: string): Promise<JWTPayload> {
    try {
      return verify(token, JWT_SECRET) as JWTPayload
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  },

  /**
   * Verify JWT refresh token
   */
  async verifyRefreshToken(token: string): Promise<JWTPayload> {
    try {
      return verify(token, JWT_REFRESH_SECRET) as JWTPayload
    } catch (error) {
      throw new Error('Invalid or expired refresh token')
    }
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = await this.verifyRefreshToken(refreshToken)
      
      // Check if session is still active
      const session = await prisma.loginSession.findFirst({
        where: {
          userId: payload.userId,
          refreshTokenHash: await hash(refreshToken, 10),
          isActive: true,
        },
      })

      if (!session) {
        throw new Error('Session not found or expired')
      }

      // Generate new access token
      const accessToken = sign(
        {
          userId: payload.userId,
          vectorId: payload.vectorId,
          randomId: payload.randomId,
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      )

      return { accessToken }
    } catch (error) {
      console.error('Refresh token error:', error)
      throw new Error('Failed to refresh token')
    }
  },

  /**
   * Create login session
   */
  async createLoginSession(data: {
    userId: string
    accessToken: string
    refreshToken: string
    deviceInfo?: object
    ipAddress?: string
    loginMethod: 'FACE_SCAN' | 'FALLBACK_EMAIL' | 'FALLBACK_PHONE'
  }) {
    const jwtTokenHash = await hash(data.accessToken, 10)
    const refreshTokenHash = await hash(data.refreshToken, 10)

    return await prisma.loginSession.create({
      data: {
        userId: data.userId,
        jwtTokenHash,
        refreshTokenHash,
        deviceInfo: data.deviceInfo || {},
        ipAddress: data.ipAddress || 'unknown',
        loginMethod: data.loginMethod,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    })
  },

  /**
   * Logout user (invalidate session)
   */
  async logout(userId: string, accessToken: string) {
    const jwtTokenHash = await hash(accessToken, 10)

    return await prisma.loginSession.updateMany({
      where: {
        userId,
        jwtTokenHash,
      },
      data: {
        isActive: false,
      },
    })
  },

  /**
   * Logout all sessions for a user
   */
  async logoutAll(userId: string) {
    return await prisma.loginSession.updateMany({
      where: { userId },
      data: { isActive: false },
    })
  },
}
