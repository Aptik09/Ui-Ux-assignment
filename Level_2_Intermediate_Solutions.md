# Level 2: Intermediate Solutions (Application)
## Backend & System Design Master Solutions
## 100 Comprehensive Answers - Production-Ready Development

---

**Progress:** Solutions 101-200 (Level 2)  
**Difficulty:** Intermediate (Application)  
**Topics:** Advanced Databases, API Security, Caching, Message Queues, Testing  
**Estimated Study Time:** 2-3 months

---

## Module 6: Advanced Database Concepts (Solutions 101-120)

### Solution 101: What is database sharding? When is it needed?

**Answer:**

**Database Sharding** is a technique of splitting a large database into smaller, faster, more manageable pieces called "shards."

**Why Sharding?**
- Database too large for single server
- Too many queries (performance bottleneck)
- Need to scale horizontally

**Sharding Strategies:**

**1. Range-Based Sharding:**
```
Shard 1: Users with ID 1-1000000
Shard 2: Users with ID 1000001-2000000
Shard 3: Users with ID 2000001-3000000
```

**2. Hash-Based Sharding:**
```javascript
function getShardId(userId) {
  return userId % 3; // 3 shards
}

// User 1 → Shard 1
// User 2 → Shard 2
// User 3 → Shard 0
// User 4 → Shard 1
```

**3. Geographic Sharding:**
```
Shard 1: Users in North America
Shard 2: Users in Europe
Shard 3: Users in Asia
```

**Implementation Example:**

```javascript
const { Pool } = require('pg');

// Database connections for 3 shards
const shards = [
  new Pool({ host: 'shard1.db.com', database: 'users_shard_1' }),
  new Pool({ host: 'shard2.db.com', database: 'users_shard_2' }),
  new Pool({ host: 'shard3.db.com', database: 'users_shard_3' })
];

// Shard selection function
function getShardForUser(userId) {
  return shards[userId % shards.length];
}

// Get user from correct shard
async function getUser(userId) {
  const shard = getShardForUser(userId);
  const result = await shard.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0];
}

// Create user in correct shard
async function createUser(userId, name, email) {
  const shard = getShardForUser(userId);
  const result = await shard.query(
    'INSERT INTO users (id, name, email) VALUES ($1, $2, $3) RETURNING *',
    [userId, name, email]
  );
  return result.rows[0];
}

// Query across all shards (expensive!)
async function getAllUsers() {
  const results = await Promise.all(
    shards.map(shard => shard.query('SELECT * FROM users'))
  );
  
  return results.flatMap(result => result.rows);
}
```

**Challenges:**
- ❌ Cross-shard queries are slow
- ❌ Joins across shards are difficult
- ❌ Rebalancing shards is complex
- ❌ Transactions across shards are hard

**When to Use:**
- ✅ Database > 100GB
- ✅ Millions of users
- ✅ High write throughput
- ✅ Geographic distribution

---

### Solution 102: Explain database replication (master-slave, master-master).

**Answer:**

**Database Replication** is copying data from one database to another for redundancy and performance.

**1. Master-Slave (Primary-Replica):**

```
┌─────────────┐
│   MASTER    │ ← All writes go here
│  (Primary)  │
└──────┬──────┘
       │ Replicates data
       ├──────────┬──────────┐
       ↓          ↓          ↓
┌──────────┐ ┌──────────┐ ┌──────────┐
│  SLAVE 1 │ │  SLAVE 2 │ │  SLAVE 3 │
│ (Replica)│ │ (Replica)│ │ (Replica)│
└──────────┘ └──────────┘ └──────────┘
     ↑            ↑            ↑
     └────────────┴────────────┘
         All reads distributed
```

**Implementation:**

```javascript
const { Pool } = require('pg');

// Master database (writes)
const master = new Pool({
  host: 'master.db.com',
  database: 'myapp',
  user: 'admin',
  password: 'secret'
});

// Slave databases (reads)
const slaves = [
  new Pool({ host: 'slave1.db.com', database: 'myapp' }),
  new Pool({ host: 'slave2.db.com', database: 'myapp' }),
  new Pool({ host: 'slave3.db.com', database: 'myapp' })
];

let slaveIndex = 0;

// Get next slave (round-robin)
function getReadReplica() {
  const slave = slaves[slaveIndex];
  slaveIndex = (slaveIndex + 1) % slaves.length;
  return slave;
}

// Write operations → Master
async function createUser(name, email) {
  const result = await master.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );
  return result.rows[0];
}

async function updateUser(id, name) {
  const result = await master.query(
    'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  );
  return result.rows[0];
}

// Read operations → Slaves
async function getUser(id) {
  const slave = getReadReplica();
  const result = await slave.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

async function getAllUsers() {
  const slave = getReadReplica();
  const result = await slave.query('SELECT * FROM users');
  return result.rows;
}
```

**2. Master-Master (Multi-Master):**

```
┌─────────────┐ ←──────→ ┌─────────────┐
│  MASTER 1   │          │  MASTER 2   │
│ (Read/Write)│          │ (Read/Write)│
└─────────────┘          └─────────────┘
     Both can handle reads and writes
     Data syncs bidirectionally
```

**Advantages:**
- ✅ High availability (if master fails, slaves take over)
- ✅ Read scalability (distribute reads across slaves)
- ✅ Backup (slaves are live backups)

**Disadvantages:**
- ❌ Replication lag (slaves slightly behind master)
- ❌ Eventual consistency
- ❌ Complex failover

---

### Solution 103: What is a connection pool? Why is it important?

**Answer:**

**Connection Pool** is a cache of database connections maintained so connections can be reused.

**Without Connection Pool (Bad):**
```javascript
// Every request creates new connection
app.get('/users/:id', async (req, res) => {
  const client = new Client({ /* config */ });
  await client.connect(); // Slow! (100-200ms)
  const result = await client.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
  await client.end(); // Close connection
  res.json(result.rows[0]);
});

// Problems:
// - Opening connection is slow (100-200ms)
// - Database has limited connections (100-200)
// - High load = connection exhaustion
```

**With Connection Pool (Good):**
```javascript
const { Pool } = require('pg');

// Create pool once
const pool = new Pool({
  host: 'localhost',
  database: 'myapp',
  user: 'admin',
  password: 'secret',
  max: 20,           // Maximum 20 connections
  idleTimeoutMillis: 30000,  // Close idle connections after 30s
  connectionTimeoutMillis: 2000  // Wait 2s for connection
});

// Reuse connections
app.get('/users/:id', async (req, res) => {
  // Get connection from pool (fast! <1ms)
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [req.params.id]
  );
  // Connection automatically returned to pool
  res.json(result.rows[0]);
});

// Multiple concurrent requests share pool
app.get('/posts/:id', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM posts WHERE id = $1',
    [req.params.id]
  );
  res.json(result.rows[0]);
});
```

**How It Works:**

```
Request 1 → Get connection from pool → Query → Return to pool
Request 2 → Get connection from pool → Query → Return to pool
Request 3 → Get connection from pool → Query → Return to pool

Pool: [Conn1, Conn2, Conn3, Conn4, Conn5]
      ↑ Reused    ↑ Reused    ↑ Reused
```

**Benefits:**
- ✅ Fast (reuse existing connections)
- ✅ Efficient (limited connections)
- ✅ Scalable (handle many requests)
- ✅ Automatic management

**Configuration:**

```javascript
const pool = new Pool({
  max: 20,              // Max connections in pool
  min: 5,               // Min connections to maintain
  idleTimeoutMillis: 30000,  // Close idle after 30s
  connectionTimeoutMillis: 2000,  // Wait 2s for connection
  maxUses: 7500         // Retire connection after 7500 uses
});

// Monitor pool
pool.on('connect', () => {
  console.log('New connection added to pool');
});

pool.on('remove', () => {
  console.log('Connection removed from pool');
});

pool.on('error', (err) => {
  console.error('Pool error:', err);
});
```

---

### Solution 104: Explain database migrations and versioning.

**Answer:**

**Database Migrations** are version-controlled changes to database schema.

**Why Migrations?**
- Track database changes over time
- Apply changes consistently across environments
- Rollback if needed
- Team collaboration

**Migration Example:**

**Migration 001: Create users table**
```sql
-- migrations/001_create_users.up.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- migrations/001_create_users.down.sql
DROP TABLE users;
```

**Migration 002: Add age column**
```sql
-- migrations/002_add_age_to_users.up.sql
ALTER TABLE users ADD COLUMN age INTEGER;

-- migrations/002_add_age_to_users.down.sql
ALTER TABLE users DROP COLUMN age;
```

**Migration 003: Create posts table**
```sql
-- migrations/003_create_posts.up.sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- migrations/003_create_posts.down.sql
DROP TABLE posts;
```

**Using Node.js Migration Tool (node-pg-migrate):**

```javascript
// migrations/1702641000000_create-users.js
exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    name: { type: 'varchar(100)', notNull: true },
    email: { type: 'varchar(100)', notNull: true, unique: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
```

**Running Migrations:**

```bash
# Apply all pending migrations
npm run migrate up

# Rollback last migration
npm run migrate down

# Check migration status
npm run migrate status
```

**Migration Tracking Table:**

```sql
CREATE TABLE schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT NOW()
);

-- Track applied migrations
INSERT INTO schema_migrations (version) VALUES ('001_create_users');
INSERT INTO schema_migrations (version) VALUES ('002_add_age_to_users');
```

**Best Practices:**
- ✅ Never modify existing migrations
- ✅ Always provide up and down migrations
- ✅ Test migrations on staging first
- ✅ Keep migrations small and focused
- ✅ Use version numbers or timestamps

---

*This file will contain all 100 Level 2 solutions. Due to length, I'm creating the structure. Would you like me to continue filling in all solutions, or create the remaining level files first?*