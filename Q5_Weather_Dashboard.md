# Q5: Real-Time Weather Monitoring Dashboard

## Requirements
- Fetch: Current temperature, Humidity, Wind speed, Short-term forecast
- 2-second delay between responses (simulating network latency)
- React without APIs

## a) Initial Implementation Using Nested Callbacks

```javascript
import React, { useState, useEffect } from 'react';

// Simulated API functions with 2-second delay
function fetchTemperature(callback) {
    setTimeout(() => {
        callback({ temp: 25, unit: '°C' });
    }, 2000);
}

function fetchHumidity(callback) {
    setTimeout(() => {
        callback({ humidity: 65, unit: '%' });
    }, 2000);
}

function fetchWindSpeed(callback) {
    setTimeout(() => {
        callback({ speed: 15, unit: 'km/h' });
    }, 2000);
}

function fetchForecast(callback) {
    setTimeout(() => {
        callback({ 
            forecast: 'Partly cloudy',
            nextHours: ['Sunny', 'Cloudy', 'Rainy']
        });
    }, 2000);
}

// Weather Dashboard Component with Nested Callbacks
function WeatherDashboard() {
    const [weatherData, setWeatherData] = useState({
        temperature: null,
        humidity: null,
        windSpeed: null,
        forecast: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        // CALLBACK HELL - Nested callbacks
        fetchTemperature((tempData) => {
            setWeatherData(prev => ({ 
                ...prev, 
                temperature: tempData 
            }));

            fetchHumidity((humidityData) => {
                setWeatherData(prev => ({ 
                    ...prev, 
                    humidity: humidityData 
                }));

                fetchWindSpeed((windData) => {
                    setWeatherData(prev => ({ 
                        ...prev, 
                        windSpeed: windData 
                    }));

                    fetchForecast((forecastData) => {
                        setWeatherData(prev => ({ 
                            ...prev, 
                            forecast: forecastData,
                            loading: false 
                        }));
                    });
                });
            });
        });
    }, []);

    if (weatherData.loading) {
        return <div>Loading weather data...</div>;
    }

    return (
        <div className="weather-dashboard">
            <h1>Weather Dashboard</h1>
            <div className="weather-card">
                <h2>Temperature</h2>
                <p>{weatherData.temperature?.temp}{weatherData.temperature?.unit}</p>
            </div>
            <div className="weather-card">
                <h2>Humidity</h2>
                <p>{weatherData.humidity?.humidity}{weatherData.humidity?.unit}</p>
            </div>
            <div className="weather-card">
                <h2>Wind Speed</h2>
                <p>{weatherData.windSpeed?.speed} {weatherData.windSpeed?.unit}</p>
            </div>
            <div className="weather-card">
                <h2>Forecast</h2>
                <p>{weatherData.forecast?.forecast}</p>
            </div>
        </div>
    );
}

export default WeatherDashboard;
```

### Problems with Nested Callbacks:
1. **Callback Hell:** Deep nesting makes code hard to read
2. **Error Handling:** Difficult to catch errors at each level
3. **Sequential Execution:** Total time = 8 seconds (2s × 4)
4. **Maintenance:** Hard to modify or add new data sources

## b) Rewrite Using Promises to Avoid Callback Hell

```javascript
import React, { useState, useEffect } from 'react';

// Convert callback functions to Promises
function fetchTemperature() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ temp: 25, unit: '°C' });
        }, 2000);
    });
}

function fetchHumidity() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ humidity: 65, unit: '%' });
        }, 2000);
    });
}

function fetchWindSpeed() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ speed: 15, unit: 'km/h' });
        }, 2000);
    });
}

function fetchForecast() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ 
                forecast: 'Partly cloudy',
                nextHours: ['Sunny', 'Cloudy', 'Rainy']
            });
        }, 2000);
    });
}

// Weather Dashboard with Promises (Sequential)
function WeatherDashboardSequential() {
    const [weatherData, setWeatherData] = useState({
        temperature: null,
        humidity: null,
        windSpeed: null,
        forecast: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        // Promise chaining - cleaner than callbacks
        fetchTemperature()
            .then(tempData => {
                setWeatherData(prev => ({ ...prev, temperature: tempData }));
                return fetchHumidity();
            })
            .then(humidityData => {
                setWeatherData(prev => ({ ...prev, humidity: humidityData }));
                return fetchWindSpeed();
            })
            .then(windData => {
                setWeatherData(prev => ({ ...prev, windSpeed: windData }));
                return fetchForecast();
            })
            .then(forecastData => {
                setWeatherData(prev => ({ 
                    ...prev, 
                    forecast: forecastData,
                    loading: false 
                }));
            })
            .catch(error => {
                setWeatherData(prev => ({ 
                    ...prev, 
                    error: error.message,
                    loading: false 
                }));
            });
    }, []);

    if (weatherData.loading) return <div>Loading...</div>;
    if (weatherData.error) return <div>Error: {weatherData.error}</div>;

    return (
        <div className="weather-dashboard">
            <h1>Weather Dashboard</h1>
            <WeatherCard title="Temperature" 
                value={`${weatherData.temperature?.temp}${weatherData.temperature?.unit}`} />
            <WeatherCard title="Humidity" 
                value={`${weatherData.humidity?.humidity}${weatherData.humidity?.unit}`} />
            <WeatherCard title="Wind Speed" 
                value={`${weatherData.windSpeed?.speed} ${weatherData.windSpeed?.unit}`} />
            <WeatherCard title="Forecast" 
                value={weatherData.forecast?.forecast} />
        </div>
    );
}

// OPTIMIZED: Parallel Execution with Promise.all
function WeatherDashboardParallel() {
    const [weatherData, setWeatherData] = useState({
        temperature: null,
        humidity: null,
        windSpeed: null,
        forecast: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        // Fetch all data in parallel - Total time: 2 seconds instead of 8!
        Promise.all([
            fetchTemperature(),
            fetchHumidity(),
            fetchWindSpeed(),
            fetchForecast()
        ])
        .then(([tempData, humidityData, windData, forecastData]) => {
            setWeatherData({
                temperature: tempData,
                humidity: humidityData,
                windSpeed: windData,
                forecast: forecastData,
                loading: false,
                error: null
            });
        })
        .catch(error => {
            setWeatherData(prev => ({ 
                ...prev, 
                error: error.message,
                loading: false 
            }));
        });
    }, []);

    if (weatherData.loading) return <div>Loading...</div>;
    if (weatherData.error) return <div>Error: {weatherData.error}</div>;

    return (
        <div className="weather-dashboard">
            <h1>Weather Dashboard (Optimized)</h1>
            <WeatherCard title="Temperature" 
                value={`${weatherData.temperature?.temp}${weatherData.temperature?.unit}`} />
            <WeatherCard title="Humidity" 
                value={`${weatherData.humidity?.humidity}${weatherData.humidity?.unit}`} />
            <WeatherCard title="Wind Speed" 
                value={`${weatherData.windSpeed?.speed} ${weatherData.windSpeed?.unit}`} />
            <WeatherCard title="Forecast" 
                value={weatherData.forecast?.forecast} />
        </div>
    );
}

// MODERN: Using Async/Await
function WeatherDashboardAsync() {
    const [weatherData, setWeatherData] = useState({
        temperature: null,
        humidity: null,
        windSpeed: null,
        forecast: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        async function fetchAllWeatherData() {
            try {
                // Parallel execution with async/await
                const [tempData, humidityData, windData, forecastData] = 
                    await Promise.all([
                        fetchTemperature(),
                        fetchHumidity(),
                        fetchWindSpeed(),
                        fetchForecast()
                    ]);

                setWeatherData({
                    temperature: tempData,
                    humidity: humidityData,
                    windSpeed: windData,
                    forecast: forecastData,
                    loading: false,
                    error: null
                });
            } catch (error) {
                setWeatherData(prev => ({ 
                    ...prev, 
                    error: error.message,
                    loading: false 
                }));
            }
        }

        fetchAllWeatherData();
    }, []);

    if (weatherData.loading) return <div>Loading...</div>;
    if (weatherData.error) return <div>Error: {weatherData.error}</div>;

    return (
        <div className="weather-dashboard">
            <h1>Weather Dashboard (Async/Await)</h1>
            <WeatherCard title="Temperature" 
                value={`${weatherData.temperature?.temp}${weatherData.temperature?.unit}`} />
            <WeatherCard title="Humidity" 
                value={`${weatherData.humidity?.humidity}${weatherData.humidity?.unit}`} />
            <WeatherCard title="Wind Speed" 
                value={`${weatherData.windSpeed?.speed} ${weatherData.windSpeed?.unit}`} />
            <WeatherCard title="Forecast" 
                value={weatherData.forecast?.forecast} />
        </div>
    );
}

// Reusable Weather Card Component
function WeatherCard({ title, value }) {
    return (
        <div className="weather-card">
            <h2>{title}</h2>
            <p>{value}</p>
        </div>
    );
}

export default WeatherDashboardAsync;
```

## Comparison

| Approach | Code Readability | Error Handling | Execution Time | Maintainability |
|----------|-----------------|----------------|----------------|-----------------|
| Nested Callbacks | ❌ Poor | ❌ Difficult | 8 seconds | ❌ Hard |
| Promise Chaining | ✅ Good | ✅ Easy | 8 seconds | ✅ Good |
| Promise.all | ✅ Excellent | ✅ Easy | 2 seconds | ✅ Excellent |
| Async/Await | ✅ Excellent | ✅ Very Easy | 2 seconds | ✅ Excellent |

## Key Benefits of Promises:
1. **Flat Structure:** No deep nesting
2. **Error Handling:** Single `.catch()` for all errors
3. **Parallel Execution:** `Promise.all()` runs simultaneously
4. **Readability:** Async/await looks like synchronous code
5. **Maintainability:** Easy to add/remove data sources
