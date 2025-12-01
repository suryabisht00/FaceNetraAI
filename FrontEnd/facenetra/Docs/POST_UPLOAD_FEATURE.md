# Post Upload Feature Documentation

## Overview
Comprehensive post uploading feature for FaceNetraAI with support for text, images, and videos. Built following Next.js 14+ App Router best practices.

## 📁 Project Structure

```
facenetra/
├── app/
│   ├── (pages)/
│   │   └── add-post/
│   │       └── page.tsx                    # Post creation page
│   └── api/
│       ├── posts/
│       │   ├── route.ts                    # Create & list posts
│       │   ├── [id]/
│       │   │   ├── route.ts                # Get, update, delete post
│       │   │   ├── like/
│       │   │   │   └── route.ts            # Like/unlike post
│       │   │   └── comments/
│       │   │       └── route.ts            # Add & get comments
│       │   └── feed/
│       │       └── route.ts                # Feed posts
│       └── upload/
│           └── route.ts                    # Upload media to Cloudinary
├── components/
│   └── post/
│       ├── CreatePost.tsx                  # Post creation component
│       └── PostCard.tsx                    # Post display component
└── lib/
    ├── services/
    │   └── post.service.ts                 # Post business logic
    └── cloudinary.ts                       # Cloudinary integration
```

## 🎨 Features Implemented

### 1. Post Creation Component (`CreatePost.tsx`)
- **Text Input**: Rich textarea for post content
- **Media Upload**: Support for images and videos (up to 10 files)
- **Media Preview**: Visual preview with remove capability
- **Visibility Control**: Public, Friends Only, Private
- **File Validation**: 
  - Images: Max 10MB per file
  - Videos: Max 50MB per file
  - Max 10 media files total
- **Upload Progress**: Visual progress bar
- **Error Handling**: User-friendly error messages

### 2. Post Display Component (`PostCard.tsx`)
- User profile display with verification badge
- Time ago formatting using date-fns
- Media grid layout (responsive)
- Video player support
- Like, Comment, Share actions
- Engagement stats display
- Visibility indicators

### 3. Add Post Page (`/add-post`)
- Protected route (authentication required)
- Back navigation
- Posting tips section
- Quick action cards (Feed, Profile)
- Modern gradient background
- Mobile responsive

## 🔌 API Endpoints

### Posts API

#### Create Post
```typescript
POST /api/posts
Authorization: Bearer {token}

{
  "content": "Post content",
  "postType": "IMAGE" | "VIDEO" | "TEXT" | "LINK",
  "visibility": "PUBLIC" | "PRIVATE" | "FRIENDS_ONLY",
  "media": [
    {
      "url": "https://...",
      "type": "IMAGE" | "VIDEO" | "GIF",
      "width": 1200,
      "height": 800,
      "fileSize": 1024000
    }
  ]
}
```

#### Get Posts (Feed or User)
```typescript
GET /api/posts?userId={userId}&limit=20&offset=0
Authorization: Bearer {token}
```

#### Get Specific Post
```typescript
GET /api/posts/[id]
Authorization: Bearer {token}
```

#### Update Post
```typescript
PATCH /api/posts/[id]
Authorization: Bearer {token}

{
  "content": "Updated content",
  "visibility": "FRIENDS_ONLY"
}
```

#### Delete Post
```typescript
DELETE /api/posts/[id]
Authorization: Bearer {token}
```

#### Like/Unlike Post
```typescript
POST /api/posts/[id]/like
Authorization: Bearer {token}

Response: { "liked": true | false }
```

#### Get Comments
```typescript
GET /api/posts/[id]/comments?limit=20&offset=0
Authorization: Bearer {token}
```

#### Add Comment
```typescript
POST /api/posts/[id]/comments
Authorization: Bearer {token}

{
  "content": "Comment text",
  "parentCommentId": "optional-parent-id"
}
```

### Upload API

#### Upload Media
```typescript
POST /api/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
  - file: File
  - type: "image" | "video" | "profile" | "cover"

Response:
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "facenetra/posts/images/xyz",
    "width": 1200,
    "height": 800,
    "format": "jpg",
    "size": 1024000
  }
}
```

## 🔧 Technical Implementation

### Upload Flow
1. User selects media files
2. Files validated (type, size)
3. Preview generated using `URL.createObjectURL()`
4. On submit:
   - Each file uploaded to Cloudinary via `/api/upload`
   - Progress tracked and displayed
   - Media URLs collected
5. Post created via `/api/posts` with media URLs
6. User redirected to feed
7. Memory cleanup (URL.revokeObjectURL)

### State Management
```typescript
const [content, setContent] = useState('')
const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY'>('PUBLIC')
const [isUploading, setIsUploading] = useState(false)
const [uploadProgress, setUploadProgress] = useState(0)
const [error, setError] = useState<string | null>(null)
```

### Media File Interface
```typescript
interface MediaFile {
  file: File;
  preview: string;        // Blob URL for preview
  type: 'image' | 'video';
  id: string;             // Unique identifier
}
```

## 🎯 Database Schema (Prisma)

### Post Model
```prisma
model Post {
  id            String
  userId        String
  content       String
  postType      PostType
  visibility    VisibilityType
  likesCount    Int
  commentsCount Int
  sharesCount   Int
  isPinned      Boolean
  createdAt     DateTime
  updatedAt     DateTime
  
  user   User
  media  PostMedia[]
}
```

### PostMedia Model
```prisma
model PostMedia {
  id         String
  postId     String
  mediaUrl   String
  mediaType  MediaType
  mediaOrder Int
  width      Int?
  height     Int?
  fileSize   Int?
  createdAt  DateTime
  
  post Post
}
```

## 🔐 Security Features

1. **Authentication Required**: All endpoints require JWT token
2. **User Authorization**: Users can only edit/delete their own posts
3. **File Validation**: Type and size checks before upload
4. **SQL Injection Prevention**: Prisma ORM parameterized queries
5. **XSS Prevention**: Content sanitization on display

## 📱 Responsive Design

- Desktop: Full-width with max-width constraint
- Tablet: Adjusted grid layouts
- Mobile: 
  - Single column layout
  - Touch-optimized controls
  - Bottom navigation integration
  - Sticky header

## 🎨 UI/UX Features

1. **Visual Feedback**:
   - Upload progress bar
   - Loading states
   - Success/error messages
   - Active state indicators

2. **Accessibility**:
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation
   - Focus states

3. **Performance**:
   - Image optimization (Cloudinary)
   - Lazy loading
   - Memory cleanup
   - Optimistic UI updates

## 🚀 Usage Example

```typescript
import CreatePost from '@/components/post/CreatePost';

export default function Page() {
  const handleSuccess = () => {
    console.log('Post created!');
    router.push('/feed');
  };

  return <CreatePost onSuccess={handleSuccess} />;
}
```

## 📦 Dependencies Added

```json
{
  "date-fns": "^3.x.x"  // For time formatting
}
```

## 🔄 Integration Points

### With Navbar
- Desktop: "Add Post" menu item
- Mobile: Plus icon in bottom navigation
- Both link to `/add-post`

### With Feed
- Posts displayed using `PostCard` component
- Real-time updates after post creation
- Infinite scroll support ready

### With Profile
- User posts tab
- Create post from profile
- Post management

## 🧪 Testing Checklist

- [ ] Upload single image
- [ ] Upload multiple images (up to 10)
- [ ] Upload single video
- [ ] Upload mixed media
- [ ] Text-only post
- [ ] Validation: oversized files
- [ ] Validation: invalid file types
- [ ] Validation: empty content
- [ ] Visibility settings
- [ ] Cancel/back navigation
- [ ] Mobile responsiveness
- [ ] Like/unlike functionality
- [ ] Comment functionality
- [ ] Edit post
- [ ] Delete post

## 🐛 Error Handling

All errors are caught and displayed to users:
- File upload failures
- Network errors
- Validation errors
- Authentication errors
- Server errors

## 🔮 Future Enhancements

1. Draft saving
2. Scheduled posts
3. Poll creation
4. Location tagging
5. User mentions (@username)
6. Hashtag support (#topic)
7. GIF integration
8. Multiple image editor
9. Video trimming
10. Post analytics

## 📝 Notes

- All media stored in Cloudinary
- MongoDB used via Prisma
- Next.js 14+ App Router
- TypeScript throughout
- Tailwind CSS for styling
- JWT authentication
