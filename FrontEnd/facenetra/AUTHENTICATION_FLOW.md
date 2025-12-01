# Face Authentication Flow

This document describes the complete face recognition authentication flow in FaceNetra.

## Overview

After successful liveness verification, the system automatically authenticates the user by searching for their face in the MongoDB database. If found, they are logged in. If not found, a new account is created automatically.

## Authentication Flow

### 1. Liveness Verification ✅
- User completes real-time liveness verification tasks
- System validates the user is a live person (not a photo/video)
- If passed, face recognition process begins

### 2. Face Recognition 🔍
**API Endpoint:** `POST /api/upload/verification`

The system:
- Captures the user's face image
- Uploads to Cloudinary for permanent storage
- Searches the face vector database for a match

### 3. Authentication 🔐
**API Endpoint:** `POST /api/auth/face-verification`

#### Case A: Match Found (Existing User)
```typescript
// User exists in MongoDB
1. Find user by vectorId
2. Generate JWT tokens (access + refresh)
3. Create login session
4. Update last login timestamp
5. Return user data + JWT tokens
```

#### Case B: No Match (New User)
```typescript
// User doesn't exist
1. Generate unique vectorId and randomId
2. Create new user in MongoDB with:
   - vectorId (from face recognition)
   - Cloudinary image URL
   - Auto-generated username
   - Profile details
3. Create privacy settings
4. Create search index
5. Generate JWT tokens
6. Create login session
7. Return user data + JWT tokens
```

### 4. Token Storage 💾
JWT tokens are stored in two places:
- **localStorage**: For client-side access
- **Cookies**: For middleware authentication

### 5. Redirect 🚀
After successful authentication:
- Display "Match Found" or "New User Created" message
- Show user information
- Auto-redirect to `/feed` after 2 seconds

## API Endpoints

### `/api/upload/verification` (POST)
Handles face verification and triggers authentication.

**Request:**
```typescript
FormData {
  image: string (base64),
  name: string (optional)
}
```

**Response:**
```typescript
{
  success: boolean,
  matchFound: boolean,      // true = existing user, false = new user
  isNewUser: boolean,        // true = account created, false = logged in
  data: {
    vectorId: string,
    confidence: number,
    cloudinaryUrl: string,
    userName: string,
    user: {
      id: string,
      username: string,
      fullName: string,
      profilePictureUrl: string
    }
  },
  tokens: {
    accessToken: string,     // Valid for 1 hour
    refreshToken: string     // Valid for 7 days
  },
  message: string
}
```

### `/api/auth/face-verification` (POST)
Authenticates user and generates JWT tokens.

**Request:**
```typescript
{
  vectorId: string,
  cloudinaryUrl: string,
  userName: string,
  confidence: number
}
```

**Response:**
```typescript
{
  success: boolean,
  isNewUser: boolean,
  user: {
    id: string,
    vectorId: string,
    fullName: string,
    username: string,
    profilePictureUrl: string,
    email?: string
  },
  tokens: {
    accessToken: string,
    refreshToken: string
  },
  message: string
}
```

## JWT Token Structure

### Access Token (1 hour expiry)
```typescript
{
  userId: string,      // MongoDB user ID
  vectorId: string,    // Face recognition vector ID
  randomId: string,    // Random user identifier
  iat: number,         // Issued at
  exp: number          // Expiry timestamp
}
```

### Refresh Token (7 days expiry)
Same structure as access token, but with longer expiry.

## Database Schema

### User Model
```prisma
model User {
  id                String    @id @default(auto()) @map("_id") @db.ObjectId
  vectorId          String    @unique
  randomId          String    @unique
  username          String?   @unique
  fullName          String
  profilePictureUrl String?
  email             String?   @unique
  lastLogin         DateTime?
  isActive          Boolean   @default(true)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Relations
  faceVectors       FaceVector[]
  loginSessions     LoginSession[]
  privacySettings   PrivacySettings?
}
```

### LoginSession Model
```prisma
model LoginSession {
  id               String      @id @default(auto()) @map("_id") @db.ObjectId
  userId           String      @db.ObjectId
  jwtTokenHash     String
  refreshTokenHash String
  deviceInfo       Json
  ipAddress        String
  loginMethod      LoginMethod  // FACE_SCAN
  isActive         Boolean     @default(true)
  expiresAt        DateTime
  createdAt        DateTime    @default(now())
}
```

## UI Flow

### TaskPanel Component
After verification passes, displays:
```
✅ VERIFICATION PASSED
Live person detected successfully

🔍 Face Recognition Results
Status: ✅ Match Found (or New User Created)
User: John Doe
Confidence: 88.4%

🚀 Redirecting to feed...
```

## Security Features

1. **JWT Tokens**: Secure authentication with short-lived access tokens
2. **Refresh Tokens**: Long-lived tokens for session renewal
3. **Login Sessions**: Track all active sessions per user
4. **Token Hashing**: Refresh tokens are hashed in database
5. **Device Tracking**: Store device info and IP address
6. **Session Invalidation**: Logout revokes tokens

## Environment Variables

Required in `.env`:
```env
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
DATABASE_URL=mongodb://...
FACE_RECOGNITION_API_URL=http://...
FACE_RECOGNITION_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Utility Functions

### Auth Utils (`lib/utils/auth.ts`)
```typescript
authUtils.setTokens(access, refresh)    // Store tokens
authUtils.getAccessToken()              // Get access token
authUtils.clearTokens()                 // Logout
authUtils.isAuthenticated()             // Check auth status
authUtils.getAuthHeader()               // Get Bearer header
authUtils.getUserId()                   // Extract user ID from token
```

## Protected Routes

Routes requiring authentication will redirect to `/realtime` for face verification:
- `/feed`
- `/profile`
- Any other non-public routes

Public routes (no auth required):
- `/`
- `/login`
- `/realtime`
- `/facematch`

## Error Handling

The system handles various error scenarios:
- Camera access denied
- Face not detected
- Liveness verification failed
- Network errors
- Database errors
- Token expiration

All errors are logged and displayed to the user with actionable messages.

## Future Enhancements

- [ ] Multi-factor authentication (MFA)
- [ ] Biometric re-verification for sensitive operations
- [ ] Device fingerprinting
- [ ] Suspicious activity detection
- [ ] Session management UI
- [ ] Token refresh automation
