import { NextRequest, NextResponse } from 'next/server';
import { cloudinaryService } from '@/lib/cloudinary';

const FACE_API_BASE_URL = process.env.FACE_RECOGNITION_API_URL;
const FACE_API_KEY = process.env.FACE_RECOGNITION_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageData = formData.get('image') as string; // base64 data URL
    const userName = formData.get('name') as string;

    if (!imageData) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Step 1: Upload image to Cloudinary
    console.log('📤 Uploading image to Cloudinary...');
    let cloudinaryUrl: string;
    let cloudinaryPublicId: string;
    
    try {
      const uploadResult = await cloudinaryService.uploadImage(imageData, {
        folder: 'facenetra/verification',
        publicId: userName ? `user_${userName}_${Date.now()}` : undefined,
      });
      cloudinaryUrl = uploadResult.secureUrl;
      cloudinaryPublicId = uploadResult.publicId;
      console.log('✅ Image uploaded to Cloudinary:', cloudinaryUrl);
    } catch (uploadError: any) {
      console.error('❌ Cloudinary upload failed:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to upload image to Cloudinary' },
        { status: 500 }
      );
    }

    // Step 2: Convert base64 to File for face API
    const base64Data = imageData.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const file = new File([blob], 'verification.jpg', { type: 'image/jpeg' });

    // Step 3: Search for face in vector database
    console.log('🔍 Searching for face in vector database...');
    const searchFormData = new FormData();
    searchFormData.append('action', 'search');
    searchFormData.append('image', file);
    searchFormData.append('threshold', '0.6');

    const headers = new Headers();
    if (FACE_API_KEY) headers.append('X-API-Key', FACE_API_KEY);

    const searchResponse = await fetch(`${FACE_API_BASE_URL}/faces`, {
      method: 'POST',
      headers,
      body: searchFormData,
    });

    const searchData = await searchResponse.json();
    console.log('🔍 Search result:', searchData);

    let vectorId: string;
    let matchFound: boolean;
    let confidence: number;
    let finalUserName: string;

    // Step 4: If match found, use existing vectorId
    if (searchData.matched_user_id && searchData.match_score) {
      console.log('✅ Face match found!');
      matchFound = true;
      vectorId = searchData.matched_user_id;
      confidence = searchData.match_score;
      finalUserName = searchData.matched_metadata?.name || searchData.matched_user_id || 'Unknown';
    } else {
      // Step 5: No match found, add new face to database
      console.log('❌ No match found, adding new face to database...');
      const addFormData = new FormData();
      addFormData.append('action', 'add');
      addFormData.append('image', file);
      addFormData.append('name', userName || 'Anonymous User');
      addFormData.append('metadata', JSON.stringify({
        cloudinary_url: cloudinaryUrl,
        cloudinary_public_id: cloudinaryPublicId,
        verified_at: new Date().toISOString(),
      }));

      const addResponse = await fetch(`${FACE_API_BASE_URL}/faces`, {
        method: 'POST',
        headers,
        body: addFormData,
      });

      const addData = await addResponse.json();
      console.log('➕ Add face result:', addData);

      if (!addData.success) {
        return NextResponse.json(
          { success: false, error: addData.error || 'Failed to add face' },
          { status: 500 }
        );
      }

      console.log('✅ New face added successfully!');
      matchFound = false;
      vectorId = addData.data.person_id;
      confidence = 1.0;
      finalUserName = userName || 'Anonymous User';
    }

    // Step 6: Authenticate user (create account or login) and generate JWT
    console.log('🔐 Authenticating user with vectorId:', vectorId);
    const authResponse = await fetch(`${request.nextUrl.origin}/api/auth/face-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vectorId,
        cloudinaryUrl,
        userName: finalUserName,
        confidence,
      }),
    });

    if (!authResponse.ok) {
      const authError = await authResponse.json();
      console.error('❌ Authentication failed:', authError);
      return NextResponse.json(
        { success: false, error: authError.error || 'Authentication failed' },
        { status: 500 }
      );
    }

    const authData = await authResponse.json();
    console.log('✅ Authentication successful:', authData.isNewUser ? 'New user created' : 'User logged in');

    // Return authentication result with JWT tokens
    return NextResponse.json({
      success: true,
      matchFound,
      isNewUser: authData.isNewUser,
      data: {
        vectorId,
        confidence,
        cloudinaryUrl,
        cloudinaryPublicId,
        userName: finalUserName,
        user: authData.user,
      },
      tokens: authData.tokens,
      message: authData.message,
    });
  } catch (error: any) {
    console.error('❌ Verification error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
