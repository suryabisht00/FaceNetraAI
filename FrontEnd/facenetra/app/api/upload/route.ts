import { NextRequest, NextResponse } from 'next/server'
import { cloudinaryService } from '@/lib/cloudinary'
import { authService } from '@/lib/services'

/**
 * Upload Image/Video to Cloudinary
 * POST /api/upload
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    await authService.verifyAccessToken(token)

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as 'image' | 'video' | 'profile' | 'cover'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case 'profile':
        result = await cloudinaryService.uploadProfilePicture(file)
        break
      case 'cover':
        result = await cloudinaryService.uploadCoverPhoto(file)
        break
      case 'video':
        result = await cloudinaryService.uploadPostMedia(file, 'video')
        break
      default:
        result = await cloudinaryService.uploadPostMedia(file, 'image')
    }

    return NextResponse.json({
      success: true,
      data: {
        url: result.secureUrl,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    )
  }
}
