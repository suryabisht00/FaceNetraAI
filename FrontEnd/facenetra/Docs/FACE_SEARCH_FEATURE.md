# Face Search User Discovery Feature

## Overview
This feature allows users to upload an image and find matching user profiles with their public posts, similar to Instagram's profile view.

## Flow
1. **Upload Image** → User uploads a photo containing a face
2. **Face Search** → Backend API searches for matching face vector
3. **Fetch Profile** → If match found, fetch user profile by vectorId
4. **Display Profile** → Show user profile with stats, bio, interests, and social links
5. **Show Posts** → Display public posts in Instagram-style grid
6. **Post Details** → Click on any post to view full details in modal

## Components Created

### 1. Updated Hook: `useFaceAPI.ts`
- Enhanced `searchFace` function to return vectorId and match score
- Returns structured `FaceSearchResult` object
- Provides search result state for UI feedback

### 2. New Hook: `useUserSearch.ts`
- Fetches user profile and posts by vectorId
- Handles pagination for loading more posts
- Manages loading, error, and data states
- Provides `reset()` function to clear state

### 3. New Component: `ProfileHeader.tsx`
- Displays cover photo and profile picture
- Shows user stats (posts, followers, following)
- Renders bio, interests, and social links
- Mobile-responsive design
- Verified badge for verified users

### 4. New Component: `PostsGrid.tsx`
- Instagram-style 3-column grid layout
- Hover effect showing likes and comments
- Click to open post in modal overlay
- Handles empty state
- Load more functionality
- Shows media type indicators (video, multiple images)

### 5. New Component: `UserProfileView.tsx`
- Main container combining ProfileHeader and PostsGrid
- Back button navigation
- Sticky header with user name
- Infinite scroll support

### 6. Updated Page: `search-users/page.tsx`
- Image upload with preview
- Similarity threshold slider (0-100%)
- Multi-stage view states: upload → searching → profile → error
- Loading indicators during search and profile fetch
- Error handling with retry option
- Informational "How it works" section

### 7. New API Route: `/api/users/by-vector/[vectorId]/route.ts`
- Fetches user by vectorId from face search
- Returns profile data with stats
- Returns public posts with pagination
- Privacy checks (only public profiles)
- Supports limit/offset query parameters

## API Endpoints

### GET `/api/users/by-vector/[vectorId]`
Fetches user profile and public posts by vectorId.

**Query Parameters:**
- `limit` (optional): Number of posts to return (default: 12)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "string",
      "vectorId": "string",
      "username": "string",
      "fullName": "string",
      "bio": "string",
      "profilePictureUrl": "string",
      "coverPhotoUrl": "string",
      "isVerified": boolean,
      "socialLinks": [...],
      "interests": [...],
      "stats": {
        "postsCount": number,
        "friendsCount": number,
        "followersCount": number,
        "followingCount": number
      }
    },
    "posts": [...],
    "pagination": {
      "total": number,
      "limit": number,
      "offset": number,
      "hasMore": boolean
    }
  }
}
```

## Mobile Optimizations

1. **Responsive Grid**: 3-column grid on all screen sizes
2. **Touch-friendly**: Large tap targets for mobile
3. **Adaptive Text**: Smaller text on mobile, larger on desktop
4. **Image Preview**: Optimized image loading
5. **Modal View**: Full-screen modal for post details
6. **Sticky Header**: Header stays visible while scrolling
7. **Touch Gestures**: Swipe support for modals

## Features

✅ Face-based user search
✅ Instagram-style profile view
✅ Public posts grid display
✅ Post detail modal
✅ Loading states and error handling
✅ Privacy filtering (only public profiles)
✅ Pagination support
✅ Mobile-responsive design
✅ Social links integration
✅ Interests display
✅ User stats (posts, followers, following)
✅ Verified badge support
✅ Image preview before upload
✅ Adjustable similarity threshold
✅ Back navigation

## Usage Example

```tsx
// User flow:
1. Navigate to /search-users
2. Click "Select Image" and choose a photo
3. Adjust similarity threshold if needed (default 60%)
4. Click "Search" button
5. System searches for matching face
6. If match found, automatically loads and displays profile
7. View user's posts in grid
8. Click any post to view details
9. Click "Load More" for additional posts
10. Click back arrow to return to search
```

## Code Reuse

The implementation reuses:
- `PostCard` component for post details
- `useFaceAPI` hook (enhanced)
- Existing type definitions from `lib/types`
- Existing API proxy pattern
- Prisma models and services
- Design system colors and styles

## Future Enhancements

- [ ] Connection request from profile
- [ ] Share profile functionality
- [ ] Save/bookmark posts
- [ ] Report user option
- [ ] Block user functionality
- [ ] Similar users suggestions
- [ ] Search history
- [ ] Batch face search
