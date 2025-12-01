# Profile Update System with JWT Authentication

This document explains the complete profile update system implementation with JWT authentication in the FaceNetra application.

## 🏗️ Architecture Overview

### Authentication Flow
1. User logs in via face recognition (`/api/auth/login`)
2. Server generates JWT access token (1hr) and refresh token (7 days)
3. Tokens are stored in localStorage on the client
4. Protected API routes verify JWT tokens using middleware
5. Tokens can be refreshed using `/api/auth/refresh`

### Components Structure

```
app/
├── (pages)/
│   └── profile-setup/
│       └── page.tsx              # Profile setup page with live preview
├── api/
│   ├── auth/
│   │   ├── login/route.ts        # Login with face recognition
│   │   ├── refresh/route.ts      # Refresh access token
│   │   └── logout/route.ts       # Logout and invalidate session
│   └── profile/
│       ├── route.ts              # GET & PATCH user profile
│       ├── social-links/route.ts # Manage social links
│       └── interests/route.ts    # Manage interests/hobbies

lib/
├── middleware/
│   └── auth.ts                   # JWT verification middleware
├── hooks/
│   └── useProfile.ts             # React hook for profile management
├── services/
│   ├── auth.service.ts           # Authentication service
│   └── user.service.ts           # User profile service
└── utils/
    └── auth.ts                   # Client-side auth utilities
```

## 🔐 API Endpoints

### Authentication APIs

#### 1. Login with Face Recognition
**POST** `/api/auth/login`

Request:
```json
{
  "userId": "user_id_here",
  "faceVectorEmbedding": "base64_encoded_vector"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "fullName": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "profilePictureUrl": "https://..."
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 2. Refresh Access Token
**POST** `/api/auth/refresh`

Request:
```json
{
  "refreshToken": "eyJhbGc..."
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

#### 3. Logout
**POST** `/api/auth/logout`

Headers: `Authorization: Bearer {accessToken}`

Response:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Profile APIs

#### 1. Get Current User Profile
**GET** `/api/profile`

Headers: `Authorization: Bearer {accessToken}`

Response:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "Software Engineer",
    "profilePictureUrl": "https://...",
    "socialLinks": [
      {
        "id": "...",
        "platform": "INSTAGRAM",
        "username": "johndoe",
        "profileUrl": "https://instagram.com/johndoe",
        "isVisible": true
      }
    ],
    "interests": [
      {
        "id": "...",
        "interest": "Coding",
        "category": "Technology"
      }
    ],
    "stats": {
      "postsCount": 42,
      "friendsCount": 150,
      "followersCount": 200,
      "followingCount": 180
    }
  }
}
```

#### 2. Update Profile
**PATCH** `/api/profile`

Headers: `Authorization: Bearer {accessToken}`

Request:
```json
{
  "fullName": "John Doe",
  "username": "johndoe",
  "bio": "Full Stack Developer",
  "profilePictureUrl": "https://...",
  "email": "john@example.com"
}
```

Response:
```json
{
  "success": true,
  "data": { /* updated user object */ },
  "message": "Profile updated successfully"
}
```

### Social Links APIs

#### 1. Get Social Links
**GET** `/api/profile/social-links`

Headers: `Authorization: Bearer {accessToken}`

#### 2. Add Social Link
**POST** `/api/profile/social-links`

Headers: `Authorization: Bearer {accessToken}`

Request:
```json
{
  "platform": "INSTAGRAM",
  "username": "johndoe",
  "isVisible": true
}
```

Supported platforms: `INSTAGRAM`, `TWITTER`, `LINKEDIN`, `FACEBOOK`, `GITHUB`, `TIKTOK`, `YOUTUBE`

#### 3. Update Social Link
**PATCH** `/api/profile/social-links`

Headers: `Authorization: Bearer {accessToken}`

Request:
```json
{
  "id": "social_link_id",
  "username": "new_username",
  "isVisible": false
}
```

#### 4. Delete Social Link
**DELETE** `/api/profile/social-links?id={linkId}`

Headers: `Authorization: Bearer {accessToken}`

### Interests APIs

#### 1. Get Interests
**GET** `/api/profile/interests`

Headers: `Authorization: Bearer {accessToken}`

#### 2. Add Interests (Bulk)
**POST** `/api/profile/interests`

Headers: `Authorization: Bearer {accessToken}`

Request:
```json
{
  "interests": ["Coding", "Music", "Photography"]
}
```

Or with categories:
```json
{
  "interests": [
    { "interest": "Coding", "category": "Technology" },
    { "interest": "Guitar", "category": "Music" }
  ]
}
```

#### 3. Delete Interest
**DELETE** `/api/profile/interests?id={interestId}`

Headers: `Authorization: Bearer {accessToken}`

## 🎨 Frontend Usage

### Using the Profile Setup Page

Navigate to `/profile-setup` to access the profile setup page with live preview.

### Using the `useProfile` Hook

```typescript
import { useProfile } from '@/lib/hooks/useProfile'

function MyComponent() {
  const {
    profile,
    loading,
    error,
    updateProfile,
    addSocialLink,
    addInterests,
  } = useProfile()

  const handleUpdate = async () => {
    await updateProfile({
      fullName: 'New Name',
      bio: 'New bio',
    })
  }

  const handleAddSocial = async () => {
    await addSocialLink('INSTAGRAM', 'myusername')
  }

  const handleAddInterests = async () => {
    await addInterests(['Coding', 'Music', 'Art'])
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>{profile?.fullName}</h1>
      <p>{profile?.bio}</p>
      {/* ... */}
    </div>
  )
}
```

### Manual API Calls

```typescript
import { authUtils } from '@/lib/utils/auth'

// Update profile
const response = await fetch('/api/profile', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    ...authUtils.getAuthHeader(),
  },
  body: JSON.stringify({
    fullName: 'John Doe',
    bio: 'Software Engineer',
  }),
})

const { data } = await response.json()
```

## 🔒 Security Features

### JWT Token Structure
```json
{
  "userId": "user_unique_id",
  "vectorId": "vector_unique_id",
  "randomId": "random_unique_id",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Middleware Protection

All profile APIs are protected using the `withAuth` middleware:

```typescript
import { withAuth } from '@/lib/middleware/auth'

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    // user.userId, user.vectorId, user.randomId are available
    // Your protected logic here
  })
}
```

### Session Management

- Access tokens expire after 1 hour
- Refresh tokens expire after 7 days
- Sessions are stored in the `LoginSession` table
- Sessions can be invalidated on logout
- Multiple sessions per user are supported

## 🗄️ Database Schema

### User Model
- Basic info: fullName, username, email, phone
- Profile: bio, profilePictureUrl, coverPhotoUrl
- Metadata: isVerified, isActive, privacyLevel
- Relations: socialLinks, interests, posts, etc.

### UserSocialLink Model
- platform: INSTAGRAM, TWITTER, etc.
- username: Social media username
- profileUrl: Auto-generated profile URL
- isVisible: Show/hide on profile

### UserInterest Model
- interest: Interest name
- category: Optional category
- Linked to user

### LoginSession Model
- JWT token hash (for validation)
- Refresh token hash
- Device info and IP address
- Expiration tracking

## 🚀 Getting Started

1. **Setup Environment Variables**
```env
DATABASE_URL="mongodb://..."
JWT_SECRET="your-secret-key-here"
JWT_REFRESH_SECRET="your-refresh-secret-key-here"
```

2. **Run Prisma Migrations**
```bash
npm run db:push
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Test the Profile Setup Page**
Navigate to `http://localhost:3000/profile-setup`

## 📝 Example Usage Flow

1. User logs in via face recognition
2. Tokens are stored in localStorage
3. User navigates to `/profile-setup`
4. Profile data is auto-loaded if exists
5. User updates profile information
6. Live preview shows changes in real-time
7. On submit, multiple API calls are made:
   - PATCH `/api/profile` - Update basic info
   - POST `/api/profile/social-links` - Add Instagram
   - POST `/api/profile/interests` - Add hobbies
8. User is redirected to `/feed` on success

## 🛠️ Error Handling

All APIs return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `404` - Resource not found
- `500` - Server error

## 🔄 Token Refresh Strategy

Implement automatic token refresh in your app:

```typescript
import { authUtils } from '@/lib/utils/auth'

async function refreshTokenIfNeeded() {
  if (authUtils.shouldRefreshToken()) {
    const refreshToken = authUtils.getRefreshToken()
    
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    
    const { data } = await response.json()
    authUtils.setTokens(data.accessToken, refreshToken!)
  }
}
```

## 📚 Additional Resources

- [Prisma Schema](../../prisma/schema.prisma)
- [Authentication Flow](./AUTHENTICATION_FLOW.md)
- [Database Setup](./DATABASE_SETUP.md)
