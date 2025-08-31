import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import Header from './Header.js';

function App() {
  const [data, setData] = useState([]); //const data = []
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [coordinates, setCoordinates] = useState(null); // Store coordinates

  function getData() {
        // Fetch weather data from Open-Meteo API
        console.log("calling getData", coordinates)
    if (coordinates) {
      axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&hourly=temperature_2m&timezone=Asia%2FSingapore`)
      .then(response => {
        // Parse the API data to match the chart format
        const chartData = response.data.hourly.temperature_2m.map((temp, index) => ({
          time: `${index}:00`,  // Add time as a string (index:00 for now)
          temperature: temp
        }));
        setData(chartData); // updating the data value with response here
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        // setError('Failed to fetch weather data');
        // setLoading(false);
      });
    }
  }

  function handleSearch() {
    console.log({inputValue})
        axios.get(`https://nominatim.openstreetmap.org/search?q=${inputValue}&format=json`)
      .then(response => {
        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setCoordinates({ lat, lon });
          console.log("set cords")
          getData();
        } else {
          setError('City not found');
          setLoading(false);
          setData([]);
          alert("city not found or invalid!");
        }
      })
      .catch(err => {
        setError('Error fetching coordinates');
        setLoading(false);
      });
  }

  function handleInput(event) {
    setInputValue(event.target.value);
  }
  return (
    <div className="App">
              <h1>Weather Now</h1>

      <input type='text' value={inputValue} onChange={($event) => handleInput($event)} placeholder='enter the location'></input><span className='search-container'><button onClick={handleSearch}>Search</button></span>
      <div className='forcast-container'>
        <div>
  {data && data.length > 0 ? (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  ) : (
    <p>No temperature for this city</p>
  )}
</div>

      </div>
      <div>
    
      </div>
    </div>
  );
}

export default App;
