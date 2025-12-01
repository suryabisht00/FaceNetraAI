import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/user.service';
import { authService } from '@/lib/services/auth.service';

/**
 * Face Verification Authentication API
 * 
 * This endpoint handles authentication after successful face verification:
 * 1. Searches MongoDB for existing user by vectorId
 * 2. If found: Logs in user and generates JWT
 * 3. If not found: Creates new user account with vectorId and cloudinary URL, then generates JWT
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vectorId, cloudinaryUrl, userName, confidence } = body;

    if (!vectorId || !cloudinaryUrl) {
      return NextResponse.json(
        { success: false, error: 'Vector ID and Cloudinary URL are required' },
        { status: 400 }
      );
    }

    console.log('🔐 Starting face authentication for vectorId:', vectorId);

    // Step 1: Search for existing user by vectorId
    const existingUser = await userService.findByVectorId(vectorId);

    if (existingUser) {
      // User exists - perform login
      console.log('✅ User found, logging in:', existingUser.id);

      // Generate JWT tokens
      const { accessToken, refreshToken } = await authService.generateTokens({
        userId: existingUser.id,
        vectorId: existingUser.vectorId,
        randomId: existingUser.randomId,
      });

      // Create login session
      await authService.createLoginSession({
        userId: existingUser.id,
        accessToken,
        refreshToken,
        deviceInfo: {
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown',
        loginMethod: 'FACE_SCAN',
      });

      // Update last login
      await userService.updateLastLogin(existingUser.id);

      return NextResponse.json({
        success: true,
        isNewUser: false,
        user: {
          id: existingUser.id,
          vectorId: existingUser.vectorId,
          fullName: existingUser.fullName,
          username: existingUser.username,
          profilePictureUrl: existingUser.profilePictureUrl,
          email: existingUser.email,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
        message: 'Login successful',
      });
    } else {
      // User doesn't exist - create new account
      console.log('🆕 User not found, creating new account for vectorId:', vectorId);

      // Generate random ID for new user
      const randomId = `usr_${Math.random().toString(36).substring(2, 15)}`;
      const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
      const defaultUsername = `user_${timestamp}`;

      // Create new user
      const newUser = await userService.createUser({
        vectorId,
        randomId,
        fullName: userName || defaultUsername,
        username: defaultUsername,
        profilePictureUrl: cloudinaryUrl,
      });

      console.log('✅ New user created:', newUser.id);

      // Generate JWT tokens
      const { accessToken, refreshToken } = await authService.generateTokens({
        userId: newUser.id,
        vectorId: newUser.vectorId,
        randomId: newUser.randomId,
      });

      // Create login session
      await authService.createLoginSession({
        userId: newUser.id,
        accessToken,
        refreshToken,
        deviceInfo: {
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown',
        loginMethod: 'FACE_SCAN',
      });

      return NextResponse.json({
        success: true,
        isNewUser: true,
        user: {
          id: newUser.id,
          vectorId: newUser.vectorId,
          fullName: newUser.fullName,
          username: newUser.username,
          profilePictureUrl: newUser.profilePictureUrl,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
        message: 'Account created successfully',
      });
    }
  } catch (error: any) {
    console.error('❌ Face authentication error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Authentication failed',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
