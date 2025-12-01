# 🚀 Quick Start Guide - Profile Update System

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB database running
- Basic understanding of Next.js and React

## ⚡ Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create/update `.env` file:
```env
# Database
DATABASE_URL="mongodb://localhost:27017/facenetra"

# JWT Secrets (use strong random strings in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"

# Cloudinary (optional for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Initialize Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed database with sample data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

## 🎯 Test the System

### Method 1: Use the UI (Recommended)

1. **Navigate to Profile Setup Page**
   ```
   http://localhost:3000/profile-setup
   ```

2. **Fill in the form:**
   - Name: `Alex Nova`
   - Username: `alexnova`
   - Instagram: `alexnova`
   - Profession: `Cybernetic Artist`
   - Hobbies: `AI Art, Synthwave, Bio-hacking`
   - Profile Picture URL: (optional)
   - Toggle diary highlights: On/Off

3. **Click "Save Profile"**
   - You'll see success message
   - Auto-redirect to feed page

4. **See live preview update in real-time!**

### Method 2: Test APIs Directly

#### Get Profile
```bash
# In browser console or using fetch
const response = await fetch('/api/profile', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
  }
})
const profile = await response.json()
console.log(profile)
```

#### Update Profile
```bash
await fetch('/api/profile', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
  },
  body: JSON.stringify({
    fullName: 'New Name',
    bio: 'New bio'
  })
})
```

## 🔑 Getting an Access Token

### If you already have login working:
1. Login via your existing login page
2. Token will be automatically stored in localStorage
3. Access it via: `localStorage.getItem('accessToken')`

### If you need to create a test user:

#### Option A: Use Prisma Studio
```bash
npm run db:studio
```
Then manually create a user in the database.

#### Option B: Create via API (if registration is implemented)
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'Test User',
    email: 'test@example.com',
    faceVectorEmbedding: 'base64_encoded_vector',
    vectorVersion: '1.0'
  })
})
const { accessToken } = await response.json()
localStorage.setItem('accessToken', accessToken)
```

## 📱 Using in Your Components

### Simple Example
```typescript
'use client'

import { useProfile } from '@/lib/hooks/useProfile'

export default function ProfilePage() {
  const { profile, loading, updateProfile } = useProfile()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>{profile?.fullName}</h1>
      <p>{profile?.bio}</p>
      <button onClick={() => updateProfile({ bio: 'Updated!' })}>
        Update Bio
      </button>
    </div>
  )
}
```

### Advanced Example with All Features
```typescript
'use client'

import { useProfile } from '@/lib/hooks/useProfile'

export default function AdvancedProfilePage() {
  const {
    profile,
    loading,
    error,
    updateProfile,
    addSocialLink,
    addInterests,
    deleteSocialLink,
    deleteInterest,
  } = useProfile()

  const handleUpdateBasicInfo = async () => {
    await updateProfile({
      fullName: 'John Doe',
      username: 'johndoe',
      bio: 'Software Engineer',
    })
  }

  const handleAddInstagram = async () => {
    await addSocialLink('INSTAGRAM', 'johndoe', true)
  }

  const handleAddHobbies = async () => {
    await addInterests(['Coding', 'Music', 'Travel'])
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-8">
      {/* Basic Info */}
      <section>
        <h1 className="text-2xl font-bold">{profile?.fullName}</h1>
        <p className="text-gray-600">@{profile?.username}</p>
        <p className="mt-2">{profile?.bio}</p>
        <button 
          onClick={handleUpdateBasicInfo}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Update Info
        </button>
      </section>

      {/* Social Links */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Social Links</h2>
        <div className="space-y-2 mt-4">
          {profile?.socialLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-4">
              <span>{link.platform}: {link.username}</span>
              <button 
                onClick={() => deleteSocialLink(link.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button 
          onClick={handleAddInstagram}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Add Instagram
        </button>
      </section>

      {/* Interests */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Interests</h2>
        <div className="flex gap-2 mt-4 flex-wrap">
          {profile?.interests.map((interest) => (
            <span 
              key={interest.id}
              className="px-3 py-1 bg-orange-100 rounded-full cursor-pointer"
              onClick={() => deleteInterest(interest.id)}
            >
              {interest.interest} ✕
            </span>
          ))}
        </div>
        <button 
          onClick={handleAddHobbies}
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded"
        >
          Add Hobbies
        </button>
      </section>

      {/* Stats */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Stats</h2>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div>
            <p className="text-2xl font-bold">{profile?.stats.postsCount}</p>
            <p className="text-gray-600">Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{profile?.stats.friendsCount}</p>
            <p className="text-gray-600">Friends</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{profile?.stats.followersCount}</p>
            <p className="text-gray-600">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{profile?.stats.followingCount}</p>
            <p className="text-gray-600">Following</p>
          </div>
        </div>
      </section>
    </div>
  )
}
```

## 🔧 Common Tasks

### Update Profile Picture
```typescript
await updateProfile({
  profilePictureUrl: 'https://example.com/new-photo.jpg'
})
```

### Add Multiple Social Links
```typescript
await addSocialLink('INSTAGRAM', 'myusername')
await addSocialLink('TWITTER', 'myhandle')
await addSocialLink('GITHUB', 'mydeveloper')
```

### Bulk Add Interests
```typescript
await addInterests([
  'Programming',
  'Photography',
  'Travel',
  'Music',
  'Gaming'
])
```

### Check if User is Authenticated
```typescript
import { authUtils } from '@/lib/utils/auth'

if (authUtils.isAuthenticated()) {
  // User is logged in
  const userId = authUtils.getUserId()
  console.log('User ID:', userId)
}
```

### Logout User
```typescript
await fetch('/api/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
  }
})

// Clear tokens
localStorage.removeItem('accessToken')
localStorage.removeItem('refreshToken')

// Redirect to login
router.push('/login')
```

## 📚 Learn More

- **Full Documentation**: `Docs/PROFILE_SYSTEM.md`
- **API Testing Guide**: `Docs/API_TESTING.md`
- **Implementation Summary**: `Docs/IMPLEMENTATION_SUMMARY.md`

## 🆘 Troubleshooting

### "Cannot find module '@/lib/...'"
Make sure your `tsconfig.json` has path aliases configured:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### "Unauthorized" errors
1. Check if you're logged in: `localStorage.getItem('accessToken')`
2. Verify token is valid (not expired)
3. Include Authorization header in requests

### Profile not loading
1. Check network tab for API errors
2. Verify MongoDB is running
3. Check console for JavaScript errors
4. Ensure Prisma client is generated: `npm run db:generate`

### Social link already exists
- Each platform can only be added once
- Update the existing link instead
- Or delete and re-add

## ✅ Checklist

- [ ] Environment variables configured
- [ ] Database running and accessible
- [ ] Prisma client generated
- [ ] Development server started
- [ ] Can access profile setup page
- [ ] Form saves successfully
- [ ] Live preview works
- [ ] APIs return expected data

## 🎉 You're Ready!

Start building amazing profile features with the system. Happy coding! 🚀
