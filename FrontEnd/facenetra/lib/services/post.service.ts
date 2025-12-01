import { prisma } from '@/lib/prisma'

export interface CreatePostInput {
  userId: string
  content: string
  postType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'LINK'
  visibility: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY'
  media?: {
    url: string
    type: 'IMAGE' | 'VIDEO' | 'GIF'
    width?: number
    height?: number
    fileSize?: number
  }[]
}

export const postService = {
  /**
   * Create a new post
   */
  async createPost(data: CreatePostInput) {
    return await prisma.post.create({
      data: {
        userId: data.userId,
        content: data.content,
        postType: data.postType,
        visibility: data.visibility,
        media: data.media
          ? {
              create: data.media.map((m, index) => ({
                mediaUrl: m.url,
                mediaType: m.type,
                mediaOrder: index,
                width: m.width,
                height: m.height,
                fileSize: m.fileSize,
              })),
            }
          : undefined,
      },
      include: {
        media: true,
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePictureUrl: true,
            isVerified: true,
          },
        },
      },
    })
  },

  /**
   * Get post by ID
   */
  async getPostById(postId: string) {
    return await prisma.post.findUnique({
      where: { id: postId },
      include: {
        media: {
          orderBy: { mediaOrder: 'asc' },
        },
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePictureUrl: true,
            isVerified: true,
          },
        },
      },
    })
  },

  /**
   * Get user's posts (profile page)
   */
  async getUserPosts(userId: string, limit = 20, offset = 0) {
    return await prisma.post.findMany({
      where: { userId },
      include: {
        media: {
          orderBy: { mediaOrder: 'asc' },
        },
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePictureUrl: true,
            isVerified: true,
          },
        },
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      take: limit,
      skip: offset,
    })
  },

  /**
   * Get feed posts (home feed - posts from connections)
   */
  async getFeedPosts(userId: string, limit = 20, offset = 0) {
    // Get user's connections
    const connections = await prisma.connection.findMany({
      where: {
        userId,
        status: 'ACCEPTED',
      },
      select: {
        connectedUserId: true,
      },
    })

    const connectionIds = connections.map((c) => c.connectedUserId)

    // Get posts from connections + own posts
    return await prisma.post.findMany({
      where: {
        OR: [
          { userId: { in: connectionIds } },
          { userId },
        ],
        visibility: {
          in: ['PUBLIC', 'FRIENDS_ONLY'],
        },
      },
      include: {
        media: {
          orderBy: { mediaOrder: 'asc' },
        },
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePictureUrl: true,
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })
  },

  /**
   * Get public feed posts (all public posts from all users)
   */
  async getPublicFeedPosts(userId: string, limit = 20, offset = 0) {
    // Get all public posts from all users
    const posts = await prisma.post.findMany({
      where: {
        visibility: 'PUBLIC',
      },
      include: {
        media: {
          orderBy: { mediaOrder: 'asc' },
        },
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePictureUrl: true,
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    // Check which posts the current user has liked
    const postIds = posts.map(p => p.id)
    const userLikes = await prisma.like.findMany({
      where: {
        userId,
        targetType: 'POST',
        targetId: { in: postIds },
      },
      select: {
        targetId: true,
      },
    })

    const likedPostIds = new Set(userLikes.map(like => like.targetId))

    // Add isLiked flag to each post
    return posts.map(post => ({
      ...post,
      isLiked: likedPostIds.has(post.id),
    }))
  },

  /**
   * Update post
   */
  async updatePost(postId: string, userId: string, data: { content?: string; visibility?: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY' }) {
    // Verify ownership
    const post = await prisma.post.findFirst({
      where: { id: postId, userId },
    })

    if (!post) {
      throw new Error('Post not found or unauthorized')
    }

    return await prisma.post.update({
      where: { id: postId },
      data,
      include: {
        media: true,
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePictureUrl: true,
            isVerified: true,
          },
        },
      },
    })
  },

  /**
   * Delete post
   */
  async deletePost(postId: string, userId: string) {
    // Verify ownership
    const post = await prisma.post.findFirst({
      where: { id: postId, userId },
    })

    if (!post) {
      throw new Error('Post not found or unauthorized')
    }

    return await prisma.post.delete({
      where: { id: postId },
    })
  },

  /**
   * Toggle post pin
   */
  async togglePinPost(postId: string, userId: string) {
    const post = await prisma.post.findFirst({
      where: { id: postId, userId },
    })

    if (!post) {
      throw new Error('Post not found or unauthorized')
    }

    return await prisma.post.update({
      where: { id: postId },
      data: { isPinned: !post.isPinned },
    })
  },

  /**
   * Like a post
   */
  async likePost(postId: string, userId: string) {
    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: 'POST',
          targetId: postId,
        },
      },
    })

    if (existingLike) {
      // Unlike
      await prisma.$transaction([
        prisma.like.delete({
          where: {
            userId_targetType_targetId: {
              userId,
              targetType: 'POST',
              targetId: postId,
            },
          },
        }),
        prisma.post.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        }),
      ])

      return { liked: false }
    } else {
      // Like
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            targetType: 'POST',
            targetId: postId,
          },
        }),
        prisma.post.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        }),
      ])

      return { liked: true }
    }
  },

  /**
   * Add comment to post
   */
  async addComment(postId: string, userId: string, content: string, parentCommentId?: string) {
    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          userId,
          targetType: 'POST',
          targetId: postId,
          content,
          parentCommentId,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              profilePictureUrl: true,
            },
          },
        },
      })

      await tx.post.update({
        where: { id: postId },
        data: { commentsCount: { increment: 1 } },
      })

      return newComment
    })

    return comment
  },

  /**
   * Get post comments
   */
  async getPostComments(postId: string, limit = 20, offset = 0) {
    return await prisma.comment.findMany({
      where: {
        targetType: 'POST',
        targetId: postId,
        parentCommentId: null, // Top-level comments only
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePictureUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })
  },
}
