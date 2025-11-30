# FaceNetra Database Setup Guide

## 📦 Installation

Install the required dependencies:

```bash
npm install
```

This will install:
- `@prisma/client` - Prisma Client for database queries
- `prisma` - Prisma CLI for migrations
- `bcryptjs` - Password/token hashing
- `jsonwebtoken` - JWT authentication

## 🗄️ Database Setup

### 1. Set up MongoDB

You're using **MongoDB Atlas** for your database.

**Your Current Connection:**
```
mongodb+srv://suraj:HrUQqbwip8E3KSuE@cluster0.m3vmpsv.mongodb.net/face-netra-ai?retryWrites=true&w=majority&appName=Cluster0
```

**Alternative Options:**

**Option A: MongoDB Atlas (Cloud - Recommended)**
- ✅ Already set up in your `.env` file
- Free tier: 512MB storage
- Automatic backups
- Global distribution
- [MongoDB Atlas Console](https://cloud.mongodb.com)

**Option B: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Then start MongoDB service
mongod --dbpath /data/db
```

**Option C: Docker MongoDB**
```bash
docker run -d \
  --name facenetra-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -p 27017:27017 \
  mongo:latest
```

### 2. Configure Environment Variables

Your `.env` file is already configured with MongoDB Atlas connection:
```env
DATABASE_URL="mongodb+srv://suraj:HrUQqbwip8E3KSuE@cluster0.m3vmpsv.mongodb.net/face-netra-ai?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key-change-this"
```

⚠️ **Important:** Change the JWT secrets to secure random strings in production!

### 3. Generate Prisma Client

Generate Prisma Client for MongoDB:
```bash
npm run db:generate
```

### 4. Push Schema to MongoDB

**For MongoDB, we use `db:push` instead of migrations:**
```bash
npm run db:push
```

This will create all collections in your MongoDB database.

**Note:** MongoDB with Prisma doesn't support migrations like PostgreSQL. Use `prisma db push` to sync your schema.

### 4. Seed Database (Optional)

Seed with test data:
```bash
npm run db:seed
```

## 📊 Database Schema (MongoDB)

### Core Tables
- **users** - User profiles and account data
- **face_vectors** - Encrypted face embeddings
- **user_social_links** - Instagram, Twitter, etc.
- **user_interests** - User interests and categories

### Content Tables
- **posts** - User posts (text, image, video)
- **post_media** - Media attachments for posts
- **user_photos** - Photo gallery
- **photo_albums** - Photo albums

### Social Tables
- **connections** - Friends, followers, blocked users
- **scan_history** - Face scan discovery records
- **likes** - Likes on posts/photos/comments
- **comments** - Comments on posts/photos

### Search & Discovery
- **user_search_index** - Full-text search index
- **trending_users** - Trending users algorithm

### Security
- **login_sessions** - JWT sessions with device info
- **privacy_settings** - User privacy controls

### Messaging
- **conversations** - 1-on-1 conversations
- **messages** - Chat messages
- **notifications** - System notifications

## 🛠️ Useful Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes to MongoDB (no migration files needed)
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database with test data
npm run db:seed

# Format schema file
npx prisma format

# Validate schema file
npx prisma validate
```

## 🔍 Prisma Studio

View and edit your MongoDB database with Prisma Studio:
```bash
npm run db:studio
```

Opens at `http://localhost:5555`

## 📝 MongoDB-Specific Notes

1. **No Migrations**: MongoDB with Prisma uses `db:push` instead of migrations
2. **ObjectId**: All IDs use MongoDB's ObjectId format (`@db.ObjectId`)
3. **Embedded Documents**: MongoDB supports embedded documents (we use relations instead)
4. **Indexes**: Create indexes manually in MongoDB Atlas for better performance
5. **Transactions**: MongoDB supports multi-document transactions (used in our services)

## 📁 Project Structure

```
FrontEnd/facenetra/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── lib/
│   ├── prisma.ts          # Prisma client instance
│   └── services/          # Database services
│       ├── auth.service.ts
│       ├── user.service.ts
│       ├── post.service.ts
│       ├── scan.service.ts
│       └── connection.service.ts
├── .env                   # Environment variables
└── .env.example           # Example env file
```

## 🔐 Security Notes

1. **Never commit `.env`** - Already in `.gitignore`
2. **Secure MongoDB connection** - Your connection string contains credentials, keep it safe!
3. **Use strong JWT secrets** - Generate with: `openssl rand -base64 32`
4. **Encrypt face vectors** - Always encrypt before storing in MongoDB
5. **Hash passwords** - Use bcryptjs with salt rounds 10+
6. **Validate inputs** - Sanitize all user inputs
7. **Use HTTPS** - Always in production
8. **MongoDB Network Access** - Whitelist only your server IPs in Atlas

## 🚀 Next Steps

1. ✅ Database schema configured for MongoDB
2. ✅ Prisma Client generated
3. Push schema: `npm run db:push`
4. Seed test data: `npm run db:seed`
5. Set up face recognition backend (Python/FastAPI)
6. Integrate S3 for media storage
7. Set up Redis for caching
8. Configure email/SMS for fallback auth
9. Deploy to production

## 📖 Resources

- [Prisma MongoDB Docs](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [MongoDB University](https://university.mongodb.com/) - Free courses
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
