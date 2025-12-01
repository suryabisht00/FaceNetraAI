# Profile API Testing Guide

Quick reference for testing the profile update system APIs.

## Prerequisites

1. Have a valid JWT token (get it from login API)
2. Set up environment variables in `.env`:
```env
DATABASE_URL="your_mongodb_connection_string"
JWT_SECRET="your-jwt-secret-key"
JWT_REFRESH_SECRET="your-jwt-refresh-secret-key"
```

## Testing with cURL

### 1. Get Current Profile
```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 2. Update Profile
```bash
curl -X PATCH http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "fullName": "John Doe",
    "username": "johndoe",
    "bio": "Full Stack Developer",
    "profilePictureUrl": "https://example.com/photo.jpg"
  }'
```

### 3. Add Social Link
```bash
curl -X POST http://localhost:3000/api/profile/social-links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "platform": "INSTAGRAM",
    "username": "johndoe",
    "isVisible": true
  }'
```

### 4. Add Interests
```bash
curl -X POST http://localhost:3000/api/profile/interests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "interests": ["Coding", "Photography", "Travel"]
  }'
```

### 5. Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### 6. Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Testing with JavaScript/TypeScript

### Browser Console Test
```javascript
// Get profile
const response = await fetch('/api/profile', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
  }
})
const profile = await response.json()
console.log(profile)

// Update profile
const updateResponse = await fetch('/api/profile', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
  },
  body: JSON.stringify({
    fullName: 'New Name',
    bio: 'Updated bio'
  })
})
const updated = await updateResponse.json()
console.log(updated)
```

## Testing with Postman/Thunder Client

### 1. Create Environment Variables
- `BASE_URL`: `http://localhost:3000`
- `ACCESS_TOKEN`: Your JWT access token
- `REFRESH_TOKEN`: Your JWT refresh token

### 2. Collection Structure

#### Get Profile
- Method: `GET`
- URL: `{{BASE_URL}}/api/profile`
- Headers:
  - `Authorization`: `Bearer {{ACCESS_TOKEN}}`

#### Update Profile
- Method: `PATCH`
- URL: `{{BASE_URL}}/api/profile`
- Headers:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer {{ACCESS_TOKEN}}`
- Body (JSON):
```json
{
  "fullName": "Jane Doe",
  "username": "janedoe",
  "bio": "Designer & Developer"
}
```

#### Add Social Link
- Method: `POST`
- URL: `{{BASE_URL}}/api/profile/social-links`
- Headers:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer {{ACCESS_TOKEN}}`
- Body (JSON):
```json
{
  "platform": "GITHUB",
  "username": "janedoe",
  "isVisible": true
}
```

#### Update Social Link
- Method: `PATCH`
- URL: `{{BASE_URL}}/api/profile/social-links`
- Headers:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer {{ACCESS_TOKEN}}`
- Body (JSON):
```json
{
  "id": "SOCIAL_LINK_ID",
  "username": "new_username",
  "isVisible": false
}
```

#### Delete Social Link
- Method: `DELETE`
- URL: `{{BASE_URL}}/api/profile/social-links?id=SOCIAL_LINK_ID`
- Headers:
  - `Authorization`: `Bearer {{ACCESS_TOKEN}}`

#### Add Interests
- Method: `POST`
- URL: `{{BASE_URL}}/api/profile/interests`
- Headers:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer {{ACCESS_TOKEN}}`
- Body (JSON):
```json
{
  "interests": [
    "AI Art",
    "Synthwave",
    "Bio-hacking"
  ]
}
```

#### Delete Interest
- Method: `DELETE`
- URL: `{{BASE_URL}}/api/profile/interests?id=INTEREST_ID`
- Headers:
  - `Authorization`: `Bearer {{ACCESS_TOKEN}}`

## Common Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

## Troubleshooting

### "Unauthorized - Invalid or missing token"
- Check if token is included in Authorization header
- Verify token format: `Bearer {token}`
- Check if token is expired (use refresh endpoint)

### "Username already taken"
- Try a different username
- Check existing usernames in database

### "Social link for this platform already exists"
- Update the existing link instead of creating new one
- Or delete the old link first

### "All interests already exist"
- The interests you're trying to add are already in your profile
- Check existing interests first

## Test Data Examples

### Valid Platforms
- `INSTAGRAM`
- `TWITTER`
- `LINKEDIN`
- `FACEBOOK`
- `GITHUB`
- `TIKTOK`
- `YOUTUBE`

### Sample Interests
```json
["Coding", "Music", "Photography", "Travel", "Gaming", "Reading", "Art", "Sports"]
```

### Sample Profile Data
```json
{
  "fullName": "Alex Nova",
  "username": "alexnova",
  "bio": "Cybernetic Artist exploring the nexus of humanity and technology",
  "profilePictureUrl": "https://example.com/alex.jpg",
  "email": "alex@example.com"
}
```

## Automation Testing Script

```typescript
// test-profile.ts
async function testProfileAPIs() {
  const baseURL = 'http://localhost:3000'
  const token = 'YOUR_ACCESS_TOKEN'
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
  
  try {
    // Test 1: Get profile
    console.log('🧪 Test 1: Getting profile...')
    const profile = await fetch(`${baseURL}/api/profile`, { headers })
    console.log('✅ Profile:', await profile.json())
    
    // Test 2: Update profile
    console.log('\n🧪 Test 2: Updating profile...')
    const update = await fetch(`${baseURL}/api/profile`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        bio: 'Test bio updated at ' + new Date().toISOString()
      })
    })
    console.log('✅ Updated:', await update.json())
    
    // Test 3: Add social link
    console.log('\n🧪 Test 3: Adding social link...')
    const social = await fetch(`${baseURL}/api/profile/social-links`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        platform: 'TWITTER',
        username: 'testuser'
      })
    })
    console.log('✅ Social link:', await social.json())
    
    // Test 4: Add interests
    console.log('\n🧪 Test 4: Adding interests...')
    const interests = await fetch(`${baseURL}/api/profile/interests`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        interests: ['Testing', 'Automation']
      })
    })
    console.log('✅ Interests:', await interests.json())
    
    console.log('\n✨ All tests passed!')
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run tests
testProfileAPIs()
```

Run with: `npx ts-node test-profile.ts`
