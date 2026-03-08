import { useRef, useState } from 'react'
import { getOracle, OraclePersonality } from '../apiClient'
import './style.css'
import oracleLoadingSound from '../assets/sounds/oracle-loading-sound.mp3'
import oracleFinishedSound from '../assets/sounds/oracle-finished-sound.mp3'
import errorSoundEffect from '../assets/sounds/error-sound-effect.mp3'

const personalityOptions: {
  id: OraclePersonality
  label: string
  className: string
}[] = [
  {
    id: 'daughter-of-the-silver-moon',
    label: 'Daughter of the Silver Moon',
    className: 'silverMoon',
  },
  {
    id: 'tea-leaf-trickster',
    label: 'Tea-Leaf Trickster',
    className: 'teaLeaf',
  },
  {
    id: 'the-veiled-priestess',
    label: 'The Veiled Priestess',
    className: 'veiledPriestess',
  },
]

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
  const [selectedPersonality, setSelectedPersonality] =
    useState<OraclePersonality | null>(null)
  const [glitterActive, setGlitterActive] = useState(false)
  const loadingAudioRef = useRef<HTMLAudioElement | null>(null)
  const finishedAudioRef = useRef<HTMLAudioElement | null>(null)
  const errorAudioRef = useRef<HTMLAudioElement | null>(null)

  if (!loadingAudioRef.current) {
    loadingAudioRef.current = new Audio(oracleLoadingSound)
    loadingAudioRef.current.preload = 'auto'
  }

  if (!finishedAudioRef.current) {
    finishedAudioRef.current = new Audio(oracleFinishedSound)
    finishedAudioRef.current.preload = 'auto'
  }

  if (!errorAudioRef.current) {
    errorAudioRef.current = new Audio(errorSoundEffect)
    errorAudioRef.current.preload = 'auto'
  }

  async function handleSearch() {
    if (!city) return

    const loadingAudio = loadingAudioRef.current
    if (loadingAudio) {
      const loadingLoopEndSeconds = 20
      loadingAudio.pause()
      loadingAudio.currentTime = 0
      loadingAudio.loop = false
      loadingAudio.ontimeupdate = () => {
        if (loadingAudio.currentTime >= loadingLoopEndSeconds) {
          loadingAudio.currentTime = 0
        }
      }
      loadingAudio.play().catch(() => {})
    }

    setGlitterActive(true)
    setLoading(true)

    try {
      const data = await getOracle(city, selectedPersonality ?? undefined)

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

      const finishedAudio = finishedAudioRef.current
      if (finishedAudio) {
        finishedAudio.pause()
        finishedAudio.currentTime = 0
        finishedAudio.play().catch(() => {})
      }
    } catch (error) {
      console.error(error)
      setOracle(getReadableError(error))
      setTemp(null)
      setFeelsLike(null)
      setHumidity(null)

      const errorAudio = errorAudioRef.current
      if (errorAudio) {
        errorAudio.pause()
        errorAudio.currentTime = 0
        errorAudio.play().catch(() => {})
      }
    } finally {
      if (loadingAudio) {
        loadingAudio.pause()
        loadingAudio.currentTime = 0
        loadingAudio.ontimeupdate = null
      }

      setLoading(false)
      setCity('')
      requestAnimationFrame(() => setGlitterActive(false))
    }
  }

  return (
    <div className="page" style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <div className={`card ${glitterActive ? 'card--glitter' : ''}`}>
        <h1>🔮 Weather Oracle</h1>

        <input
          placeholder="Enter a city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button onClick={handleSearch} style={{ marginLeft: '10px' }}>
          Ask the Oracle
        </button>

        <div>
          <p>🧙 Choose a persona: ✨</p>
        </div>

        <div className="personalityButtons" aria-label="Oracle personality">
          {personalityOptions.map((option) => {
            const isSelected = selectedPersonality === option.id

            return (
              <button
                key={option.id}
                type="button"
                className={`personalityButton ${option.className} ${
                  isSelected ? 'selected' : ''
                }`}
                onClick={() => setSelectedPersonality(option.id)}
                aria-pressed={isSelected}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        {loading && <p>Consulting the skies...</p>}

        {oracle && (
          <div style={{ marginTop: '20px', fontStyle: 'italic' }}>
            {temp !== null && <p>🌡 Temperature: {temp.toFixed(1)}°C</p>}
            {feelsLike !== null && (
              <p>🥶 Feels like: {feelsLike.toFixed(1)}°C</p>
            )}
            {humidity !== null && <p>💧 Humidity: {humidity}%</p>}
            <p className="oracle">🔮 {oracle}</p>
          </div>
        )}
      </div>
    </div>
  )
}
