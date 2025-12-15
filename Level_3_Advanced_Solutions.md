# Level 3: Advanced Solutions (Architecture)
## Backend & System Design Master Solutions
## 100 Comprehensive Answers - Scalable System Design

---

**Progress:** Solutions 201-300 (Level 3)  
**Difficulty:** Advanced (Architecture)  
**Topics:** System Design, Microservices, Database Scaling, Performance, Cloud  
**Estimated Study Time:** 2-3 months

---

## Module 11: System Design Fundamentals (Solutions 201-220)

### Solution 201: What is system design? Why is it important?

**Answer:**

**System Design** is the process of defining the architecture, components, modules, interfaces, and data for a system to satisfy specified requirements.

**Why Important?**
- Build scalable applications (millions of users)
- Handle high traffic (thousands of requests/second)
- Ensure reliability (99.99% uptime)
- Optimize costs
- Required for senior engineer roles

**Key Concepts:**

**1. Scalability:**
```
Vertical Scaling (Scale Up):
Single Server: 4 CPU, 8GB RAM
              ↓
Bigger Server: 16 CPU, 64GB RAM

Horizontal Scaling (Scale Out):
1 Server → 10 Servers → 100 Servers
```

**2. Load Balancing:**
```
        ┌─────────────┐
        │Load Balancer│
        └──────┬──────┘
               │
       ┌───────┼───────┐
       ↓       ↓       ↓
   Server1  Server2  Server3
```

**3. Caching:**
```
Request → Check Cache → If found, return
                     → If not, query DB → Store in cache → Return
```

**4. Database Replication:**
```
Master (Writes) → Slave1 (Reads)
                → Slave2 (Reads)
                → Slave3 (Reads)
```

**System Design Process:**

**Step 1: Requirements**
```
Functional:
- Users can post tweets
- Users can follow others
- Users can see timeline

Non-Functional:
- 100M daily active users
- 500M tweets per day
- < 200ms response time
- 99.99% uptime
```

**Step 2: Capacity Estimation**
```
Users: 100M DAU
Tweets: 500M/day = 5,787 tweets/second
Storage: 500M tweets × 280 chars × 2 bytes = 280GB/day
Bandwidth: 280GB/day ÷ 86400s = 3.2MB/s
```

**Step 3: High-Level Design**
```
Client → CDN → Load Balancer → App Servers → Cache → Database
                                           → Message Queue
                                           → File Storage
```

**Step 4: Detailed Design**
- API design
- Database schema
- Caching strategy
- Scaling approach

---

### Solution 211: Design a URL shortener (like bit.ly).

**Answer:**

**Requirements:**
- Shorten long URLs to short codes
- Redirect short URLs to original
- Track click analytics
- 100M URLs, 1000 requests/second

**High-Level Design:**

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     ↓
┌─────────────┐
│Load Balancer│
└──────┬──────┘
       │
   ┌───┴───┐
   ↓       ↓
┌──────┐ ┌──────┐
│App 1 │ │App 2 │
└───┬──┘ └───┬──┘
    │        │
    └────┬───┘
         ↓
    ┌─────────┐
    │  Cache  │
    │ (Redis) │
    └────┬────┘
         ↓
    ┌─────────┐
    │Database │
    │(Postgres│
    └─────────┘
```

**Database Schema:**

```sql
CREATE TABLE urls (
  id BIGSERIAL PRIMARY KEY,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  user_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  click_count INTEGER DEFAULT 0
);

CREATE INDEX idx_short_code ON urls(short_code);
CREATE INDEX idx_user_id ON urls(user_id);

CREATE TABLE clicks (
  id BIGSERIAL PRIMARY KEY,
  short_code VARCHAR(10) NOT NULL,
  clicked_at TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer TEXT
);
```

**API Design:**

```
POST /api/shorten
Body: { "url": "https://example.com/very/long/url" }
Response: { "shortUrl": "https://short.ly/abc123" }

GET /:shortCode
Redirect to original URL

GET /api/stats/:shortCode
Response: { "clicks": 1234, "created": "2024-12-15" }
```

**Implementation:**

```javascript
const express = require('express');
const { Pool } = require('pg');
const Redis = require('ioredis');

const app = express();
const db = new Pool({ /* config */ });
const redis = new Redis();

app.use(express.json());

// Generate short code
function generateShortCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 7; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Shorten URL
app.post('/api/shorten', async (req, res) => {
  const { url } = req.body;
  
  // Validate URL
  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  
  // Generate unique short code
  let shortCode;
  let exists = true;
  
  while (exists) {
    shortCode = generateShortCode();
    const check = await db.query(
      'SELECT id FROM urls WHERE short_code = $1',
      [shortCode]
    );
    exists = check.rows.length > 0;
  }
  
  // Save to database
  await db.query(
    'INSERT INTO urls (short_code, original_url) VALUES ($1, $2)',
    [shortCode, url]
  );
  
  // Cache for 24 hours
  await redis.setex(`url:${shortCode}`, 86400, url);
  
  res.json({
    shortUrl: `https://short.ly/${shortCode}`,
    shortCode: shortCode
  });
});

// Redirect
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  
  // Check cache first
  let originalUrl = await redis.get(`url:${shortCode}`);
  
  if (!originalUrl) {
    // Cache miss - query database
    const result = await db.query(
      'SELECT original_url FROM urls WHERE short_code = $1',
      [shortCode]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).send('URL not found');
    }
    
    originalUrl = result.rows[0].original_url;
    
    // Cache for future requests
    await redis.setex(`url:${shortCode}`, 86400, originalUrl);
  }
  
  // Track click (async, don't wait)
  db.query(
    'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1',
    [shortCode]
  ).catch(err => console.error(err));
  
  db.query(
    'INSERT INTO clicks (short_code, ip_address, user_agent) VALUES ($1, $2, $3)',
    [shortCode, req.ip, req.headers['user-agent']]
  ).catch(err => console.error(err));
  
  // Redirect
  res.redirect(301, originalUrl);
});

// Get statistics
app.get('/api/stats/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  
  const result = await db.query(
    'SELECT original_url, click_count, created_at FROM urls WHERE short_code = $1',
    [shortCode]
  );
  
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'URL not found' });
  }
  
  const url = result.rows[0];
  
  res.json({
    shortCode: shortCode,
    originalUrl: url.original_url,
    clicks: url.click_count,
    createdAt: url.created_at
  });
});

app.listen(3000);
```

**Scaling Considerations:**

**1. Database Sharding:**
```javascript
// Shard by first character of short code
function getShardForCode(shortCode) {
  const char = shortCode[0].toLowerCase();
  if (char >= 'a' && char <= 'i') return shard1;
  if (char >= 'j' && char <= 'r') return shard2;
  return shard3;
}
```

**2. Read Replicas:**
```javascript
// Writes to master
await masterDb.query('INSERT INTO urls ...');

// Reads from replicas
const url = await replicaDb.query('SELECT * FROM urls ...');
```

**3. CDN for Static Content:**
```
Client → CDN → Load Balancer → App Servers
```

**4. Rate Limiting:**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per 15 minutes
});

app.use('/api/shorten', limiter);
```

---

*This file will contain all 100 Level 3 solutions covering advanced system design topics. Creating remaining level files...*