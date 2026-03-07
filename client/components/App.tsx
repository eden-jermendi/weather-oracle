import { useState } from 'react'
import { getOracle } from '../apiClient'

function getReadableError(error: unknown): string {
  const err = error as { response?: { body?: { error?: string } } }
  const backendMessage = err?.response?.body?.error

  if (backendMessage === 'city not found') {
    return 'City not found. Try another city name.'
  }

  if (backendMessage === 'METEOBLUE_API_KEY is not set') {
    return 'Server setup issue: missing Meteoblue API key.'
  }

  if (backendMessage === 'GEMINI_API_KEY is not set') {
    return 'Server setup issue: missing Gemini API key.'
  }

  if (typeof backendMessage === 'string' && backendMessage.length > 0) {
    return backendMessage
  }

  return 'The oracle is confused by the winds.'
}

export default function App() {
  const [city, setCity] = useState('')
  const [oracle, setOracle] = useState('')
  const [temp, setTemp] = useState<number | null>(null)
  const [feelsLike, setFeelsLike] = useState<number | null>(null)
  const [humidity, setHumidity] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    if (!city) return

    try {
      setLoading(true)
      const data = await getOracle(city) // calling apiclient fn to get oracle data from backend

      if (data) {
        setOracle(data.oracle ?? 'The oracle cannot see this city.')
        setTemp(data.weather?.temperature ?? null)
        setFeelsLike(data.weather?.feelsLike ?? null)
        setHumidity(data.weather?.humidity ?? null)
      } else {
        setOracle('The oracle cannot see this city.')
        setTemp(null)
        setFeelsLike(null)
        setHumidity(null)
      }
    } catch (error) {
      console.error(error)
      setOracle(getReadableError(error))
      setTemp(null)
      setFeelsLike(null)
      setHumidity(null)
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
          {temp !== null && <p>🌡 Temperature: {temp.toFixed(1)}°C</p>}
          {feelsLike !== null && <p>🥶 Feels like: {feelsLike.toFixed(1)}°C</p>}
          {humidity !== null && <p>💧 Humidity: {humidity}%</p>}
          <p>🔮 {oracle}</p>
        </div>
      )}
    </div>
  )
}
