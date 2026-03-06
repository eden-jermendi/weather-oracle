import { useState } from 'react'
import { getOracle } from '../apiClient'

export default function App() {
  const [city, setCity] = useState('')
  const [oracle, setOracle] = useState('')
  const [temp, setTemp] = useState<number | null>(null)
  const [weather, setWeather] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    if (!city) return

    try {
      setLoading(true)
      const data = await getOracle(city)  // calling apiclient fn to get oracle data from backend

      if (data) {
        setOracle(data.oracle ?? 'The oracle cannot see this city.')
        setTemp(data.temp ?? null)
        setWeather(data.weather ?? '')
      } else {
        setOracle('The oracle cannot see this city.')
        setTemp(null)
        setWeather('')
      }
    } catch (error) {
      console.error(error)
      setOracle('The oracle is confused by the winds.')
      setTemp(null)
      setWeather('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🔮 Weather Oracle</h1>

      <input
        placeholder="Enter a city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={handleSearch} style={{ marginLeft: '10px' }}>
        Ask the Oracle
      </button>

      {loading && <p>Consulting the skies...</p>}

      {oracle && (
        <div style={{ marginTop: '20px', fontStyle: 'italic' }}>
          {temp !== null && <p>🌡 Temperature: {temp}°C</p>}
          {weather && <p>☁ Weather: {weather}</p>}
          <p>🔮 {oracle}</p>
        </div>
      )}
    </div>
  )
}