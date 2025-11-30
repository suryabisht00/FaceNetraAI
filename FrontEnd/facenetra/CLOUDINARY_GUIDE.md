# Cloudinary Image/Video Upload Guide

## 🎨 Cloudinary Setup

Your Cloudinary configuration:
```
Cloud Name: dun7iwl7g
API Key: 953995955633461
```

## 📦 Installation

Cloudinary SDK is already installed:
```bash
npm install cloudinary
```

## 🔧 Configuration

Already configured in `.env`:
```env
CLOUDINARY_URL="cloudinary://953995955633461:Bqt42rdCByQ5Xt9YOfp231i_Of4@dun7iwl7g"
CLOUDINARY_CLOUD_NAME="dun7iwl7g"
CLOUDINARY_API_KEY="953995955633461"
CLOUDINARY_API_SECRET="Bqt42rdCByQ5Xt9YOfp231i_Of4"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dun7iwl7g"
```

## 🚀 Usage Examples

### 1. Upload Profile Picture

```typescript
import { cloudinaryService } from '@/lib/cloudinary'

// Upload from File
const file = event.target.files[0]
const result = await cloudinaryService.uploadProfilePicture(file)
console.log(result.secureUrl) // https://res.cloudinary.com/...
```

### 2. Upload Cover Photo

```typescript
const result = await cloudinaryService.uploadCoverPhoto(file)
// Automatically resized to 1500x500
```

### 3. Upload Post Media

```typescript
// Upload image
const imageResult = await cloudinaryService.uploadPostMedia(imageFile, 'image')

// Upload video
const videoResult = await cloudinaryService.uploadPostMedia(videoFile, 'video')
```

### 4. Upload via API Route

```typescript
// Frontend code
const formData = new FormData()
formData.append('file', file)
formData.append('type', 'profile') // 'profile' | 'cover' | 'image' | 'video'

const response = await fetch('/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
  body: formData,
})

const { data } = await response.json()
console.log(data.url) // Uploaded image URL
```

## 📁 Cloudinary Folder Structure

```
facenetra/
├── profiles/          # Profile pictures (400x400)
├── covers/           # Cover photos (1500x500)
├── posts/
│   ├── images/       # Post images (max 1200px)
│   └── videos/       # Post videos
```

## 🎯 Features

### Profile Picture Upload
- Automatic face detection cropping
- Resized to 400x400
- Optimized quality
- Auto format (WebP when supported)

### Cover Photo Upload
- Resized to 1500x500
- Optimized for web
- Auto format

### Post Media Upload
- Images: Max 1200px width
- Videos: Original quality
- Auto optimization
- Format conversion

## 🔒 Security

- Server-side upload only
- Authentication required
- Public URLs generated
- Secure HTTPS delivery

## 📖 Cloudinary Service Methods

### Upload Methods
```typescript
// Upload any image
await cloudinaryService.uploadImage(file, options)

// Upload video
await cloudinaryService.uploadVideo(file, options)

// Upload profile picture (with face crop)
await cloudinaryService.uploadProfilePicture(file)

// Upload cover photo
await cloudinaryService.uploadCoverPhoto(file)

// Upload post media
await cloudinaryService.uploadPostMedia(file, 'image' | 'video')
```

### Delete Method
```typescript
await cloudinaryService.deleteMedia(publicId, 'image' | 'video')
```

### URL Generation
```typescript
// Get optimized URL
const url = cloudinaryService.getOptimizedUrl(publicId, {
  width: 800,
  height: 600,
  crop: 'fill',
  quality: 'auto'
})

// Get thumbnail
const thumbUrl = cloudinaryService.getThumbnailUrl(publicId, 200)
```

## 🎨 Transformations

Cloudinary automatically applies transformations:

1. **Profile Pictures**: Face detection + 400x400 crop
2. **Cover Photos**: 1500x500 resize
3. **Post Images**: Max 1200px width
4. **Auto Quality**: Best quality/size ratio
5. **Auto Format**: WebP/AVIF when supported

## 💡 Tips

1. Use `secureUrl` (HTTPS) for production
2. Store `publicId` to delete images later
3. Use transformations for responsive images
4. Enable auto format for better performance
5. Use lazy loading for images

## 🔗 Resources

- [Cloudinary Dashboard](https://console.cloudinary.com)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Video Transformations](https://cloudinary.com/documentation/video_manipulation_and_delivery)
