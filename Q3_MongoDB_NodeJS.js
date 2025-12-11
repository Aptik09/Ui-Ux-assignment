// Q3: MongoDB Connection with Node.js

// a) Steps for connecting Node.js to MongoDB using Mongoose

/*
STEPS TO CONNECT NODE.JS TO MONGODB:

1. Install Mongoose:
   npm install mongoose

2. Import Mongoose:
   const mongoose = require('mongoose');

3. Create Connection String:
   mongodb://localhost:27017/database_name
   OR
   mongodb+srv://username:password@cluster.mongodb.net/database_name

4. Connect using mongoose.connect():
   mongoose.connect(connectionString, options)

5. Handle Connection Events:
   - connection.on('connected')
   - connection.on('error')
   - connection.on('disconnected')
*/

// b) Node.js program to read from file and write messages

const fs = require('fs');

// Read data from student.txt
fs.readFile('student.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    
    console.log('File content:', data);
    
    // Write first message
    fs.appendFile('student.txt', '\nHello Students', (err) => {
        if (err) {
            console.error('Error writing first message:', err);
            return;
        }
        
        console.log('First message written successfully');
        
        // Write second message after first completes
        fs.appendFile('student.txt', '\nWelcome to Class', (err) => {
            if (err) {
                console.error('Error writing second message:', err);
                return;
            }
            
            console.log('Second message written successfully');
            console.log('All operations completed!');
        });
    });
});

// Alternative: Using Promises for better error handling
const fsPromises = require('fs').promises;

async function processStudentFile() {
    try {
        // Read file
        const data = await fsPromises.readFile('student.txt', 'utf8');
        console.log('File content:', data);
        
        // Write first message
        await fsPromises.appendFile('student.txt', '\nHello Students');
        console.log('First message written');
        
        // Write second message
        await fsPromises.appendFile('student.txt', '\nWelcome to Class');
        console.log('Second message written');
        
        console.log('All operations completed successfully!');
    } catch (err) {
        console.error('Error:', err);
    }
}

// Uncomment to run:
// processStudentFile();
