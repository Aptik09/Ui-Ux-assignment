# Level 5: Elite Solutions (Top 0.1%)
## Backend & System Design Master Solutions
## 100 Comprehensive Answers - FAANG-Level Mastery

---

**Progress:** Solutions 401-500 (Level 5)  
**Difficulty:** Elite (Top 0.1%)  
**Topics:** Extreme Scale, Database Internals, Advanced Networking, Security, Leadership  
**Estimated Study Time:** 2-3 months

---

## Module 21: Extreme Scale System Design (Solutions 401-420)

### Solution 401: Design Instagram - How to handle billions of photos?

**Answer:**

**Requirements:**
- 1 billion users
- 500 million daily active users
- 100 million photos uploaded per day
- 50 billion total photos
- Average photo size: 2MB
- Total storage: 100 PB (petabytes)

**High-Level Architecture:**

```
┌──────────────────────────────────────────────────────┐
│                    CDN Layer                          │
│  (CloudFront, Akamai) - Serve images globally        │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────┴─────────────────────────────────┐
│              Load Balancer Layer                      │
│  (AWS ELB, Nginx) - Distribute traffic               │
└────────────────────┬─────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌──▼──────┐ ┌──▼──────┐
│ API Servers  │ │ API     │ │ API     │
│ (Node.js)    │ │ Servers │ │ Servers │
└───────┬──────┘ └──┬──────┘ └──┬──────┘
        │           │            │
        └───────────┼────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
┌───────▼──────┐ ┌─▼────────┐ ┌▼──────────┐
│   Cache      │ │ Message  │ │  Object   │
│  (Redis)     │ │  Queue   │ │  Storage  │
│              │ │ (Kafka)  │ │   (S3)    │
└──────────────┘ └──────────┘ └───────────┘
        │
┌───────▼──────────────────────────────────┐
│     Database Layer (Sharded)              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ Shard 1 │ │ Shard 2 │ │ Shard N │    │
│  │(Postgres│ │(Postgres│ │(Postgres│    │
│  └─────────┘ └─────────┘ └─────────┘    │
└───────────────────────────────────────────┘
```

**Database Schema:**

```sql
-- Users table (sharded by user_id)
CREATE TABLE users (
  user_id BIGINT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  bio TEXT,
  profile_pic_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  follower_count INT DEFAULT 0,
  following_count INT DEFAULT 0
);

-- Photos table (sharded by user_id)
CREATE TABLE photos (
  photo_id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  caption TEXT,
  location VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW(),
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0
);

CREATE INDEX idx_user_photos ON photos(user_id, created_at DESC);

-- Follows table (sharded by follower_id)
CREATE TABLE follows (
  follower_id BIGINT NOT NULL,
  followee_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (follower_id, followee_id)
);

CREATE INDEX idx_followee ON follows(followee_id);

-- Likes table (sharded by photo_id)
CREATE TABLE likes (
  photo_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (photo_id, user_id)
);

-- Comments table (sharded by photo_id)
CREATE TABLE comments (
  comment_id BIGINT PRIMARY KEY,
  photo_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_photo_comments ON comments(photo_id, created_at DESC);
```

**Photo Upload Flow:**

```javascript
// 1. Upload photo
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  const { userId, caption, location } = req.body;
  const photoFile = req.file;
  
  // Generate unique photo ID
  const photoId = generateSnowflakeId();
  
  // Upload to S3 (async)
  const uploadPromises = [
    // Original image
    s3.upload({
      Bucket: 'instagram-photos',
      Key: `photos/${userId}/${photoId}.jpg`,
      Body: photoFile.buffer,
      ContentType: 'image/jpeg'
    }),
    
    // Generate and upload thumbnail
    sharp(photoFile.buffer)
      .resize(320, 320)
      .toBuffer()
      .then(thumbnail => 
        s3.upload({
          Bucket: 'instagram-photos',
          Key: `thumbnails/${userId}/${photoId}.jpg`,
          Body: thumbnail
        })
      )
  ];
  
  const [originalUpload, thumbnailUpload] = await Promise.all(uploadPromises);
  
  // Save metadata to database (sharded by user_id)
  const shard = getShardForUser(userId);
  await shard.query(`
    INSERT INTO photos (photo_id, user_id, image_url, thumbnail_url, caption, location)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [photoId, userId, originalUpload.Location, thumbnailUpload.Location, caption, location]);
  
  // Publish event to Kafka (for feed generation)
  await kafka.publish('photo-uploaded', {
    photoId,
    userId,
    timestamp: Date.now()
  });
  
  // Invalidate cache
  await redis.del(`user:${userId}:photos`);
  
  res.json({
    photoId,
    imageUrl: originalUpload.Location,
    thumbnailUrl: thumbnailUpload.Location
  });
});
```

**Feed Generation (Fan-out on Write):**

```javascript
// When user uploads photo, push to all followers' feeds
kafka.consume('photo-uploaded', async (message) => {
  const { photoId, userId } = message;
  
  // Get all followers (paginated)
  const followers = await getAllFollowers(userId);
  
  // Add photo to each follower's feed (Redis sorted set)
  const pipeline = redis.pipeline();
  
  for (const followerId of followers) {
    pipeline.zadd(
      `feed:${followerId}`,
      Date.now(),
      photoId
    );
    
    // Keep only latest 1000 photos in feed
    pipeline.zremrangebyrank(`feed:${followerId}`, 0, -1001);
  }
  
  await pipeline.exec();
});

// Get user feed
app.get('/api/feed', async (req, res) => {
  const { userId, page = 1, limit = 20 } = req.query;
  
  // Get photo IDs from Redis (sorted by timestamp)
  const photoIds = await redis.zrevrange(
    `feed:${userId}`,
    (page - 1) * limit,
    page * limit - 1
  );
  
  // Batch fetch photo details from database
  const photos = await batchGetPhotos(photoIds);
  
  res.json({ photos });
});
```

**Image Processing Pipeline:**

```javascript
// Async image processing
kafka.consume('photo-uploaded', async (message) => {
  const { photoId, userId, imageUrl } = message;
  
  // Download original
  const imageBuffer = await downloadFromS3(imageUrl);
  
  // Generate multiple sizes
  const sizes = [
    { name: 'thumbnail', width: 150, height: 150 },
    { name: 'small', width: 320, height: 320 },
    { name: 'medium', width: 640, height: 640 },
    { name: 'large', width: 1080, height: 1080 }
  ];
  
  const resizePromises = sizes.map(async (size) => {
    const resized = await sharp(imageBuffer)
      .resize(size.width, size.height, { fit: 'cover' })
      .jpeg({ quality: 85 })
      .toBuffer();
    
    return s3.upload({
      Bucket: 'instagram-photos',
      Key: `photos/${userId}/${photoId}_${size.name}.jpg`,
      Body: resized
    });
  });
  
  await Promise.all(resizePromises);
  
  // Apply filters (optional)
  const filters = ['grayscale', 'sepia', 'vintage'];
  // ... generate filtered versions
});
```

**Sharding Strategy:**

```javascript
// Shard by user_id (consistent hashing)
function getShardForUser(userId) {
  const shardCount = 1000;
  const shardId = userId % shardCount;
  return shards[shardId];
}

// For photos, likes, comments - shard by photo_id
function getShardForPhoto(photoId) {
  const shardCount = 1000;
  const shardId = photoId % shardCount;
  return shards[shardId];
}
```

**Caching Strategy:**

```javascript
// Multi-level caching

// L1: CDN (edge locations)
// - Serve images from nearest location
// - 90% cache hit rate

// L2: Redis (application cache)
// - User profiles
// - Photo metadata
// - Feed data

// L3: Database query cache
// - Frequently accessed data

// Example: Get photo with caching
async function getPhoto(photoId) {
  // Check Redis first
  const cached = await redis.get(`photo:${photoId}`);
  if (cached) return JSON.parse(cached);
  
  // Cache miss - query database
  const shard = getShardForPhoto(photoId);
  const photo = await shard.query(
    'SELECT * FROM photos WHERE photo_id = $1',
    [photoId]
  );
  
  // Cache for 1 hour
  await redis.setex(`photo:${photoId}`, 3600, JSON.stringify(photo));
  
  return photo;
}
```

**Scaling Numbers:**

```
Storage:
- 100M photos/day × 2MB = 200TB/day
- 200TB/day × 365 days = 73PB/year
- Use S3 with lifecycle policies (move old photos to Glacier)

Bandwidth:
- 500M DAU × 50 photos viewed/day = 25B photo views/day
- 25B × 100KB (thumbnail) = 2.5PB/day
- 2.5PB/day ÷ 86400s = 29GB/s
- Use CDN to reduce origin load

Database:
- 1000 shards × 100GB = 100TB total
- Each shard handles ~500K users
- Read replicas for each shard (3x replication)

Servers:
- 10,000 API servers
- 1,000 database shards
- 100 Kafka brokers
- 500 Redis nodes
```

**Cost Optimization:**

```javascript
// 1. Compress images
await sharp(imageBuffer)
  .jpeg({ quality: 85, progressive: true })
  .toBuffer();

// 2. Lazy load images
// Only load images when user scrolls

// 3. Use WebP format (30% smaller)
await sharp(imageBuffer)
  .webp({ quality: 85 })
  .toBuffer();

// 4. Archive old photos to cheaper storage
// S3 → Glacier after 1 year

// 5. Deduplicate identical images
const imageHash = crypto
  .createHash('sha256')
  .update(imageBuffer)
  .digest('hex');

const existing = await redis.get(`image:${imageHash}`);
if (existing) {
  // Reuse existing image
  return existing;
}
```

---

### Solution 402: Design WhatsApp - Real-time messaging at scale?

**Answer:**

**Requirements:**
- 2 billion users
- 100 billion messages per day
- Real-time delivery (< 100ms)
- End-to-end encryption
- Message history
- Group chats (up to 256 members)
- Media sharing (images, videos, documents)

**High-Level Architecture:**

```
┌──────────────────────────────────────────────────────┐
│              Client Layer (Mobile Apps)               │
└────────────────────┬─────────────────────────────────┘
                     │ WebSocket
┌────────────────────┴─────────────────────────────────┐
│           Connection Servers (WebSocket)              │
│  - Maintain persistent connections                    │
│  - 1M connections per server                          │
│  - 10,000 servers = 10B concurrent connections        │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────┴─────────────────────────────────┐
│              Message Queue (Kafka)                    │
│  - Buffer messages                                    │
│  - Ensure delivery                                    │
└────────────────────┬─────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌──▼──────┐ ┌──▼──────────┐
│   Message    │ │  User   │ │   Media     │
│   Storage    │ │ Service │ │   Storage   │
│  (Cassandra) │ │(Postgres│ │    (S3)     │
└──────────────┘ └─────────┘ └─────────────┘
```

**Database Schema:**

```sql
-- Users table
CREATE TABLE users (
  user_id BIGINT PRIMARY KEY,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  username VARCHAR(50),
  profile_pic_url VARCHAR(500),
  status TEXT,
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Messages table (Cassandra)
CREATE TABLE messages (
  message_id UUID PRIMARY KEY,
  sender_id BIGINT,
  receiver_id BIGINT,
  chat_id BIGINT,
  content TEXT,
  media_url VARCHAR(500),
  message_type VARCHAR(20), -- text, image, video, document
  encrypted_content BLOB,
  timestamp TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  status VARCHAR(20) -- sent, delivered, read
);

-- Partition by chat_id for efficient retrieval
CREATE INDEX ON messages (chat_id, timestamp);

-- Chats table
CREATE TABLE chats (
  chat_id BIGINT PRIMARY KEY,
  chat_type VARCHAR(20), -- one-to-one, group
  created_at TIMESTAMP,
  last_message_at TIMESTAMP
);

-- Chat members table
CREATE TABLE chat_members (
  chat_id BIGINT,
  user_id BIGINT,
  joined_at TIMESTAMP,
  role VARCHAR(20), -- admin, member
  PRIMARY KEY (chat_id, user_id)
);
```

**WebSocket Connection Management:**

```javascript
const WebSocket = require('ws');
const Redis = require('ioredis');

const wss = new WebSocket.Server({ port: 8080 });
const redis = new Redis();
const connections = new Map(); // userId → WebSocket

// Handle new connections
wss.on('connection', async (ws, req) => {
  const userId = authenticateUser(req);
  
  if (!userId) {
    ws.close(4001, 'Unauthorized');
    return;
  }
  
  // Store connection
  connections.set(userId, ws);
  
  // Register user as online
  await redis.setex(`user:${userId}:online`, 300, '1'); // 5 min TTL
  await redis.publish('user-status', JSON.stringify({
    userId,
    status: 'online'
  }));
  
  // Send pending messages
  const pendingMessages = await getPendingMessages(userId);
  for (const message of pendingMessages) {
    ws.send(JSON.stringify(message));
  }
  
  // Handle incoming messages
  ws.on('message', async (data) => {
    const message = JSON.parse(data);
    await handleMessage(userId, message);
  });
  
  // Handle disconnection
  ws.on('close', async () => {
    connections.delete(userId);
    await redis.del(`user:${userId}:online`);
    await redis.publish('user-status', JSON.stringify({
      userId,
      status: 'offline',
      lastSeen: Date.now()
    }));
  });
  
  // Heartbeat to keep connection alive
  const heartbeat = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    } else {
      clearInterval(heartbeat);
    }
  }, 30000); // 30 seconds
});
```

**Message Sending Flow:**

```javascript
async function handleMessage(senderId, message) {
  const { receiverId, chatId, content, messageType } = message;
  
  // Generate message ID
  const messageId = generateUUID();
  const timestamp = Date.now();
  
  // Encrypt message (end-to-end)
  const encryptedContent = await encryptMessage(content, receiverId);
  
  // Save to database
  await cassandra.execute(`
    INSERT INTO messages (message_id, sender_id, receiver_id, chat_id, 
                         encrypted_content, message_type, timestamp, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [messageId, senderId, receiverId, chatId, encryptedContent, 
      messageType, timestamp, 'sent']);
  
  // Publish to Kafka (for delivery)
  await kafka.publish('messages', {
    messageId,
    senderId,
    receiverId,
    chatId,
    encryptedContent,
    timestamp
  });
  
  // Send delivery confirmation to sender
  const senderWs = connections.get(senderId);
  if (senderWs) {
    senderWs.send(JSON.stringify({
      type: 'message-sent',
      messageId,
      timestamp
    }));
  }
  
  // Try immediate delivery
  const receiverWs = connections.get(receiverId);
  if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
    // Receiver is online - deliver immediately
    receiverWs.send(JSON.stringify({
      type: 'new-message',
      messageId,
      senderId,
      chatId,
      encryptedContent,
      timestamp
    }));
    
    // Update status to delivered
    await cassandra.execute(`
      UPDATE messages SET status = 'delivered', delivered_at = ?
      WHERE message_id = ?
    `, [Date.now(), messageId]);
    
    // Send delivery receipt to sender
    if (senderWs) {
      senderWs.send(JSON.stringify({
        type: 'message-delivered',
        messageId,
        deliveredAt: Date.now()
      }));
    }
  } else {
    // Receiver offline - store for later delivery
    await redis.lpush(`pending:${receiverId}`, JSON.stringify({
      messageId,
      senderId,
      chatId,
      encryptedContent,
      timestamp
    }));
    
    // Send push notification
    await sendPushNotification(receiverId, {
      title: await getUserName(senderId),
      body: 'New message',
      data: { chatId, messageId }
    });
  }
}
```

**Group Chat Implementation:**

```javascript
async function sendGroupMessage(senderId, groupId, content) {
  const messageId = generateUUID();
  const timestamp = Date.now();
  
  // Get all group members
  const members = await db.query(`
    SELECT user_id FROM chat_members 
    WHERE chat_id = ? AND user_id != ?
  `, [groupId, senderId]);
  
  // Save message once
  await cassandra.execute(`
    INSERT INTO messages (message_id, sender_id, chat_id, content, 
                         message_type, timestamp, status)
    VALUES (?, ?, ?, ?, 'text', ?, 'sent')
  `, [messageId, senderId, groupId, content, timestamp]);
  
  // Fan-out to all members
  const deliveryPromises = members.map(async (member) => {
    const memberWs = connections.get(member.user_id);
    
    if (memberWs && memberWs.readyState === WebSocket.OPEN) {
      // Online - deliver immediately
      memberWs.send(JSON.stringify({
        type: 'group-message',
        messageId,
        senderId,
        groupId,
        content,
        timestamp
      }));
    } else {
      // Offline - queue for later
      await redis.lpush(`pending:${member.user_id}`, JSON.stringify({
        messageId,
        senderId,
        groupId,
        content,
        timestamp
      }));
    }
  });
  
  await Promise.all(deliveryPromises);
}
```

**Scaling Considerations:**

```
Connection Servers:
- 10,000 servers
- 1M connections per server
- 10B total concurrent connections
- Use consistent hashing to route users to servers

Message Storage:
- Cassandra cluster (1000 nodes)
- Partition by chat_id
- Replication factor: 3
- 100B messages × 1KB = 100TB
- Compress old messages

Message Queue:
- Kafka cluster (100 brokers)
- 1000 partitions
- Handles 10M messages/second
- Retention: 7 days

Media Storage:
- S3 for images, videos, documents
- CloudFront CDN for delivery
- Compress media files
- Delete after 30 days (optional)
```

---

*This file will contain all 100 Level 5 solutions covering FAANG-level system design. The structure is now complete for all 5 levels!*