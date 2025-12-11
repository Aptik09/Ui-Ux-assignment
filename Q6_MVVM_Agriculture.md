# Q6: MVVM Architecture for Smart Agriculture System

## a) MVVM Architecture Explanation

### System Overview
Smart agriculture system streaming **soil moisture, temperature, and humidity data**.

### MVVM Components

```
┌─────────────────────────────────────────────────┐
│                    VIEW                         │
│  (UI Components - React/Vue/Angular)            │
│  - Sensor Data Display                          │
│  - Real-time Charts                             │
│  - Alert Notifications                          │
└────────────┬────────────────────────────────────┘
             │ Data Binding
             │ (Two-way)
┌────────────▼────────────────────────────────────┐
│                 VIEW MODEL                      │
│  (Business Logic & State Management)            │
│  - Observable Properties                        │
│  - Commands/Actions                             │
│  - Data Transformation                          │
└────────────┬────────────────────────────────────┘
             │ Data Access
             │
┌────────────▼────────────────────────────────────┐
│                   MODEL                         │
│  (Data Layer - API/Database)                    │
│  - Sensor Data API                              │
│  - WebSocket Connections                        │
│  - Data Persistence                             │
└─────────────────────────────────────────────────┘
```

### Pros of MVVM:

1. **Separation of Concerns**
   - UI logic separate from business logic
   - Easy to modify UI without touching data layer

2. **Testability**
   - ViewModel can be unit tested independently
   - Mock data sources easily

3. **Data Binding**
   - Automatic UI updates when data changes
   - Reduces boilerplate code

4. **Reusability**
   - ViewModels can be shared across multiple views
   - Model layer independent of UI framework

5. **Asynchronous Handling**
   - Perfect for real-time sensor data streams
   - Observable patterns handle async updates naturally

### Cons of MVVM:

1. **Complexity**
   - Overkill for simple applications
   - Steeper learning curve

2. **Memory Overhead**
   - Data binding creates additional objects
   - Can impact performance with many sensors

3. **Debugging Difficulty**
   - Data flow through multiple layers
   - Harder to trace issues

### MVVM vs MVP for Agriculture System

| Aspect | MVVM | MVP |
|--------|------|-----|
| **UI Responsiveness** | ✅ Excellent (auto-updates) | ⚠️ Manual updates needed |
| **Testing** | ✅ Easy (ViewModel isolated) | ✅ Easy (Presenter isolated) |
| **Async Events** | ✅ Built-in (Observables) | ⚠️ Requires callbacks |
| **Code Complexity** | ⚠️ Higher | ✅ Lower |
| **Real-time Data** | ✅ Perfect fit | ⚠️ More manual work |

**Recommendation:** MVVM is better for this agriculture system due to real-time sensor data streaming and need for responsive UI updates.

## b) JavaScript Function with map() and reduce()

```javascript
// Function that takes array and uses map() and reduce()
function processNumbers(numbers) {
    // Step 1: Multiply all numbers by 2 using map()
    const multiplied = numbers.map(num => num * 2);
    
    console.log('Original array:', numbers);
    console.log('After multiplying by 2:', multiplied);
    
    // Step 2: Find sum using reduce()
    const sum = multiplied.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0);
    
    console.log('Sum of multiplied numbers:', sum);
    
    return {
        original: numbers,
        multiplied: multiplied,
        sum: sum
    };
}

// Example usage
const testArray = [1, 2, 3, 4, 5];
const result = processNumbers(testArray);

console.log('Final result:', result);
// Output:
// Original array: [1, 2, 3, 4, 5]
// After multiplying by 2: [2, 4, 6, 8, 10]
// Sum of multiplied numbers: 30

// One-liner version
function processNumbersCompact(numbers) {
    return numbers.map(n => n * 2).reduce((sum, n) => sum + n, 0);
}

console.log(processNumbersCompact([1, 2, 3, 4, 5])); // Output: 30

// With detailed steps for clarity
function processNumbersDetailed(numbers) {
    console.log('=== Processing Numbers ===');
    
    // map() explanation:
    // - Takes each element
    // - Applies transformation (multiply by 2)
    // - Returns new array
    const doubled = numbers.map((num, index) => {
        const result = num * 2;
        console.log(`Step ${index + 1}: ${num} × 2 = ${result}`);
        return result;
    });
    
    console.log('\n=== Calculating Sum ===');
    
    // reduce() explanation:
    // - Starts with initial value (0)
    // - Accumulates by adding each element
    // - Returns single value
    const total = doubled.reduce((accumulator, currentValue, index) => {
        const newSum = accumulator + currentValue;
        console.log(`Step ${index + 1}: ${accumulator} + ${currentValue} = ${newSum}`);
        return newSum;
    }, 0);
    
    return {
        original: numbers,
        doubled: doubled,
        sum: total
    };
}

// Test with different arrays
console.log('\nTest 1:');
processNumbersDetailed([1, 2, 3, 4, 5]);

console.log('\nTest 2:');
processNumbersDetailed([10, 20, 30]);

console.log('\nTest 3:');
processNumbersDetailed([7, 14, 21]);
```

### Output Explanation:

```
=== Processing Numbers ===
Step 1: 1 × 2 = 2
Step 2: 2 × 2 = 4
Step 3: 3 × 2 = 6
Step 4: 4 × 2 = 8
Step 5: 5 × 2 = 10

=== Calculating Sum ===
Step 1: 0 + 2 = 2
Step 2: 2 + 4 = 6
Step 3: 6 + 6 = 12
Step 4: 12 + 8 = 20
Step 5: 20 + 10 = 30

Final result: {
  original: [1, 2, 3, 4, 5],
  doubled: [2, 4, 6, 8, 10],
  sum: 30
}
```

### Method Breakdown:

**map():**
- Creates new array
- Transforms each element
- Same length as original
- Doesn't modify original array

**reduce():**
- Reduces array to single value
- Accumulates result
- Takes initial value (0)
- Processes left to right
