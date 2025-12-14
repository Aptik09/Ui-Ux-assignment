# Backend & System Design Master Solutions
## From Beginner to Top 0.1% Developer
## Comprehensive Answers to 500+ Questions

---

## 📚 Solutions Overview

This document contains **detailed, production-ready solutions** for all 500+ questions in the Backend & System Design Master Question Bank.

**Format:** Each solution includes:
- ✅ Clear, concise answer
- 📖 Detailed explanation with context
- 💻 Working code examples
- 📊 Diagrams and visual aids
- ⚡ Best practices and tips
- ⚠️ Common pitfalls to avoid

---

# LEVEL 1: BEGINNER (Foundation)
## Solutions 1-100: Backend Basics

---

## Module 1: Backend Fundamentals

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

**Best Practices:**
- ✅ Keep business logic in backend (security)
- ✅ Frontend only handles presentation
- ✅ Use APIs for communication
- ✅ Never trust client-side validation alone

---

### Solution 2: Explain the client-server architecture with a real-world example.

**Answer:**

**Client-Server Architecture** is a computing model where:
- **Client** requests services/resources
- **Server** provides services/resources
- Communication happens over a network

**Components:**

1. **Client:**
   - Initiates requests
   - Displays results to user
   - Examples: Web browser, mobile app, desktop app

2. **Server:**
   - Waits for requests
   - Processes requests
   - Sends responses
   - Examples: Web server, database server, file server

3. **Network:**
   - Medium for communication
   - Usually HTTP/HTTPS protocol
   - Internet or local network

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

**Code Example: Complete Client-Server Flow**

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
    // CLIENT-SIDE CODE
    async function getWeather() {
      const city = document.getElementById('city').value;
      
      // 1. CLIENT SENDS REQUEST TO SERVER
      const response = await fetch(`http://localhost:3000/weather?city=${city}`);
      
      // 2. CLIENT RECEIVES RESPONSE FROM SERVER
      const data = await response.json();
      
      // 3. CLIENT DISPLAYS RESULT TO USER
      document.getElementById('result').innerHTML = 
        `Temperature in ${city}: ${data.temperature}°C`;
    }
  </script>
</body>
</html>
```

**Server (Node.js/Express):**
```javascript
// SERVER-SIDE CODE
const express = require('express');
const app = express();

// SERVER LISTENS FOR REQUESTS
app.get('/weather', async (req, res) => {
  const city = req.query.city;
  
  // 1. SERVER RECEIVES REQUEST
  console.log(`Request received for city: ${city}`);
  
  // 2. SERVER PROCESSES REQUEST
  // (In real app, would call external weather API)
  const weatherData = {
    city: city,
    temperature: 25,
    condition: 'Sunny'
  };
  
  // 3. SERVER SENDS RESPONSE BACK TO CLIENT
  res.json(weatherData);
});

// SERVER STARTS AND WAITS FOR REQUESTS
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**Request-Response Flow:**

```
Step 1: User enters "London" and clicks button
        ↓
Step 2: Client sends HTTP GET request
        GET http://localhost:3000/weather?city=London
        ↓
Step 3: Server receives request
        ↓
Step 4: Server processes (fetches weather data)
        ↓
Step 5: Server sends JSON response
        { "city": "London", "temperature": 25, "condition": "Sunny" }
        ↓
Step 6: Client receives response
        ↓
Step 7: Client displays: "Temperature in London: 25°C"
```

**Types of Client-Server Architecture:**

**1. Two-Tier (Client ↔ Server):**
```
Browser ←→ Web Server + Database
```

**2. Three-Tier (Client ↔ App Server ↔ Database):**
```
Browser ←→ Application Server ←→ Database Server
```

**3. N-Tier (Multiple layers):**
```
Browser ←→ Load Balancer ←→ App Servers ←→ Cache ←→ Database
```

**Advantages:**
- ✅ Centralized data management
- ✅ Easy to maintain and update
- ✅ Better security (logic on server)
- ✅ Scalable (add more servers)

**Disadvantages:**
- ⚠️ Server dependency (if server down, clients can't work)
- ⚠️ Network dependency
- ⚠️ Server can become bottleneck

---

### Solution 3: What is an API? Explain with examples.

**Answer:**

**API (Application Programming Interface)** is a set of rules and protocols that allows different software applications to communicate with each other.

**Simple Analogy:**

Think of an API as a **waiter in a restaurant**:
- You (client) don't go to the kitchen directly
- You tell the waiter (API) what you want
- Waiter takes your order to the kitchen (server)
- Kitchen prepares food
- Waiter brings food back to you

**Technical Definition:**

An API defines:
- **What** requests you can make
- **How** to make those requests
- **What** data format to use
- **What** responses you'll get

**Types of APIs:**

**1. Web APIs (REST, GraphQL, SOAP)**
```javascript
// REST API Example
GET https://api.github.com/users/Aptik09
Response: { "name": "Aptik Pandey", "followers": 100 }
```

**2. Library/Framework APIs**
```javascript
// JavaScript Array API
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2); // Using Array.map() API
```

**3. Operating System APIs**
```javascript
// Node.js File System API
const fs = require('fs');
fs.readFile('file.txt', 'utf8', (err, data) => {
  console.log(data);
});
```

**Real-World API Examples:**

**Example 1: Weather API**
```javascript
// Request
GET https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY

// Response
{
  "name": "London",
  "main": {
    "temp": 15.5,
    "humidity": 72
  },
  "weather": [
    {
      "description": "cloudy"
    }
  ]
}
```

**Example 2: Payment API (Stripe)**
```javascript
// Create a payment
const stripe = require('stripe')('sk_test_...');

const payment = await stripe.charges.create({
  amount: 2000, // $20.00
  currency: 'usd',
  source: 'tok_visa',
  description: 'Product purchase'
});
```

**Example 3: Social Media API (Twitter)**
```javascript
// Post a tweet
POST https://api.twitter.com/2/tweets
{
  "text": "Hello from my app!"
}
```

**Building Your Own API:**

**Simple REST API Example (Node.js/Express):**

```javascript
const express = require('express');
const app = express();
app.use(express.json());

// In-memory database
let users = [
  { id: 1, name: 'Aptik', email: 'aptik@example.com' },
  { id: 2, name: 'John', email: 'john@example.com' }
];

// API ENDPOINTS

// 1. GET all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// 2. GET single user by ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// 3. CREATE new user
app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// 4. UPDATE user
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  user.name = req.body.name;
  user.email = req.body.email;
  res.json(user);
});

// 5. DELETE user
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  
  users.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => console.log('API running on port 3000'));
```

**Using the API (Client Side):**

```javascript
// 1. Get all users
fetch('http://localhost:3000/api/users')
  .then(res => res.json())
  .then(data => console.log(data));

// 2. Get user by ID
fetch('http://localhost:3000/api/users/1')
  .then(res => res.json())
  .then(data => console.log(data));

// 3. Create new user
fetch('http://localhost:3000/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Alice',
    email: 'alice@example.com'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// 4. Update user
fetch('http://localhost:3000/api/users/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Aptik Pandey',
    email: 'aptik.new@example.com'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// 5. Delete user
fetch('http://localhost:3000/api/users/1', {
  method: 'DELETE'
});
```

**API Documentation Example:**

```markdown
# Users API Documentation

## Get All Users
**Endpoint:** GET /api/users
**Response:** 200 OK
```json
[
  { "id": 1, "name": "Aptik", "email": "aptik@example.com" }
]
```

## Get User by ID
**Endpoint:** GET /api/users/:id
**Response:** 200 OK
```json
{ "id": 1, "name": "Aptik", "email": "aptik@example.com" }
```

## Create User
**Endpoint:** POST /api/users
**Request Body:**
```json
{ "name": "Alice", "email": "alice@example.com" }
```
**Response:** 201 Created
```json
{ "id": 3, "name": "Alice", "email": "alice@example.com" }
```
```

**Why APIs are Important:**

1. **Integration:** Connect different systems
2. **Reusability:** Use same API for web, mobile, desktop
3. **Abstraction:** Hide complex implementation
4. **Scalability:** Independent scaling of services
5. **Security:** Control access to data

**Best Practices:**
- ✅ Use clear, consistent naming
- ✅ Version your APIs (/api/v1/users)
- ✅ Return proper HTTP status codes
- ✅ Provide good documentation
- ✅ Implement authentication
- ✅ Handle errors gracefully

---

### Solution 4: What is the difference between REST and SOAP?

**Answer:**

**REST (Representational State Transfer)** and **SOAP (Simple Object Access Protocol)** are two different approaches to building web services.

**Quick Comparison:**

| Feature | REST | SOAP |
|---------|------|------|
| **Type** | Architectural style | Protocol |
| **Format** | JSON, XML, HTML, plain text | XML only |
| **Transport** | HTTP/HTTPS | HTTP, SMTP, TCP, etc. |
| **Complexity** | Simple, lightweight | Complex, heavyweight |
| **Performance** | Faster | Slower |
| **Caching** | Yes (HTTP caching) | No |
| **State** | Stateless | Can be stateful |
| **Security** | HTTPS, OAuth | WS-Security (built-in) |
| **Use Case** | Public APIs, mobile apps | Enterprise, banking, payments |

**REST (Modern, Popular)**

**Characteristics:**
- Uses standard HTTP methods (GET, POST, PUT, DELETE)
- Stateless (each request independent)
- Resource-based URLs
- Lightweight and fast
- Easy to understand and implement

**REST Example:**

```javascript
// REST API - Simple and Clean

// 1. Get all users
GET https://api.example.com/users
Response: 200 OK
[
  { "id": 1, "name": "Aptik" },
  { "id": 2, "name": "John" }
]

// 2. Get single user
GET https://api.example.com/users/1
Response: 200 OK
{ "id": 1, "name": "Aptik", "email": "aptik@example.com" }

// 3. Create user
POST https://api.example.com/users
Body: { "name": "Alice", "email": "alice@example.com" }
Response: 201 Created
{ "id": 3, "name": "Alice", "email": "alice@example.com" }

// 4. Update user
PUT https://api.example.com/users/1
Body: { "name": "Aptik Pandey" }
Response: 200 OK
{ "id": 1, "name": "Aptik Pandey", "email": "aptik@example.com" }

// 5. Delete user
DELETE https://api.example.com/users/1
Response: 204 No Content
```

**REST Implementation (Node.js):**

```javascript
const express = require('express');
const app = express();
app.use(express.json());

let users = [
  { id: 1, name: 'Aptik', email: 'aptik@example.com' }
];

// REST endpoints
app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

app.post('/users', (req, res) => {
  const user = { id: users.length + 1, ...req.body };
  users.push(user);
  res.status(201).json(user);
});

app.listen(3000);
```

**SOAP (Enterprise, Legacy)**

**Characteristics:**
- Strict XML-based protocol
- Built-in error handling (SOAP Fault)
- Built-in security (WS-Security)
- WSDL (Web Services Description Language) for documentation
- More overhead, slower

**SOAP Example:**

```xml
<!-- SOAP Request - Verbose and Complex -->

POST https://api.example.com/soap
Content-Type: text/xml

<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Header>
    <auth>
      <username>aptik</username>
      <password>secret</password>
    </auth>
  </soap:Header>
  <soap:Body>
    <GetUser>
      <UserId>1</UserId>
    </GetUser>
  </soap:Body>
</soap:Envelope>

<!-- SOAP Response -->
<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Body>
    <GetUserResponse>
      <User>
        <Id>1</Id>
        <Name>Aptik</Name>
        <Email>aptik@example.com</Email>
      </User>
    </GetUserResponse>
  </soap:Body>
</soap:Envelope>
```

**SOAP Implementation (Node.js with soap library):**

```javascript
const soap = require('soap');
const express = require('express');
const app = express();

// SOAP service definition
const service = {
  UserService: {
    UserServicePort: {
      GetUser: function(args) {
        return {
          User: {
            Id: args.UserId,
            Name: 'Aptik',
            Email: 'aptik@example.com'
          }
        };
      }
    }
  }
};

// WSDL definition (XML schema)
const wsdl = `
  <definitions>
    <message name="GetUserRequest">
      <part name="UserId" type="xsd:int"/>
    </message>
    <message name="GetUserResponse">
      <part name="User" type="tns:User"/>
    </message>
    <!-- More XML definitions... -->
  </definitions>
`;

soap.listen(app, '/soap', service, wsdl);
app.listen(3000);
```

**When to Use REST:**

✅ Public APIs (Twitter, GitHub, Stripe)  
✅ Mobile applications  
✅ Web applications  
✅ Microservices  
✅ When you need speed and simplicity  
✅ When you want to support multiple formats (JSON, XML)  

**When to Use SOAP:**

✅ Enterprise applications  
✅ Banking and financial services  
✅ Payment gateways  
✅ When you need built-in security (WS-Security)  
✅ When you need ACID transactions  
✅ Legacy system integration  

**Real-World Examples:**

**REST APIs:**
- Twitter API
- GitHub API
- Stripe Payment API
- Google Maps API
- Most modern web services

**SOAP APIs:**
- PayPal Payment API (also offers REST now)
- Salesforce API
- Banking systems
- Government services
- Legacy enterprise systems

**Code Size Comparison:**

**REST Request (JSON):**
```json
{
  "userId": 1
}
```
**Size:** ~15 bytes

**SOAP Request (XML):**
```xml
<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Body>
    <GetUser>
      <UserId>1</UserId>
    </GetUser>
  </soap:Body>
</soap:Envelope>
```
**Size:** ~200+ bytes

**Conclusion:**

- **REST:** Modern, simple, fast → Use for most new projects
- **SOAP:** Enterprise, secure, complex → Use when required by legacy systems or strict security needs

**Best Practice:** Use REST for new projects unless you have specific requirements that demand SOAP.

---

### Solution 5: Explain the HTTP request-response cycle.

**Answer:**

The **HTTP Request-Response Cycle** is the fundamental communication pattern between clients and servers on the web.

**Simple Flow:**

```
1. User types URL or clicks link
   ↓
2. Browser sends HTTP Request to server
   ↓
3. Server receives and processes request
   ↓
4. Server sends HTTP Response back
   ↓
5. Browser receives and displays response
```

**Detailed Step-by-Step Process:**

**Step 1: DNS Lookup**
```
User enters: www.example.com
Browser asks DNS: "What's the IP address?"
DNS responds: "93.184.216.34"
```

**Step 2: TCP Connection (Three-Way Handshake)**
```
Client → Server: SYN (Synchronize)
Server → Client: SYN-ACK (Synchronize-Acknowledge)
Client → Server: ACK (Acknowledge)
Connection established!
```

**Step 3: HTTP Request Sent**

**Anatomy of HTTP Request:**

```http
GET /api/users/1 HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Cookie: sessionId=abc123
```

**Request Components:**

1. **Request Line:**
   - Method: GET, POST, PUT, DELETE, PATCH
   - Path: /api/users/1
   - HTTP Version: HTTP/1.1

2. **Headers:**
   - Host: Domain name
   - User-Agent: Browser/client info
   - Accept: Expected response format
   - Authorization: Authentication token
   - Cookie: Session data

3. **Body (for POST/PUT):**
   ```json
   {
     "name": "Aptik",
     "email": "aptik@example.com"
   }
   ```

**Step 4: Server Processing**

```javascript
// Server receives request
app.get('/api/users/:id', async (req, res) => {
  // 1. Parse request
  const userId = req.params.id;
  const authToken = req.headers.authorization;
  
  // 2. Authenticate
  const user = await verifyToken(authToken);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  
  // 3. Query database
  const userData = await db.users.findById(userId);
  if (!userData) return res.status(404).json({ error: 'Not found' });
  
  // 4. Send response
  res.status(200).json(userData);
});
```

**Step 5: HTTP Response Sent**

**Anatomy of HTTP Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 85
Set-Cookie: sessionId=xyz789; HttpOnly
Cache-Control: max-age=3600
Date: Sun, 15 Dec 2024 10:30:00 GMT

{
  "id": 1,
  "name": "Aptik",
  "email": "aptik@example.com"
}
```

**Response Components:**

1. **Status Line:**
   - HTTP Version: HTTP/1.1
   - Status Code: 200
   - Status Text: OK

2. **Headers:**
   - Content-Type: Format of response
   - Content-Length: Size in bytes
   - Set-Cookie: Set cookies
   - Cache-Control: Caching rules

3. **Body:**
   - Actual data (JSON, HTML, etc.)

**Step 6: Browser Renders Response**

```javascript
// Browser receives response
fetch('https://api.example.com/users/1')
  .then(response => {
    console.log('Status:', response.status); // 200
    console.log('Headers:', response.headers);
    return response.json();
  })
  .then(data => {
    console.log('Data:', data);
    // Display data to user
    document.getElementById('user-name').textContent = data.name;
  });
```

**Complete Example with Code:**

**Client (Browser JavaScript):**

```javascript
// 1. User clicks button
document.getElementById('loadUser').addEventListener('click', async () => {
  
  // 2. Browser sends HTTP Request
  const response = await fetch('https://api.example.com/users/1', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer token123'
    }
  });
  
  // 3. Browser receives HTTP Response
  console.log('Status Code:', response.status); // 200
  console.log('Status Text:', response.statusText); // OK
  
  // 4. Parse response body
  const data = await response.json();
  
  // 5. Display to user
  document.getElementById('result').innerHTML = `
    <h2>${data.name}</h2>
    <p>${data.email}</p>
  `;
});
```

**Server (Node.js/Express):**

```javascript
const express = require('express');
const app = express();

// Server receives request and sends response
app.get('/users/:id', async (req, res) => {
  console.log('Request received!');
  console.log('Method:', req.method); // GET
  console.log('Path:', req.path); // /users/1
  console.log('Headers:', req.headers);
  console.log('Params:', req.params); // { id: '1' }
  
  // Process request
  const user = await database.findUser(req.params.id);
  
  // Send response
  res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email
  });
});

app.listen(3000, () => {
  console.log('Server listening for requests on port 3000');
});
```

**HTTP Methods and Their Purpose:**

```javascript
// GET - Retrieve data (no body)
GET /api/users/1

// POST - Create new resource (with body)
POST /api/users
Body: { "name": "Aptik", "email": "aptik@example.com" }

// PUT - Update entire resource (with body)
PUT /api/users/1
Body: { "name": "Aptik Pandey", "email": "new@example.com" }

// PATCH - Update partial resource (with body)
PATCH /api/users/1
Body: { "name": "Aptik Pandey" }

// DELETE - Remove resource (no body)
DELETE /api/users/1
```

**HTTP Status Codes:**

```javascript
// 2xx Success
200 OK - Request successful
201 Created - Resource created
204 No Content - Success but no data to return

// 3xx Redirection
301 Moved Permanently - Resource moved
302 Found - Temporary redirect
304 Not Modified - Use cached version

// 4xx Client Errors
400 Bad Request - Invalid request
401 Unauthorized - Authentication required
403 Forbidden - No permission
404 Not Found - Resource doesn't exist
429 Too Many Requests - Rate limit exceeded

// 5xx Server Errors
500 Internal Server Error - Server crashed
502 Bad Gateway - Invalid response from upstream
503 Service Unavailable - Server overloaded
```

**Visual Timeline:**

```
Time  Client                          Server
0ms   User clicks "Load User"
      ↓
10ms  DNS Lookup (get IP address)
      ↓
20ms  TCP Connection established
      ↓
30ms  Send HTTP Request →
                                      Receive Request
                                      ↓
                                      Authenticate user
                                      ↓
                                      Query database
                                      ↓
                                      Prepare response
                                      ↓
100ms                        ← Send HTTP Response
      ↓
110ms Receive Response
      ↓
120ms Parse JSON
      ↓
130ms Update UI
      ↓
140ms User sees data!
```

**Best Practices:**

✅ Use appropriate HTTP methods  
✅ Return correct status codes  
✅ Include proper headers  
✅ Handle errors gracefully  
✅ Implement caching when possible  
✅ Use HTTPS for security  
✅ Keep responses small and fast  

---

### Solution 6: What are HTTP methods (GET, POST, PUT, DELETE, PATCH)? When to use each?

**Answer:**

**HTTP Methods** (also called HTTP Verbs) define the action to be performed on a resource.

**The 5 Main HTTP Methods:**

| Method | Purpose | Has Body | Idempotent | Safe |
|--------|---------|----------|------------|------|
| **GET** | Retrieve data | No | Yes | Yes |
| **POST** | Create new resource | Yes | No | No |
| **PUT** | Update/Replace entire resource | Yes | Yes | No |
| **PATCH** | Update partial resource | Yes | No | No |
| **DELETE** | Remove resource | No | Yes | No |

**Definitions:**
- **Idempotent:** Multiple identical requests have same effect as single request
- **Safe:** Doesn't modify data (read-only)

---

**1. GET - Retrieve Data**

**Purpose:** Fetch data from server (read-only)

**Characteristics:**
- No request body
- Data in URL (query parameters)
- Can be cached
- Can be bookmarked
- Should not modify server state

**Examples:**

```javascript
// Get all users
GET /api/users

// Get single user
GET /api/users/123

// Get with query parameters
GET /api/users?role=admin&status=active

// Get with pagination
GET /api/posts?page=2&limit=10

// Search
GET /api/products?search=laptop&minPrice=500
```

**Implementation:**

```javascript
// Server (Express)
app.get('/api/users', (req, res) => {
  const users = database.getAllUsers();
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const user = database.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.get('/api/products', (req, res) => {
  const { search, minPrice } = req.query;
  const products = database.searchProducts(search, minPrice);
  res.json(products);
});

// Client
const response = await fetch('/api/users/123');
const user = await response.json();
```

**When to use GET:**
- ✅ Fetching user profile
- ✅ Loading list of products
- ✅ Searching
- ✅ Pagination
- ❌ Submitting forms (use POST)
- ❌ Deleting data (use DELETE)

---

**2. POST - Create New Resource**

**Purpose:** Create new data on server

**Characteristics:**
- Has request body
- Not idempotent (creates new resource each time)
- Cannot be cached
- Cannot be bookmarked

**Examples:**

```javascript
// Create new user
POST /api/users
Body: {
  "name": "Aptik",
  "email": "aptik@example.com",
  "password": "secret123"
}

// Create new post
POST /api/posts
Body: {
  "title": "My First Post",
  "content": "Hello World",
  "authorId": 123
}

// Upload file
POST /api/upload
Body: FormData with file

// Login
POST /api/auth/login
Body: {
  "email": "aptik@example.com",
  "password": "secret123"
}
```

**Implementation:**

```javascript
// Server (Express)
app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;
  
  // Validate
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Check if user exists
  const existing = await database.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  // Create user
  const newUser = await database.createUser({ name, email, password });
  
  // Return created resource with 201 status
  res.status(201).json(newUser);
});

// Client
const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Aptik',
    email: 'aptik@example.com',
    password: 'secret123'
  })
});

const newUser = await response.json();
console.log('Created user:', newUser);
```

**When to use POST:**
- ✅ User registration
- ✅ Creating blog post
- ✅ Submitting form
- ✅ Login/authentication
- ✅ File upload
- ✅ Any action that creates new data

---

**3. PUT - Update/Replace Entire Resource**

**Purpose:** Replace entire resource with new data

**Characteristics:**
- Has request body
- Idempotent (same result if called multiple times)
- Replaces ALL fields

**Examples:**

```javascript
// Update entire user (all fields required)
PUT /api/users/123
Body: {
  "name": "Aptik Pandey",
  "email": "aptik.new@example.com",
  "age": 25,
  "city": "Patiala"
}

// If you omit a field, it gets removed/set to null
PUT /api/users/123
Body: {
  "name": "Aptik"
  // email, age, city will be removed!
}
```

**Implementation:**

```javascript
// Server (Express)
app.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email, age, city } = req.body;
  
  // Validate all required fields
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  
  // Replace entire user
  const updatedUser = await database.replaceUser(userId, {
    name,
    email,
    age,
    city
  });
  
  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(updatedUser);
});

// Client
const response = await fetch('/api/users/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Aptik Pandey',
    email: 'aptik@example.com',
    age: 25,
    city: 'Patiala'
  })
});
```

**When to use PUT:**
- ✅ Replacing entire user profile
- ✅ Updating all settings at once
- ✅ When you want to ensure all fields are set
- ❌ Updating just one field (use PATCH)

---

**4. PATCH - Update Partial Resource**

**Purpose:** Update only specific fields

**Characteristics:**
- Has request body
- Not strictly idempotent
- Updates only provided fields

**Examples:**

```javascript
// Update only name
PATCH /api/users/123
Body: {
  "name": "Aptik Pandey"
}
// Other fields (email, age, city) remain unchanged

// Update only email
PATCH /api/users/123
Body: {
  "email": "new@example.com"
}

// Update multiple fields
PATCH /api/users/123
Body: {
  "name": "Aptik",
  "city": "Delhi"
}
```

**Implementation:**

```javascript
// Server (Express)
app.patch('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;
  
  // Get existing user
  const user = await database.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Update only provided fields
  const updatedUser = await database.updateUser(userId, updates);
  
  res.json(updatedUser);
});

// Client
const response = await fetch('/api/users/123', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Aptik Pandey' // Only update name
  })
});
```

**When to use PATCH:**
- ✅ Updating user's name only
- ✅ Changing password
- ✅ Updating profile picture
- ✅ Toggling settings (active/inactive)
- ✅ Most common update scenario

---

**5. DELETE - Remove Resource**

**Purpose:** Delete resource from server

**Characteristics:**
- Usually no request body
- Idempotent
- Returns 204 No Content or 200 OK

**Examples:**

```javascript
// Delete user
DELETE /api/users/123

// Delete post
DELETE /api/posts/456

// Delete comment
DELETE /api/comments/789
```

**Implementation:**

```javascript
// Server (Express)
app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  
  // Check if user exists
  const user = await database.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Delete user
  await database.deleteUser(userId);
  
  // Return 204 No Content (no body)
  res.status(204).send();
  
  // OR return 200 with confirmation message
  // res.status(200).json({ message: 'User deleted successfully' });
});

// Client
const response = await fetch('/api/users/123', {
  method: 'DELETE'
});

if (response.status === 204) {
  console.log('User deleted successfully');
}
```

**When to use DELETE:**
- ✅ Deleting user account
- ✅ Removing blog post
- ✅ Deleting comment
- ✅ Removing item from cart

---

**Complete CRUD Example:**

```javascript
// ========== SERVER (Express) ==========
const express = require('express');
const app = express();
app.use(express.json());

let users = [
  { id: 1, name: 'Aptik', email: 'aptik@example.com', age: 25 }
];

// CREATE - POST
app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    ...req.body
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// READ - GET (all)
app.get('/api/users', (req, res) => {
  res.json(users);
});

// READ - GET (single)
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

// UPDATE (full) - PUT
app.put('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  
  users[index] = { id: parseInt(req.params.id), ...req.body };
  res.json(users[index]);
});

// UPDATE (partial) - PATCH
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

// ========== CLIENT ==========

// CREATE
await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice', email: 'alice@example.com', age: 30 })
});

// READ
const users = await fetch('/api/users').then(r => r.json());
const user = await fetch('/api/users/1').then(r => r.json());

// UPDATE (full)
await fetch('/api/users/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Aptik Pandey', email: 'new@example.com', age: 26 })
});

// UPDATE (partial)
await fetch('/api/users/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Aptik Pandey' })
});

// DELETE
await fetch('/api/users/1', { method: 'DELETE' });
```

**Quick Decision Guide:**

```
Need to...
├─ Get data? → GET
├─ Create new? → POST
├─ Update all fields? → PUT
├─ Update some fields? → PATCH
└─ Delete? → DELETE
```

**Best Practices:**

✅ Use correct HTTP method for the action  
✅ Return appropriate status codes  
✅ GET and DELETE usually don't have body  
✅ POST, PUT, PATCH have body  
✅ Use PATCH for most updates (more flexible)  
✅ Make DELETE idempotent (safe to call multiple times)  

---

*This is Part 1 of the comprehensive solutions. Due to length constraints, I'll continue with the remaining solutions in subsequent parts. Would you like me to continue with solutions 7-100?*