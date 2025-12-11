# Q1: Online Attendance System

## a) API Explanation

### GET /api/students/:classId
**Purpose:** Load the list of students for a specific class

**Request:**
- Method: GET
- Endpoint: `/api/students/:classId`
- Parameters: `classId` (in URL path)

**Response:**
```json
{
  "students": [
    { "id": 1, "name": "John Doe", "rollNo": "101" },
    { "id": 2, "name": "Jane Smith", "rollNo": "102" }
  ]
}
```

### POST /api/attendance/mark
**Purpose:** Submit attendance marked by teacher

**Request:**
- Method: POST
- Endpoint: `/api/attendance/mark`
- Body:
```json
{
  "classId": "CS101",
  "date": "2025-12-11",
  "attendance": [
    { "studentId": 1, "status": "present" },
    { "studentId": 2, "status": "absent" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully"
}
```

## b) Props in React

**Props (Properties)** are read-only data passed from parent to child components.

### How Props Work:
1. **Passed:** Parent component passes data as attributes
2. **Validated:** PropTypes can validate data types
3. **Used:** Child component accesses via `props` object

### Example:
```jsx
// Parent Component
function AttendanceApp() {
  return <StudentList students={studentsData} classId="CS101" />;
}

// Child Component
function StudentList({ students, classId }) {
  return (
    <div>
      <h2>Class: {classId}</h2>
      {students.map(student => (
        <div key={student.id}>{student.name}</div>
      ))}
    </div>
  );
}
```

### Dynamic Rendering:
Props enable dynamic UI updates when data changes, triggering re-renders automatically.
