# 📚 FaceNetra Documentation

Welcome to the FaceNetra documentation! This folder contains comprehensive guides for all features and systems.

## 📖 Documentation Index

### Getting Started
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide to get started
  - Environment setup
  - Database configuration
  - Testing the system
  - Common code examples

### Feature Documentation
- **[PROFILE_SYSTEM.md](./PROFILE_SYSTEM.md)** - Complete profile update system
  - Architecture overview
  - All API endpoints with examples
  - Frontend usage patterns
  - Security features
  - Database schema

- **[AUTHENTICATION_FLOW.md](./AUTHENTICATION_FLOW.md)** - Authentication system
  - Face recognition login flow
  - JWT token management
  - Session handling

- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Database configuration
  - Prisma setup
  - Schema design
  - Migrations

- **[CLOUDINARY_GUIDE.md](./CLOUDINARY_GUIDE.md)** - Image upload system
  - Cloudinary integration
  - Image optimization
  - Upload workflows

- **[LIVENESS_API_FLOW.md](./LIVENESS_API_FLOW.md)** - Liveness detection
  - Face liveness checks
  - Anti-spoofing measures

### Testing & Development
- **[API_TESTING.md](./API_TESTING.md)** - API testing guide
  - cURL examples
  - Postman collections
  - Automated testing scripts
  - Common scenarios

- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation details
  - What's been built
  - File structure
  - Key features
  - Best practices

## 🎯 Quick Navigation

### I want to...

#### Set up the project
→ Start with **[QUICK_START.md](./QUICK_START.md)**

#### Understand how authentication works
→ Read **[AUTHENTICATION_FLOW.md](./AUTHENTICATION_FLOW.md)**

#### Build profile features
→ Check **[PROFILE_SYSTEM.md](./PROFILE_SYSTEM.md)**

#### Test APIs
→ Follow **[API_TESTING.md](./API_TESTING.md)**

#### Configure the database
→ See **[DATABASE_SETUP.md](./DATABASE_SETUP.md)**

#### Implement image uploads
→ Review **[CLOUDINARY_GUIDE.md](./CLOUDINARY_GUIDE.md)**

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
├─────────────────────────────────────────────────────────┤
│  Pages & Components                                      │
│  - Profile Setup Page                                    │
│  - Login Page                                            │
│  - Feed, Realtime, etc.                                  │
├─────────────────────────────────────────────────────────┤
│  Hooks & Utils                                           │
│  - useProfile, useAuth                                   │
│  - authUtils, converters                                 │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    API Routes (Next.js)                  │
├─────────────────────────────────────────────────────────┤
│  Authentication                                          │
│  - /api/auth/login                                       │
│  - /api/auth/refresh                                     │
│  - /api/auth/logout                                      │
├─────────────────────────────────────────────────────────┤
│  Profile Management                                      │
│  - /api/profile                                          │
│  - /api/profile/social-links                            │
│  - /api/profile/interests                               │
├─────────────────────────────────────────────────────────┤
│  Content & Social                                        │
│  - /api/posts/feed                                       │
│  - /api/faces                                            │
│  - /api/upload                                           │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Middleware & Services                       │
├─────────────────────────────────────────────────────────┤
│  - JWT Authentication Middleware                         │
│  - Auth Service                                          │
│  - User Service                                          │
│  - Post Service                                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Database (MongoDB + Prisma)                 │
├─────────────────────────────────────────────────────────┤
│  Collections:                                            │
│  - Users, Posts, Comments, Likes                         │
│  - Connections, ScanHistory                              │
│  - UserSocialLinks, UserInterests                        │
│  - LoginSessions, FaceVectors                            │
└─────────────────────────────────────────────────────────┘
```

## 🔐 Security Features

### Authentication
- JWT access tokens (1 hour expiry)
- Refresh tokens (7 days expiry)
- Secure session management
- Device tracking

### API Protection
- Middleware-based authentication
- User ownership verification
- Input validation
- Rate limiting ready

### Privacy
- Granular privacy settings
- Public/Private/Friends-only content
- Social link visibility control
- Scan discovery opt-in/out

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hooks** - State management

### Backend
- **Next.js API Routes** - Server endpoints
- **Prisma** - ORM
- **MongoDB** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Services
- **Cloudinary** - Image hosting
- **Face Recognition API** - Liveness detection

## 📁 Project Structure

```
facenetra/
├── app/
│   ├── (pages)/           # Page routes
│   │   ├── profile-setup/ # Profile setup page
│   │   ├── login/         # Login page
│   │   ├── feed/          # Feed page
│   │   └── ...
│   └── api/               # API routes
│       ├── auth/          # Authentication
│       ├── profile/       # Profile management
│       ├── posts/         # Posts & content
│       └── ...
├── components/            # React components
├── lib/
│   ├── hooks/            # Custom hooks
│   ├── middleware/       # API middleware
│   ├── services/         # Business logic
│   ├── types/            # TypeScript types
│   └── utils/            # Utilities
├── prisma/
│   └── schema.prisma     # Database schema
├── Docs/                 # Documentation (you are here!)
└── public/               # Static files
```

## 🎓 Learning Path

### Beginner
1. Read **[QUICK_START.md](./QUICK_START.md)**
2. Follow **[DATABASE_SETUP.md](./DATABASE_SETUP.md)**
3. Explore **[AUTHENTICATION_FLOW.md](./AUTHENTICATION_FLOW.md)**

### Intermediate
1. Study **[PROFILE_SYSTEM.md](./PROFILE_SYSTEM.md)**
2. Practice with **[API_TESTING.md](./API_TESTING.md)**
3. Review **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)**

### Advanced
1. Implement custom features
2. Extend API endpoints
3. Add real-time features
4. Optimize performance

## 🤝 Contributing

When adding new features:
1. Update relevant documentation
2. Add API examples
3. Include type definitions
4. Write tests
5. Update this README if needed

## 📞 Support

For issues or questions:
1. Check the relevant documentation
2. Search existing documentation
3. Review code examples
4. Check console/network logs

## 🔄 Documentation Updates

This documentation is continuously updated. Last major update includes:
- ✅ Complete profile system
- ✅ JWT authentication
- ✅ Social links management
- ✅ Interests/hobbies system
- ✅ Comprehensive testing guide

## 📝 License

This documentation is part of the FaceNetra project.

---

**Happy coding!** 🚀

For the most recent updates, always check the individual documentation files.
