# Post Upload Feature - Quick Start Guide

## ✅ What's Been Implemented

A complete post uploading system with the following features:

### 🎯 Core Features
- ✅ Create posts with text, images, and videos
- ✅ Upload up to 10 media files per post
- ✅ Real-time media preview
- ✅ Upload progress tracking
- ✅ Visibility controls (Public/Friends Only/Private)
- ✅ Like/unlike posts
- ✅ Comment on posts
- ✅ Edit and delete posts
- ✅ Responsive design (desktop + mobile)

### 📂 New Files Created

#### Components
1. **`components/post/CreatePost.tsx`** - Main post creation component
2. **`components/post/PostCard.tsx`** - Post display component

#### Pages
3. **`app/(pages)/add-post/page.tsx`** - Post creation page

#### API Routes
4. **`app/api/posts/route.ts`** - Create & list posts
5. **`app/api/posts/[id]/route.ts`** - Get, update, delete specific post
6. **`app/api/posts/[id]/like/route.ts`** - Like/unlike functionality
7. **`app/api/posts/[id]/comments/route.ts`** - Comment management

#### Documentation
8. **`Docs/POST_UPLOAD_FEATURE.md`** - Complete technical documentation

### 🔄 Modified Files
- **`components/landingPage/Navbar.tsx`** - Added proper links to `/add-post`

## 🚀 How to Use

### 1. Access Post Creation
Navigate to `/add-post` or click:
- **Desktop**: "Add Post" in top navbar
- **Mobile**: Plus icon (➕) in bottom navigation

### 2. Create a Post
```
1. Enter your text content
2. (Optional) Click "Add Media" to upload images/videos
3. Select visibility (Public/Friends/Private)
4. Click "Post"
```

### 3. Supported Media
- **Images**: JPG, PNG, GIF (max 10MB each)
- **Videos**: MP4, MOV, AVI (max 50MB each)
- **Limit**: 10 files per post

## 🔌 API Usage

### Create a Post
```typescript
const response = await fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    content: "Hello world!",
    postType: "TEXT",
    visibility: "PUBLIC",
    media: [] // Optional media array
  })
});
```

### Upload Media First
```typescript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('type', 'image');

const uploadResponse = await fetch('/api/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

const { data } = await uploadResponse.json();
// Use data.url in your post media array
```

## 📱 User Flow

```
User clicks "Add Post"
    ↓
Navigates to /add-post
    ↓
Enters content & uploads media
    ↓
Media uploaded to Cloudinary
    ↓
Post created in database
    ↓
User redirected to /feed
    ↓
Post appears in feed
```

## 🎨 Component Props

### CreatePost Component
```typescript
<CreatePost 
  onSuccess={() => {
    // Called after successful post creation
    router.push('/feed');
  }}
/>
```

### PostCard Component
```typescript
<PostCard 
  post={postData}
  onLike={(postId) => handleLike(postId)}
  onComment={(postId) => handleComment(postId)}
  onShare={(postId) => handleShare(postId)}
/>
```

## 🔐 Authentication

All post endpoints require authentication:
```typescript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
}
```

## 🎯 Database Schema

Posts are stored with:
- User ID (author)
- Content (text)
- Post type (TEXT/IMAGE/VIDEO/LINK)
- Visibility (PUBLIC/PRIVATE/FRIENDS_ONLY)
- Media array (uploaded files)
- Engagement counts (likes, comments, shares)

## 📊 Validation Rules

| Field | Rule |
|-------|------|
| Content | Required if no media |
| Media files | Max 10 files |
| Image size | Max 10MB per file |
| Video size | Max 50MB per file |
| File types | Images: jpg, png, gif / Videos: mp4, mov, avi |
| Post type | TEXT, IMAGE, VIDEO, LINK |
| Visibility | PUBLIC, PRIVATE, FRIENDS_ONLY |

## 🐛 Error Handling

The system handles:
- Invalid file types
- Oversized files
- Network errors
- Authentication failures
- Server errors

All errors are displayed to users with clear messages.

## 🔄 Next Steps

To integrate with feed:
1. Import `PostCard` component in feed page
2. Fetch posts using `/api/posts` endpoint
3. Map over posts and render with `PostCard`

```typescript
// In your feed page
import PostCard from '@/components/post/PostCard';

const posts = await fetchPosts();

return (
  <div className="space-y-4">
    {posts.map(post => (
      <PostCard 
        key={post.id} 
        post={post}
        onLike={handleLike}
        onComment={handleComment}
      />
    ))}
  </div>
);
```

## 📞 Support

For detailed technical documentation, see:
- **`Docs/POST_UPLOAD_FEATURE.md`** - Complete implementation details
- **`Docs/API_TESTING.md`** - API endpoint testing guide

## ✨ Features to Test

- [ ] Create text-only post
- [ ] Create post with single image
- [ ] Create post with multiple images
- [ ] Create post with video
- [ ] Change visibility settings
- [ ] View upload progress
- [ ] Cancel post creation
- [ ] View post in feed
- [ ] Like a post
- [ ] Comment on a post

---

**All set! The post upload feature is ready to use! 🎉**
