# Q4: Real-Time Food Ordering & Delivery System

## Scenario
University cafeteria system handling **5,000+ concurrent orders** during peak hours.

## a) Node.js Event-Driven Architecture

### How it Handles Blocking and Non-Blocking Requests

```
┌───────────────────────────────────────────────┐
│           Event Loop (Single Thread)          │
└───────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
   ┌────▼────┐   ┌────▼────┐   ┌───▼────┐
   │ Request │   │ Request │   │Request │
   │    1    │   │    2    │   │   3    │
   └────┬────┘   └────┬────┘   └───┬────┘
        │             │             │
   ┌────▼─────────────▼─────────────▼────┐
   │      Thread Pool (Worker Threads)    │
   │  ┌──────┐  ┌──────┐  ┌──────┐       │
   │  │ I/O  │  │ I/O  │  │ I/O  │       │
   │  │Task 1│  │Task 2│  │Task 3│       │
   │  └──┬───┘  └──┬───┘  └──┬───┘       │
   └─────┼─────────┼─────────┼───────────┘
         │         │         │
    ┌────▼─────────▼─────────▼────┐
    │    Callback Queue            │
    └──────────────────────────────┘
```

### Key Points:
1. **Non-Blocking I/O:** Database writes don't block the event loop
2. **Asynchronous Operations:** Multiple orders processed simultaneously
3. **Event Loop:** Continuously checks for completed operations
4. **Callbacks/Promises:** Handle responses when operations complete

### Example Code:
```javascript
const express = require('express');
const app = express();

// Non-blocking order processing
app.post('/order', async (req, res) => {
    try {
        // This doesn't block other requests
        const order = await db.orders.create(req.body);
        res.json({ success: true, orderId: order.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Server can handle 5000+ concurrent connections
app.listen(3000);
```

## b) Event Loop with Multiple Concurrent Database Writes

### What Happens Inside the Event Loop:

```
Time: 0ms
┌─────────────────────────────────────────┐
│  5000 Order Requests Arrive             │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Event Loop Receives All Requests       │
│  (Non-blocking - accepts immediately)   │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Delegates to Thread Pool               │
│  - Parse request bodies                 │
│  - Validate order data                  │
│  - Initiate DB connections              │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Database Connection Pool               │
│  (e.g., 100 concurrent connections)     │
│  - Queues remaining requests            │
│  - Processes in batches                 │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  As DB Operations Complete:             │
│  1. Callback added to queue             │
│  2. Event loop picks up callback        │
│  3. Sends response to client            │
│  4. Frees connection for next request   │
└─────────────────────────────────────────┘
```

### Architectural Diagram:

```
┌──────────────────────────────────────────────────────┐
│                   Load Balancer                      │
│              (Nginx/HAProxy)                         │
└────────────┬─────────────┬──────────────┬───────────┘
             │             │              │
    ┌────────▼──────┐ ┌────▼────────┐ ┌──▼──────────┐
    │  Node.js      │ │  Node.js    │ │  Node.js    │
    │  Instance 1   │ │  Instance 2 │ │  Instance 3 │
    │  (Event Loop) │ │ (Event Loop)│ │ (Event Loop)│
    └────────┬──────┘ └────┬────────┘ └──┬──────────┘
             │             │              │
             └─────────────┼──────────────┘
                           │
                  ┌────────▼────────┐
                  │  Message Queue  │
                  │  (Redis/RabbitMQ)│
                  └────────┬────────┘
                           │
                  ┌────────▼────────┐
                  │   MongoDB       │
                  │ (Replica Set)   │
                  │ - Primary       │
                  │ - Secondary 1   │
                  │ - Secondary 2   │
                  └─────────────────┘
```

### Process Flow:

1. **Request Arrival (0-10ms)**
   - 5000 requests hit load balancer
   - Distributed across Node.js instances
   - Each instance accepts ~1666 requests

2. **Event Loop Processing (10-50ms)**
   - Validates order data (synchronous)
   - Initiates DB write (asynchronous)
   - Immediately ready for next request

3. **Database Queue (50-500ms)**
   - Connection pool (100 connections)
   - Processes 100 writes simultaneously
   - Remaining 4900 queued

4. **Callback Execution (500-2000ms)**
   - DB confirms write completion
   - Callback added to event loop queue
   - Response sent to client
   - Connection returned to pool

### Handling Simultaneous Writes:

```javascript
// Connection pooling prevents crashes
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cafeteria', {
    maxPoolSize: 100,  // Max concurrent connections
    minPoolSize: 10,   // Keep minimum ready
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000
});

// Queue management with Bull
const Queue = require('bull');
const orderQueue = new Queue('orders', 'redis://localhost:6379');

// Process orders from queue
orderQueue.process(100, async (job) => {
    const order = job.data;
    await Order.create(order);
    return { orderId: order.id };
});

// Add orders to queue (non-blocking)
app.post('/order', async (req, res) => {
    const job = await orderQueue.add(req.body);
    res.json({ jobId: job.id, status: 'queued' });
});
```

### Key Mechanisms:

1. **Connection Pooling:** Reuses DB connections
2. **Message Queue:** Buffers excess requests
3. **Horizontal Scaling:** Multiple Node.js instances
4. **Async/Await:** Non-blocking code execution
5. **Database Indexing:** Faster write operations
