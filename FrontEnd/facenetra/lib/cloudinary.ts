import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  url: string
  publicId: string
  secureUrl: string
  width?: number
  height?: number
  format: string
  resourceType: string
  bytes: number
}

export const cloudinaryService = {
  /**
   * Upload image to Cloudinary
   */
  async uploadImage(
    file: File | Buffer | string,
    options?: {
      folder?: string
      publicId?: string
      transformation?: any
    }
  ): Promise<UploadResult> {
    try {
      let uploadData: string | Buffer

      if (file instanceof File) {
        // Convert File to base64
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        uploadData = `data:${file.type};base64,${buffer.toString('base64')}`
      } else if (Buffer.isBuffer(file)) {
        // Convert Buffer to base64
        uploadData = `data:image/jpeg;base64,${file.toString('base64')}`
      } else {
        // Assume it's already a base64 string or URL
        uploadData = file
      }

      const result = await cloudinary.uploader.upload(uploadData, {
        folder: options?.folder || 'facenetra/images',
        public_id: options?.publicId,
        transformation: options?.transformation,
        resource_type: 'image',
      })

      return {
        url: result.url,
        publicId: result.public_id,
        secureUrl: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        resourceType: result.resource_type,
        bytes: result.bytes,
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw new Error('Failed to upload image')
    }
  },

  /**
   * Upload video to Cloudinary
   */
  async uploadVideo(
    file: File | Buffer | string,
    options?: {
      folder?: string
      publicId?: string
    }
  ): Promise<UploadResult> {
    try {
      let uploadData: string | Buffer

      if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        uploadData = `data:${file.type};base64,${buffer.toString('base64')}`
      } else if (Buffer.isBuffer(file)) {
        uploadData = `data:video/mp4;base64,${file.toString('base64')}`
      } else {
        uploadData = file
      }

      const result = await cloudinary.uploader.upload(uploadData, {
        folder: options?.folder || 'facenetra/videos',
        public_id: options?.publicId,
        resource_type: 'video',
      })

      return {
        url: result.url,
        publicId: result.public_id,
        secureUrl: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        resourceType: result.resource_type,
        bytes: result.bytes,
      }
    } catch (error) {
      console.error('Cloudinary video upload error:', error)
      throw new Error('Failed to upload video')
    }
  },

  /**
   * Upload profile picture with transformations
   */
  async uploadProfilePicture(file: File | Buffer | string): Promise<UploadResult> {
    return await this.uploadImage(file, {
      folder: 'facenetra/profiles',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    })
  },

  /**
   * Upload cover photo with transformations
   */
  async uploadCoverPhoto(file: File | Buffer | string): Promise<UploadResult> {
    return await this.uploadImage(file, {
      folder: 'facenetra/covers',
      transformation: [
        { width: 1500, height: 500, crop: 'fill' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    })
  },

  /**
   * Upload post media (image or video)
   */
  async uploadPostMedia(
    file: File | Buffer | string,
    type: 'image' | 'video'
  ): Promise<UploadResult> {
    if (type === 'video') {
      return await this.uploadVideo(file, {
        folder: 'facenetra/posts/videos',
      })
    } else {
      return await this.uploadImage(file, {
        folder: 'facenetra/posts/images',
        transformation: [
          { width: 1200, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      })
    }
  },

  /**
   * Delete image/video from Cloudinary
   */
  async deleteMedia(publicId: string, resourceType: 'image' | 'video' = 'image') {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      })
      return result
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      throw new Error('Failed to delete media')
    }
  },

  /**
   * Get optimized URL for image
   */
  getOptimizedUrl(publicId: string, options?: {
    width?: number
    height?: number
    crop?: string
    quality?: string
  }): string {
    return cloudinary.url(publicId, {
      width: options?.width,
      height: options?.height,
      crop: options?.crop || 'fill',
      quality: options?.quality || 'auto',
      fetch_format: 'auto',
    })
  },

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl(publicId: string, size: number = 200): string {
    return cloudinary.url(publicId, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    })
  },
}

export default cloudinaryService
