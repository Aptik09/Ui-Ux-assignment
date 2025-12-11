# Question Bank: Node.js
## UCS542: UI & UX SPECIALIST

---

## Topic 1: Introduction to Node.js

### Conceptual Questions
1. What is Node.js?
2. Who created Node.js and when?
3. What is the difference between Node.js and JavaScript?
4. Is Node.js a programming language or a framework?
5. What are the main use cases of Node.js?

### Practical Questions
6. Explain why Node.js is popular for backend development.
7. List 5 companies that use Node.js in production.
8. What types of applications can be built with Node.js?
9. Compare Node.js with traditional server-side technologies (PHP, Java).
10. What are the limitations of Node.js?

---

## Topic 2: History of Node.js

### Conceptual Questions
11. When was Node.js first released?
12. Who is Ryan Dahl and what was his motivation for creating Node.js?
13. What is the V8 engine and how is it related to Node.js?
14. Explain the evolution of Node.js versions.
15. What is the Node.js Foundation?

### Practical Questions
16. What major features were introduced in Node.js v10, v12, v14, v16?
17. Explain LTS (Long Term Support) versions in Node.js.
18. What is the difference between odd and even version numbers?
19. How has Node.js evolved over the years?
20. What is the current stable version of Node.js?

---

## Topic 3: Why Node.js?

### Conceptual Questions
21. What are the advantages of using Node.js?
22. Why is Node.js suitable for real-time applications?
23. How does Node.js handle concurrent requests?
24. What is non-blocking I/O?
25. Why is Node.js fast?

### Practical Questions
26. Explain scenarios where Node.js is the best choice.
27. When should you NOT use Node.js?
28. Compare Node.js performance with other backend technologies.
29. How does Node.js handle CPU-intensive tasks?
30. What makes Node.js scalable?

---

## Topic 4: Node.js Architecture

### Conceptual Questions
31. Explain the architecture of Node.js.
32. What is the Event Loop in Node.js?
33. What is the Call Stack?
34. What is the Event Queue?
35. What is libuv?

### Practical Questions
36. Draw a diagram of Node.js architecture.
37. Explain how the Event Loop works with an example.
38. What are the phases of the Event Loop?
39. How does Node.js handle asynchronous operations?
40. Explain the role of V8 engine in Node.js.

### Advanced Questions
41. What is the Thread Pool in Node.js?
42. How many threads does Node.js use?
43. Explain the difference between process.nextTick() and setImmediate().
44. What is the Microtask Queue?
45. How does Node.js achieve non-blocking I/O?

---

## Topic 5: Features of Node.js

### Conceptual Questions
46. What are the key features of Node.js?
47. Explain single-threaded event-driven architecture.
48. What is asynchronous programming in Node.js?
49. How does Node.js handle multiple requests?
50. What is the npm ecosystem?

### Practical Questions
51. Demonstrate non-blocking I/O with an example.
52. Create a simple HTTP server in Node.js.
53. Show how Node.js handles concurrent requests.
54. Explain event-driven programming with code.
55. Use callbacks to handle asynchronous operations.

---

## Topic 6: Installation & Setup

### Conceptual Questions
56. How do you install Node.js?
57. What is nvm (Node Version Manager)?
58. What is the difference between Node.js and npm?
59. How do you check Node.js version?
60. What is package.json?

### Practical Questions
61. Install Node.js on your system.
62. Verify Node.js and npm installation.
63. Create a new Node.js project with npm init.
64. Install a package using npm.
65. Update Node.js to the latest version.

### Advanced Questions
66. Use nvm to manage multiple Node.js versions.
67. Configure npm registry.
68. Set up a Node.js project with TypeScript.
69. Create custom npm scripts.
70. Understand package-lock.json.

---

## Topic 7: npm (Node Package Manager)

### Conceptual Questions
71. What is npm?
72. What is the difference between npm and npx?
73. What are npm packages?
74. What is the npm registry?
75. What are dev dependencies vs dependencies?

### Practical Questions
76. Install a package locally and globally.
77. Uninstall a package using npm.
78. Update packages to latest versions.
79. Use npm scripts in package.json.
80. Publish a package to npm registry.

### Advanced Questions
81. What is semantic versioning (semver)?
82. Explain package.json vs package-lock.json.
83. Use npm audit to check vulnerabilities.
84. Create and use private npm packages.
85. Configure .npmrc file.

---

## Topic 8: REPL Environment

### Conceptual Questions
86. What is REPL in Node.js?
87. What does REPL stand for?
88. How do you start REPL?
89. What are the uses of REPL?
90. How do you exit REPL?

### Practical Questions
91. Start Node.js REPL and execute JavaScript code.
92. Use REPL to test JavaScript expressions.
93. Access previous results using underscore (_).
94. Use REPL commands (.help, .break, .clear).
95. Load a module in REPL.

### Advanced Questions
96. Create a custom REPL.
97. Use REPL for debugging.
98. Execute multi-line code in REPL.
99. Save REPL session history.
100. Use REPL with ES6 features.

---

## Topic 9: Variables & Data Types

### Conceptual Questions
101. How do you declare variables in Node.js?
102. What are the data types in Node.js?
103. What is the difference between var, let, and const?
104. What is the global object in Node.js?
105. What are Buffer objects?

### Practical Questions
106. Declare variables using var, let, and const.
107. Create and manipulate Buffer objects.
108. Use global variables in Node.js.
109. Work with different data types.
110. Convert between data types.

---

## Topic 10: Node.js Modules

### Conceptual Questions
111. What are modules in Node.js?
112. What is the CommonJS module system?
113. What is the difference between require() and import?
114. What are core modules in Node.js?
115. What are local modules?

### Practical Questions
116. Create a local module and export functions.
117. Import and use a local module.
118. Use core modules (fs, path, os).
119. Export multiple functions from a module.
120. Create a module that exports a class.

### Advanced Questions
121. Explain module caching in Node.js.
122. What is module.exports vs exports?
123. Use ES6 modules in Node.js.
124. Create circular dependencies and resolve them.
125. Understand the module wrapper function.

---

## Topic 11: Module Exports

### Conceptual Questions
126. What is module.exports?
127. What is the difference between module.exports and exports?
128. How do you export a single function?
129. How do you export multiple functions?
130. How do you export a class?

### Practical Questions
131. Export a single function from a module.
132. Export multiple functions as an object.
133. Export a class and use it in another file.
134. Export variables from a module.
135. Create a module with default export.

### Advanced Questions
136. Explain the relationship between exports and module.exports.
137. Override module.exports with a function.
138. Create a module that exports both functions and objects.
139. Use destructuring to import specific exports.
140. Implement a module pattern for encapsulation.

---

## Topic 12: HTTP Module

### Conceptual Questions
141. What is the HTTP module in Node.js?
142. How do you create an HTTP server?
143. What is the difference between http and https modules?
144. What are HTTP methods?
145. What are HTTP status codes?

### Practical Questions
146. Create a simple HTTP server.
147. Handle GET and POST requests.
148. Send JSON response from server.
149. Serve HTML files using HTTP module.
150. Handle different routes in HTTP server.

### Advanced Questions
151. Create a RESTful API using HTTP module.
152. Implement request and response headers.
153. Handle file uploads with HTTP module.
154. Create an HTTPS server with SSL certificates.
155. Implement middleware pattern with HTTP module.

---

## Topic 13: Express.js Framework

### Conceptual Questions
156. What is Express.js?
157. Why use Express.js over plain HTTP module?
158. What are the features of Express.js?
159. What is middleware in Express?
160. What is routing in Express?

### Practical Questions
161. Install and set up Express.js.
162. Create a basic Express server.
163. Define routes in Express (GET, POST, PUT, DELETE).
164. Use route parameters in Express.
165. Serve static files with Express.

### Advanced Questions
166. Create custom middleware in Express.
167. Use third-party middleware (body-parser, cors).
168. Implement error handling middleware.
169. Create a RESTful API with Express.
170. Use Express Router for modular routing.

---

## Topic 14: Route Handling

### Conceptual Questions
171. What is routing in Node.js?
172. How do you handle different HTTP methods?
173. What are route parameters?
174. What are query parameters?
175. What is the difference between params and query?

### Practical Questions
176. Create routes for CRUD operations.
177. Use route parameters to get dynamic data.
178. Access query parameters in routes.
179. Handle POST request with body data.
180. Create nested routes.

### Advanced Questions
181. Implement route validation.
182. Use regular expressions in routes.
183. Create route middleware for authentication.
184. Implement API versioning with routes.
185. Handle 404 errors for undefined routes.

---

## Topic 15: File System Module

### Conceptual Questions
186. What is the fs module in Node.js?
187. What is the difference between synchronous and asynchronous file operations?
188. What are streams in Node.js?
189. What is the difference between readFile and createReadStream?
190. How do you handle file paths in Node.js?

### Practical Questions
191. Read a file using fs.readFile().
192. Write data to a file using fs.writeFile().
193. Append data to a file.
194. Delete a file using fs.unlink().
195. Check if a file exists.

### Advanced Questions
196. Use streams to read large files.
197. Copy a file using streams.
198. Watch for file changes using fs.watch().
199. Work with directories (create, read, delete).
200. Implement file upload functionality.

---

## Topic 16: Operating System Module

### Conceptual Questions
201. What is the os module in Node.js?
202. How do you get system information using os module?
203. What information can you retrieve about the CPU?
204. How do you get memory information?
205. What is the difference between os.platform() and os.type()?

### Practical Questions
206. Get operating system information.
207. Retrieve CPU information.
208. Get total and free memory.
209. Get user information.
210. Get network interfaces.

---

## Topic 17: Path Module

### Conceptual Questions
211. What is the path module?
212. Why is the path module important?
213. What is the difference between path.join() and path.resolve()?
214. How do you handle different path separators?
215. What is __dirname and __filename?

### Practical Questions
216. Join path segments using path.join().
217. Get absolute path using path.resolve().
218. Extract file extension using path.extname().
219. Get directory name using path.dirname().
220. Parse a file path using path.parse().

---

## Topic 18: Events Module

### Conceptual Questions
221. What is the events module?
222. What is an EventEmitter?
223. How do you create custom events?
224. What is the difference between on() and once()?
225. How do you remove event listeners?

### Practical Questions
226. Create an EventEmitter instance.
227. Emit and listen to custom events.
228. Pass data with events.
229. Use once() for one-time event listeners.
230. Remove event listeners.

### Advanced Questions
231. Create a custom class that extends EventEmitter.
232. Handle errors in event listeners.
233. Implement event-driven architecture.
234. Use events for inter-module communication.
235. Understand event loop and events relationship.

---

## Topic 19: Database Connectivity

### Conceptual Questions
236. How do you connect Node.js to databases?
237. What is MongoDB and how to use it with Node.js?
238. What is Mongoose?
239. What is MySQL and how to connect it?
240. What are ORMs and ODMs?

### Practical Questions
241. Connect to MongoDB using native driver.
242. Use Mongoose to connect to MongoDB.
243. Create a schema and model in Mongoose.
244. Perform CRUD operations with MongoDB.
245. Connect to MySQL database.

### Advanced Questions
246. Implement connection pooling.
247. Handle database errors and retries.
248. Use transactions in databases.
249. Implement database migrations.
250. Optimize database queries.

---

## Topic 20: Asynchronous Programming

### Conceptual Questions
251. What is asynchronous programming?
252. What are callbacks in Node.js?
253. What is callback hell?
254. What are Promises?
255. What is async/await?

### Practical Questions
256. Use callbacks for asynchronous operations.
257. Convert callback to Promise.
258. Use async/await for cleaner code.
259. Handle errors with try-catch in async functions.
260. Chain multiple asynchronous operations.

### Advanced Questions
261. Implement Promise.all() for parallel operations.
262. Use Promise.race() for timeout implementation.
263. Create custom Promises.
264. Handle multiple async operations efficiently.
265. Understand microtasks and macrotasks.

---

## Topic 21: Error Handling

### Conceptual Questions
266. How do you handle errors in Node.js?
267. What is the difference between operational and programmer errors?
268. What is try-catch?
269. How do you handle async errors?
270. What are error-first callbacks?

### Practical Questions
271. Use try-catch for error handling.
272. Handle errors in callbacks.
273. Handle errors in Promises.
274. Use catch() with async/await.
275. Create custom error classes.

### Advanced Questions
276. Implement global error handler in Express.
277. Handle unhandled promise rejections.
278. Use process.on('uncaughtException').
279. Implement error logging.
280. Create error handling middleware.

---

## Comprehensive Application Questions

281. Build a RESTful API with CRUD operations.
282. Create a file upload service.
283. Implement user authentication with JWT.
284. Build a real-time chat application.
285. Create a blog API with database.
286. Implement email sending functionality.
287. Build a URL shortener service.
288. Create a task scheduler.
289. Implement rate limiting for API.
290. Build a weather API aggregator.

---

## Advanced Topics

291. What is clustering in Node.js?
292. How do you scale Node.js applications?
293. What is PM2 and how to use it?
294. What are worker threads?
295. How do you implement caching in Node.js?
296. What is Redis and how to use it?
297. How do you implement WebSockets?
298. What is GraphQL and how to use it with Node.js?
299. How do you test Node.js applications?
300. What are the security best practices for Node.js?

---

**Total Questions: 300**
**Difficulty Levels:** Basic (1-100), Intermediate (101-200), Advanced (201-300)
