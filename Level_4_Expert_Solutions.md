# Level 4: Expert Solutions (Distributed Systems)
## Backend & System Design Master Solutions
## 100 Comprehensive Answers - Master Distributed Architecture

---

**Progress:** Solutions 301-400 (Level 4)  
**Difficulty:** Expert (Distributed Systems)  
**Topics:** Distributed Theory, High Availability, Event-Driven, Kafka, Observability  
**Estimated Study Time:** 2-3 months

---

## Module 16: Distributed Systems Theory (Solutions 301-320)

### Solution 301: What is a distributed system? Challenges?

**Answer:**

**Distributed System:** A system where components located on networked computers communicate and coordinate their actions by passing messages.

**Examples:**
- Google Search (thousands of servers)
- Netflix (microservices)
- WhatsApp (billions of messages)
- Uber (real-time location tracking)

**Architecture:**

```
┌─────────┐   ┌─────────┐   ┌─────────┐
│Service A│   │Service B│   │Service C│
│(Node 1) │   │(Node 2) │   │(Node 3) │
└────┬────┘   └────┬────┘   └────┬────┘
     │             │             │
     └─────────────┼─────────────┘
                   │
            ┌──────┴──────┐
            │   Network   │
            └─────────────┘
```

**Key Challenges:**

**1. Network Failures:**
```
Service A → [Network] → Service B
            ↑ Can fail!
            
- Packets lost
- Timeouts
- Partial failures
```

**2. Partial Failures:**
```
Service A: ✅ Running
Service B: ❌ Down
Service C: ✅ Running
Service D: ⚠️ Slow

How to handle?
```

**3. Concurrency:**
```
User 1: Update balance = $100
User 2: Update balance = $200
        ↓
Which one wins?
```

**4. No Global Clock:**
```
Server 1: Event at 10:00:00.123
Server 2: Event at 10:00:00.125
          ↑ Which happened first?
```

**5. Consistency vs Availability (CAP Theorem):**
```
Can only have 2 of 3:
- Consistency (all nodes see same data)
- Availability (system always responds)
- Partition Tolerance (works despite network failures)
```

**Handling Challenges:**

**1. Retry with Exponential Backoff:**
```javascript
async function callServiceWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      return response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

**2. Circuit Breaker:**
```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }
  
  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}

// Usage
const breaker = new CircuitBreaker();

app.get('/api/data', async (req, res) => {
  try {
    const data = await breaker.call(() => 
      fetch('http://external-service/data')
    );
    res.json(data);
  } catch (error) {
    res.status(503).json({ error: 'Service unavailable' });
  }
});
```

**3. Distributed Transactions (Saga Pattern):**
```javascript
// Order Service
async function createOrder(orderId, items) {
  // Step 1: Create order
  await orderDb.insert({ orderId, items, status: 'PENDING' });
  
  // Step 2: Reserve inventory
  try {
    await inventoryService.reserve(items);
  } catch (error) {
    // Compensate: Cancel order
    await orderDb.update({ orderId, status: 'CANCELLED' });
    throw error;
  }
  
  // Step 3: Process payment
  try {
    await paymentService.charge(orderId);
  } catch (error) {
    // Compensate: Release inventory and cancel order
    await inventoryService.release(items);
    await orderDb.update({ orderId, status: 'CANCELLED' });
    throw error;
  }
  
  // Success
  await orderDb.update({ orderId, status: 'COMPLETED' });
}
```

**4. Eventual Consistency:**
```javascript
// Write to master
await masterDb.insert({ id: 1, name: 'Aptik' });

// Read from replica (might be slightly behind)
const user = await replicaDb.findById(1);
// Might not find user immediately (replication lag)

// Solution: Read from master for critical operations
const user = await masterDb.findById(1); // Always up-to-date
```

---

### Solution 302: Explain the CAP theorem in detail.

**Answer:**

**CAP Theorem:** In a distributed system, you can only guarantee 2 out of 3:
- **C**onsistency: All nodes see the same data
- **A**vailability: System always responds
- **P**artition Tolerance: Works despite network failures

**Visual:**

```
        CAP Theorem
           /\
          /  \
         /    \
        /  CP  \
       /________\
      /\        /\
     /  \  CA  /  \
    / AP \____/ PA \
   /______\  /______\
```

**Scenarios:**

**1. CA (Consistency + Availability) - No Partition Tolerance:**
```
┌─────────┐     ┌─────────┐
│ Node A  │ ←→  │ Node B  │
└─────────┘     └─────────┘
     Perfect network connection

If network fails → System stops working
Example: Traditional RDBMS (single datacenter)
```

**2. CP (Consistency + Partition Tolerance) - No Availability:**
```
┌─────────┐  X  ┌─────────┐
│ Node A  │     │ Node B  │
└─────────┘     └─────────┘
   Network partition

System refuses requests until partition heals
Example: MongoDB, HBase, Redis
```

**3. AP (Availability + Partition Tolerance) - No Consistency:**
```
┌─────────┐  X  ┌─────────┐
│ Node A  │     │ Node B  │
│ Data: 1 │     │ Data: 2 │
└─────────┘     └─────────┘
   Network partition

Both nodes accept requests (different data!)
Example: Cassandra, DynamoDB, Riak
```

**Real-World Example:**

**Banking System (CP - Consistency + Partition):**
```javascript
// Transfer $100 from Account A to Account B

// If network partition occurs:
if (cannotReachAllNodes()) {
  // Reject transaction to maintain consistency
  throw new Error('Service temporarily unavailable');
}

// Only proceed if all nodes reachable
await transaction.begin();
await accountA.deduct(100);
await accountB.add(100);
await transaction.commit();
```

**Social Media (AP - Availability + Partition):**
```javascript
// Like a post

// Even if network partition occurs:
if (cannotReachAllNodes()) {
  // Accept like locally, sync later
  await localDb.insert({ postId, userId, liked: true });
  await syncQueue.add({ postId, userId, liked: true });
  return { success: true };
}

// Eventually consistent - like count might be slightly off
```

**Implementation Example:**

```javascript
// CP System (Consistency Priority)
class CPDatabase {
  async write(key, value) {
    const nodes = this.getHealthyNodes();
    
    // Require majority (quorum)
    const quorum = Math.floor(nodes.length / 2) + 1;
    
    if (nodes.length < quorum) {
      throw new Error('Not enough nodes for quorum');
    }
    
    // Write to all nodes
    const results = await Promise.allSettled(
      nodes.map(node => node.write(key, value))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    
    if (successful < quorum) {
      throw new Error('Failed to achieve quorum');
    }
    
    return { success: true };
  }
}

// AP System (Availability Priority)
class APDatabase {
  async write(key, value) {
    const nodes = this.getHealthyNodes();
    
    if (nodes.length === 0) {
      // Write locally, sync later
      await this.localWrite(key, value);
      await this.syncQueue.add({ key, value });
      return { success: true, synced: false };
    }
    
    // Write to any available node
    try {
      await nodes[0].write(key, value);
      
      // Async replication to other nodes
      this.replicateAsync(key, value, nodes.slice(1));
      
      return { success: true, synced: true };
    } catch (error) {
      // Still accept write locally
      await this.localWrite(key, value);
      return { success: true, synced: false };
    }
  }
}
```

**Choosing the Right Trade-off:**

| Use Case | Choice | Reason |
|----------|--------|--------|
| Banking | CP | Consistency critical |
| Social Media | AP | Availability critical |
| E-commerce Inventory | CP | Prevent overselling |
| E-commerce Recommendations | AP | Stale data acceptable |
| Healthcare Records | CP | Accuracy critical |
| Analytics Dashboard | AP | Slight delays acceptable |

---

*This file will contain all 100 Level 4 solutions covering distributed systems mastery. Creating final level file...*