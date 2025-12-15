# Level 1: Beginner Solutions (Foundation)
## Backend & System Design Master Solutions
## 100 Comprehensive Answers - Backend Basics

---

**Progress:** Solutions 1-100 (Level 1 Complete)  
**Difficulty:** Beginner (Foundation)  
**Topics:** Backend Fundamentals, SQL, Authentication, REST APIs, NoSQL  
**Estimated Study Time:** 1-2 months

---

## Module 1: Backend Fundamentals (Solutions 1-20)

### Solution 1: What is backend development and how does it differ from frontend?

**Answer:**

**Backend Development** is server-side development that handles:
- Business logic and data processing
- Database operations
- Authentication and authorization
- API creation and management
- Server configuration and deployment

**Frontend Development** is client-side development that handles:
- User interface (UI)
- User experience (UX)
- Visual presentation
- Client-side interactions
- Browser rendering

**Key Differences:**

| Aspect | Backend | Frontend |
|--------|---------|----------|
| **Runs On** | Server | Browser/Client |
| **Languages** | Node.js, Python, Java, Go, PHP | HTML, CSS, JavaScript |
| **Frameworks** | Express, Django, Spring, FastAPI | React, Vue, Angular |
| **Focus** | Data, Logic, Security | UI, UX, Presentation |
| **User Sees** | No (hidden) | Yes (visible) |
| **Databases** | Direct access | Via APIs only |

**Real-World Example:**

```
E-commerce Website:

FRONTEND (What user sees):
- Product listings with images
- Shopping cart interface
- Checkout form
- User clicks "Buy Now" button

BACKEND (What happens behind the scenes):
- Validates user session
- Checks product availability in database
- Processes payment via payment gateway
- Updates inventory
- Sends confirmation email
- Stores order in database
```

**Code Example:**

**Frontend (React):**
```javascript
// User clicks button, sends request to backend
function BuyButton() {
  const handlePurchase = async () => {
    const response = await fetch('/api/purchase', {
      method: 'POST',
      body: JSON.stringify({ productId: 123, quantity: 1 })
    });
    const data = await response.json();
    alert(data.message);
  };
  
  return <button onClick={handlePurchase}>Buy Now</button>;
}
```

**Backend (Node.js/Express):**
```javascript
// Receives request, processes business logic
app.post('/api/purchase', async (req, res) => {
  const { productId, quantity } = req.body;
  
  // Business logic (backend responsibility)
  const product = await db.products.findById(productId);
  
  if (product.stock < quantity) {
    return res.status(400).json({ error: 'Out of stock' });
  }
  
  // Process payment
  const payment = await processPayment(product.price * quantity);
  
  // Update database
  await db.products.updateStock(productId, -quantity);
  await db.orders.create({ productId, quantity, payment });
  
  // Send email
  await sendConfirmationEmail(user.email);
  
  res.json({ message: 'Purchase successful!' });
});
```

---

### Solution 2: Explain the client-server architecture with a real-world example.

**Answer:**

**Client-Server Architecture** is a computing model where:
- **Client** requests services/resources
- **Server** provides services/resources
- Communication happens over a network

**Visual Diagram:**

```
┌─────────────┐                    ┌─────────────┐
│   CLIENT    │                    │   SERVER    │
│             │                    │             │
│  Browser/   │  ──── Request ──>  │  Node.js/   │
│  Mobile App │                    │  Python/    │
│             │  <─── Response ──  │  Java       │
│             │                    │             │
└─────────────┘                    └─────────────┘
      ↑                                   ↑
      │                                   │
   User Input                        Database
```

**Real-World Example: Restaurant Analogy**

```
CLIENT (Customer):
- Looks at menu
- Places order
- Waits for food
- Receives food

SERVER (Kitchen):
- Receives order
- Prepares food
- Sends food back

WAITER (Network/API):
- Takes order from customer to kitchen
- Brings food from kitchen to customer
```

**Complete Code Example:**

**Client (HTML + JavaScript):**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Weather App</title>
</head>
<body>
  <h1>Weather Checker</h1>
  <input type="text" id="city" placeholder="Enter city">
  <button onclick="getWeather()">Get Weather</button>
  <div id="result"></div>

  <script>
    async function getWeather() {
      const city = document.getElementById('city').value;
      
      // CLIENT SENDS REQUEST TO SERVER
      const response = await fetch(`http://localhost:3000/weather?city=${city}`);
      const data = await response.json();
      
      // CLIENT DISPLAYS RESULT
      document.getElementById('result').innerHTML = 
        `Temperature in ${city}: ${data.temperature}°C`;
    }
  </script>
</body>
</html>
```

**Server (Node.js/Express):**
```javascript
const express = require('express');
const app = express();

// SERVER LISTENS FOR REQUESTS
app.get('/weather', async (req, res) => {
  const city = req.query.city;
  
  // SERVER PROCESSES REQUEST
  const weatherData = {
    city: city,
    temperature: 25,
    condition: 'Sunny'
  };
  
  // SERVER SENDS RESPONSE
  res.json(weatherData);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

### Solution 3: What is an API? Explain with examples.

**Answer:**

**API (Application Programming Interface)** is a set of rules that allows different software applications to communicate.

**Simple Analogy:** API is like a **waiter in a restaurant**:
- You (client) don't go to the kitchen directly
- You tell the waiter (API) what you want
- Waiter takes your order to the kitchen (server)
- Kitchen prepares food
- Waiter brings food back to you

**Real-World API Examples:**

**Example 1: Weather API**
```javascript
// Request
GET https://api.openweathermap.org/data/2.5/weather?q=London

// Response
{
  "name": "London",
  "main": {
    "temp": 15.5,
    "humidity": 72
  },
  "weather": [{ "description": "cloudy" }]
}
```

**Building Your Own API:**

```javascript
const express = require('express');
const app = express();
app.use(express.json());

let users = [
  { id: 1, name: 'Aptik', email: 'aptik@example.com' }
];

// GET all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// GET single user
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// CREATE user
app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// UPDATE user
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  user.name = req.body.name;
  user.email = req.body.email;
  res.json(user);
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  
  users.splice(index, 1);
  res.status(204).send();
});

app.listen(3000);
```

---

### Solution 4: What is the difference between REST and SOAP?

**Answer:**

| Feature | REST | SOAP |
|---------|------|------|
| **Type** | Architectural style | Protocol |
| **Format** | JSON, XML, HTML | XML only |
| **Transport** | HTTP/HTTPS | HTTP, SMTP, TCP |
| **Complexity** | Simple | Complex |
| **Performance** | Faster | Slower |
| **Use Case** | Public APIs, mobile | Enterprise, banking |

**REST Example:**
```javascript
// Simple and clean
GET https://api.example.com/users/1
Response: { "id": 1, "name": "Aptik" }
```

**SOAP Example:**
```xml
<!-- Verbose and complex -->
<?xml version="1.0"?>
<soap:Envelope>
  <soap:Body>
    <GetUser>
      <UserId>1</UserId>
    </GetUser>
  </soap:Body>
</soap:Envelope>
```

**When to Use:**
- **REST:** Modern apps, APIs, mobile (most cases)
- **SOAP:** Banking, payments, legacy systems

---

### Solution 5: Explain the HTTP request-response cycle.

**Answer:**

**Flow:**
```
1. User types URL
   ↓
2. Browser sends HTTP Request
   ↓
3. Server processes request
   ↓
4. Server sends HTTP Response
   ↓
5. Browser displays result
```

**HTTP Request Structure:**
```http
GET /api/users/1 HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer token123
```

**HTTP Response Structure:**
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 85

{
  "id": 1,
  "name": "Aptik",
  "email": "aptik@example.com"
}
```

**Complete Example:**

```javascript
// CLIENT
const response = await fetch('https://api.example.com/users/1', {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer token123'
  }
});
const data = await response.json();

// SERVER
app.get('/users/:id', async (req, res) => {
  const user = await database.findUser(req.params.id);
  res.status(200).json(user);
});
```

---

### Solution 6: What are HTTP methods? When to use each?

**Answer:**

| Method | Purpose | Has Body | Idempotent |
|--------|---------|----------|------------|
| **GET** | Retrieve data | No | Yes |
| **POST** | Create new | Yes | No |
| **PUT** | Replace entire | Yes | Yes |
| **PATCH** | Update partial | Yes | No |
| **DELETE** | Remove | No | Yes |

**Examples:**

```javascript
// GET - Retrieve
GET /api/users/1

// POST - Create
POST /api/users
Body: { "name": "Aptik", "email": "aptik@example.com" }

// PUT - Replace entire
PUT /api/users/1
Body: { "name": "Aptik Pandey", "email": "new@example.com", "age": 25 }

// PATCH - Update partial
PATCH /api/users/1
Body: { "name": "Aptik Pandey" }

// DELETE - Remove
DELETE /api/users/1
```

**Implementation:**

```javascript
const express = require('express');
const app = express();
app.use(express.json());

let users = [{ id: 1, name: 'Aptik', email: 'aptik@example.com' }];

// CREATE
app.post('/api/users', (req, res) => {
  const newUser = { id: users.length + 1, ...req.body };
  users.push(newUser);
  res.status(201).json(newUser);
});

// READ
app.get('/api/users', (req, res) => res.json(users));
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

// UPDATE (full)
app.put('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  users[index] = { id: parseInt(req.params.id), ...req.body };
  res.json(users[index]);
});

// UPDATE (partial)
app.patch('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Not found' });
  Object.assign(user, req.body);
  res.json(user);
});

// DELETE
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  users.splice(index, 1);
  res.status(204).send();
});

app.listen(3000);
```

---

### Solution 7: What are HTTP status codes? Explain categories.

**Answer:**

**5 Categories:**

| Category | Range | Meaning |
|----------|-------|---------|
| **1xx** | 100-199 | Informational |
| **2xx** | 200-299 | Success |
| **3xx** | 300-399 | Redirection |
| **4xx** | 400-499 | Client Error |
| **5xx** | 500-599 | Server Error |

**Common Status Codes:**

**2xx Success:**
```javascript
200 OK - Standard success
201 Created - Resource created
204 No Content - Success, no data

app.get('/users/:id', (req, res) => {
  res.status(200).json(user); // 200 OK
});

app.post('/users', (req, res) => {
  res.status(201).json(newUser); // 201 Created
});

app.delete('/users/:id', (req, res) => {
  res.status(204).send(); // 204 No Content
});
```

**4xx Client Errors:**
```javascript
400 Bad Request - Invalid syntax
401 Unauthorized - Auth required
403 Forbidden - No permission
404 Not Found - Resource not found
409 Conflict - Duplicate
422 Unprocessable - Validation failed
429 Too Many Requests - Rate limited

app.post('/users', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name required' }); // 400
  }
  
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Auth required' }); // 401
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' }); // 403
  }
  
  const existing = await findUser(req.body.email);
  if (existing) {
    return res.status(409).json({ error: 'Email exists' }); // 409
  }
});
```

**5xx Server Errors:**
```javascript
500 Internal Server Error - Server crashed
502 Bad Gateway - Upstream error
503 Service Unavailable - Server down
504 Gateway Timeout - Upstream timeout

app.get('/users/:id', (req, res) => {
  try {
    const user = findUser(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal error' }); // 500
  }
});
```

---

### Solution 8: What is JSON and why is it used in APIs?

**Answer:**

**JSON (JavaScript Object Notation)** is a lightweight data format for exchanging data.

**Why JSON?**
- Human-readable
- Language-independent
- Lightweight (smaller than XML)
- Native to JavaScript
- Structured (supports nested objects/arrays)

**JSON Syntax:**
```json
{
  "string": "Hello",
  "number": 42,
  "boolean": true,
  "null": null,
  "array": [1, 2, 3],
  "object": {
    "nested": "value"
  }
}
```

**Real-World Example:**
```json
{
  "id": 1,
  "name": "Aptik Pandey",
  "email": "aptik@example.com",
  "age": 25,
  "isActive": true,
  "roles": ["user", "admin"],
  "address": {
    "city": "Patiala",
    "state": "Punjab"
  }
}
```

**Working with JSON:**

```javascript
// Object to JSON
const user = { name: 'Aptik', email: 'aptik@example.com' };
const jsonString = JSON.stringify(user);
console.log(jsonString); // '{"name":"Aptik","email":"aptik@example.com"}'

// JSON to Object
const jsonData = '{"name":"Aptik","email":"aptik@example.com"}';
const userObject = JSON.parse(jsonData);
console.log(userObject.name); // 'Aptik'

// Pretty print
const prettyJson = JSON.stringify(user, null, 2);
```

**API with JSON:**

```javascript
// Server
app.get('/api/users/:id', (req, res) => {
  const user = { id: 1, name: 'Aptik', email: 'aptik@example.com' };
  res.json(user); // Automatically converts to JSON
});

// Client
const response = await fetch('/api/users/1');
const user = await response.json(); // Parse JSON
console.log(user.name);
```

---

### Solution 9: Explain synchronous vs asynchronous programming.

**Answer:**

**Synchronous (Blocking):** Code executes line by line, waiting for each operation.

**Asynchronous (Non-blocking):** Code can start operations and move on without waiting.

**Visual:**
```
Synchronous:
Task 1 (2s) → Task 2 (3s) → Task 3 (1s)
Total: 6 seconds

Asynchronous:
Task 1 (2s) ↘
Task 2 (3s) → All parallel
Task 3 (1s) ↗
Total: 3 seconds
```

**Synchronous Example:**
```javascript
console.log('Start');

function sleep(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {} // Blocks!
}

console.log('Task 1');
sleep(3000); // Blocks for 3 seconds
console.log('Task 2');

// Output (takes 3 seconds):
// Start
// Task 1
// (3 second pause)
// Task 2
```

**Asynchronous Example:**
```javascript
console.log('Start');

setTimeout(() => {
  console.log('Task 1 done');
}, 3000); // Doesn't block!

setTimeout(() => {
  console.log('Task 2 done');
}, 2000);

console.log('End');

// Output (immediate):
// Start
// End
// (2 seconds) Task 2 done
// (1 second) Task 1 done
```

**Modern Async/Await:**

```javascript
// Sequential (slow - 6 seconds)
async function sequential() {
  const user1 = await fetchUser(1); // 2s
  const user2 = await fetchUser(2); // 2s
  const user3 = await fetchUser(3); // 2s
  return [user1, user2, user3];
}

// Parallel (fast - 2 seconds)
async function parallel() {
  const [user1, user2, user3] = await Promise.all([
    fetchUser(1), // All run simultaneously
    fetchUser(2),
    fetchUser(3)
  ]);
  return [user1, user2, user3];
}
```

**API Example:**

```javascript
// GOOD - Asynchronous
app.get('/users/:id', async (req, res) => {
  try {
    const user = await database.getUser(req.params.id); // Non-blocking
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Multiple operations in parallel
app.get('/user-with-posts/:id', async (req, res) => {
  const [user, posts] = await Promise.all([
    database.getUser(req.params.id),
    database.getUserPosts(req.params.id)
  ]);
  res.json({ user, posts });
});
```

---

### Solution 10: What is a web server? How does it differ from an application server?

**Answer:**

**Web Server:** Serves static content (HTML, CSS, images).

**Application Server:** Runs business logic, generates dynamic content.

| Feature | Web Server | Application Server |
|---------|------------|-------------------|
| **Purpose** | Serve static files | Execute business logic |
| **Content** | Static | Dynamic |
| **Examples** | Nginx, Apache | Node.js, Tomcat |
| **Database** | No | Yes |

**Architecture:**

```
Browser
   ↓
Web Server (Nginx) - Port 80
   ├─ Serves static files
   ├─ SSL termination
   └─ Proxies to app server
   ↓
Application Server (Node.js) - Port 3000
   ├─ Business logic
   ├─ Database queries
   └─ Dynamic content
   ↓
Database
```

**Web Server (Nginx):**
```nginx
server {
  listen 80;
  
  # Serve static files
  location /static/ {
    root /var/www;
  }
  
  # Proxy API to app server
  location /api/ {
    proxy_pass http://localhost:3000;
  }
}
```

**Application Server (Node.js):**
```javascript
const express = require('express');
const app = express();

// Dynamic content
app.get('/api/users', async (req, res) => {
  const users = await database.getAllUsers();
  res.json(users);
});

app.listen(3000);
```

---

*Continuing with remaining solutions 11-100...*

### Solution 11: Create a simple HTTP server that returns "Hello World".

**Answer:**

**Node.js:**
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

**Express (Better):**
```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**Python (Flask):**
```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello World'

if __name__ == '__main__':
    app.run(port=3000)
```

---

### Solution 12: Build a REST API endpoint that returns current server time.

**Answer:**

```javascript
const express = require('express');
const app = express();

app.get('/api/time', (req, res) => {
  const currentTime = {
    timestamp: Date.now(),
    iso: new Date().toISOString(),
    formatted: new Date().toLocaleString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
  
  res.json(currentTime);
});

app.listen(3000);

// Test: GET http://localhost:3000/api/time
// Response:
// {
//   "timestamp": 1702641000000,
//   "iso": "2024-12-15T10:30:00.000Z",
//   "formatted": "12/15/2024, 4:00:00 PM",
//   "timezone": "Asia/Calcutta"
// }
```

---

### Solution 13: Create an API that accepts JSON data and returns it formatted.

**Answer:**

```javascript
const express = require('express');
const app = express();

app.use(express.json()); // Parse JSON bodies

app.post('/api/format', (req, res) => {
  const data = req.body;
  
  const formatted = {
    received: data,
    formatted: JSON.stringify(data, null, 2),
    metadata: {
      keys: Object.keys(data),
      size: JSON.stringify(data).length,
      timestamp: new Date().toISOString()
    }
  };
  
  res.json(formatted);
});

app.listen(3000);

// Test:
// POST http://localhost:3000/api/format
// Body: { "name": "Aptik", "age": 25 }
// Response:
// {
//   "received": { "name": "Aptik", "age": 25 },
//   "formatted": "{\n  \"name\": \"Aptik\",\n  \"age\": 25\n}",
//   "metadata": {
//     "keys": ["name", "age"],
//     "size": 28,
//     "timestamp": "2024-12-15T10:30:00.000Z"
//   }
// }
```

---

### Solution 14: Implement basic routing with multiple endpoints.

**Answer:**

```javascript
const express = require('express');
const app = express();

// Home route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Home Page</h1>');
});

// About route
app.get('/about', (req, res) => {
  res.json({
    page: 'About',
    description: 'This is the about page',
    version: '1.0.0'
  });
});

// Contact route
app.get('/contact', (req, res) => {
  res.json({
    email: 'contact@example.com',
    phone: '+91-1234567890',
    address: 'Patiala, Punjab, India'
  });
});

// Services route
app.get('/services', (req, res) => {
  res.json({
    services: [
      'Web Development',
      'Mobile Apps',
      'Cloud Solutions'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Page not found',
    path: req.path
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

### Solution 15: Build an API that handles query parameters.

**Answer:**

```javascript
const express = require('express');
const app = express();

// Search endpoint with query parameters
app.get('/api/search', (req, res) => {
  const {
    q,           // search query
    category,    // filter by category
    minPrice,    // minimum price
    maxPrice,    // maximum price
    sort,        // sort order
    page = 1,    // default page 1
    limit = 10   // default limit 10
  } = req.query;
  
  // Simulate search results
  const results = {
    query: q,
    filters: {
      category,
      priceRange: {
        min: minPrice ? parseInt(minPrice) : null,
        max: maxPrice ? parseInt(maxPrice) : null
      }
    },
    sorting: sort || 'relevance',
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: 100
    },
    results: [
      { id: 1, name: 'Product 1', price: 500 },
      { id: 2, name: 'Product 2', price: 750 }
    ]
  };
  
  res.json(results);
});

app.listen(3000);

// Test:
// GET /api/search?q=laptop&category=electronics&minPrice=500&maxPrice=2000&sort=price&page=1&limit=20
```

---

### Solution 16: Create middleware to log all incoming requests.

**Answer:**

```javascript
const express = require('express');
const app = express();

// Logging middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  // Log response time
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${method} ${url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next(); // Pass to next middleware
};

// Apply middleware globally
app.use(requestLogger);

// Routes
app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Aptik' }]);
});

app.listen(3000);

// Console output:
// [2024-12-15T10:30:00.000Z] GET / - IP: ::1
// [2024-12-15T10:30:00.000Z] GET / - 200 - 5ms
// [2024-12-15T10:30:05.000Z] GET /api/users - IP: ::1
// [2024-12-15T10:30:05.000Z] GET /api/users - 200 - 12ms
```

---

### Solution 17: Implement error handling for 404 and 500 errors.

**Answer:**

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Regular routes
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  
  // Simulate error
  if (userId === '999') {
    throw new Error('Database connection failed');
  }
  
  // Simulate not found
  if (userId === '0') {
    return res.status(404).json({
      error: 'User not found',
      userId: userId
    });
  }
  
  res.json({ id: userId, name: 'Aptik' });
});

// 404 handler (must be after all routes)
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString()
  });
});

// 500 error handler (must be last)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

app.listen(3000);

// Test:
// GET /api/users/1 → 200 OK
// GET /api/users/0 → 404 Not Found
// GET /api/users/999 → 500 Internal Server Error
// GET /invalid-route → 404 Not Found
```

---

### Solution 18: Build a simple CRUD API for "users" (in-memory).

**Answer:**

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// In-memory database
let users = [
  { id: 1, name: 'Aptik', email: 'aptik@example.com', age: 25 },
  { id: 2, name: 'John', email: 'john@example.com', age: 30 }
];

let nextId = 3;

// CREATE - POST /api/users
app.post('/api/users', (req, res) => {
  const { name, email, age } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  
  const newUser = {
    id: nextId++,
    name,
    email,
    age: age || null
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// READ - GET /api/users (all)
app.get('/api/users', (req, res) => {
  res.json({
    total: users.length,
    users: users
  });
});

// READ - GET /api/users/:id (single)
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// UPDATE - PUT /api/users/:id
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { name, email, age } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  
  users[index] = {
    id: userId,
    name,
    email,
    age: age || null
  };
  
  res.json(users[index]);
});

// DELETE - DELETE /api/users/:id
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('CRUD API running on port 3000');
});
```

---

### Solution 19: Add request validation to check required fields.

**Answer:**

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Validation middleware
const validateUser = (req, res, next) => {
  const { name, email, age } = req.body;
  const errors = [];
  
  // Check required fields
  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!email || email.trim() === '') {
    errors.push('Email is required');
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.push('Invalid email format');
  }
  
  // Validate age
  if (age !== undefined) {
    if (typeof age !== 'number' || age < 0 || age > 150) {
      errors.push('Age must be between 0 and 150');
    }
  }
  
  // If errors, return 400
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }
  
  next(); // Validation passed
};

let users = [];
let nextId = 1;

// Apply validation middleware to POST and PUT
app.post('/api/users', validateUser, (req, res) => {
  const newUser = {
    id: nextId++,
    ...req.body
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', validateUser, (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users[index] = {
    id: userId,
    ...req.body
  };
  
  res.json(users[index]);
});

app.listen(3000);

// Test:
// POST /api/users
// Body: { "name": "", "email": "invalid" }
// Response: 400 Bad Request
// {
//   "error": "Validation failed",
//   "details": [
//     "Name is required",
//     "Invalid email format"
//   ]
// }
```

---

### Solution 20: Create an API that serves static files.

**Answer:**

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from 'public' directory
app.use('/static', express.static(path.join(__dirname, 'public')));

// Serve specific file types
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// API routes
app.get('/api/info', (req, res) => {
  res.json({
    message: 'API is working',
    staticFiles: {
      images: '/images',
      css: '/css',
      js: '/js'
    }
  });
});

// Serve HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Directory structure:
// project/
// ├── server.js
// └── public/
//     ├── index.html
//     ├── images/
//     │   └── logo.png
//     ├── css/
//     │   └── style.css
//     └── js/
//         └── app.js

// Access files:
// http://localhost:3000/ → index.html
// http://localhost:3000/images/logo.png
// http://localhost:3000/css/style.css
// http://localhost:3000/js/app.js
```

---

## Module 2: Databases - SQL Basics (Solutions 21-40)

### Solution 21: What is a database? Difference between SQL and NoSQL?

**Answer:**

**Database:** Organized collection of structured data stored electronically.

**SQL vs NoSQL:**

| Feature | SQL | NoSQL |
|---------|-----|-------|
| **Structure** | Tables (rows/columns) | Documents, key-value, graphs |
| **Schema** | Fixed, predefined | Flexible, dynamic |
| **Scaling** | Vertical (bigger server) | Horizontal (more servers) |
| **ACID** | Yes | Eventual consistency |
| **Joins** | Yes | Limited/No |
| **Examples** | PostgreSQL, MySQL | MongoDB, Redis, Cassandra |
| **Use Case** | Banking, e-commerce | Social media, real-time |

**SQL Example:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  age INTEGER
);

INSERT INTO users (name, email, age)
VALUES ('Aptik', 'aptik@example.com', 25);

SELECT * FROM users WHERE age > 20;
```

**NoSQL Example (MongoDB):**
```javascript
// Flexible schema
db.users.insertOne({
  name: 'Aptik',
  email: 'aptik@example.com',
  age: 25,
  address: {  // Nested
    city: 'Patiala',
    state: 'Punjab'
  },
  hobbies: ['coding', 'music']  // Array
});

// Can add different fields
db.users.insertOne({
  name: 'John',
  email: 'john@example.com',
  phoneNumber: '1234567890'  // New field!
});
```

**When to Use:**
- **SQL:** Banking, finance, e-commerce, complex relationships
- **NoSQL:** Social media, IoT, real-time apps, flexible schema

---

*Due to file size, I'll create this as a comprehensive foundation. Would you like me to continue with solutions 22-100 in this file, or create separate files for each module?*