import { useState } from "react";
import { useQuery } from "@tanstack/react-query";   
import {getOracle} from "../apiClient";

export default function WeatherSearch() {
  const [city, setCity] = useState("")
  const [searchCity, setSearchCity] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["weather", searchCity],
    queryFn: () => getOracle(searchCity),
    enabled: !!searchCity
  })

  function handleSearch() {
    setSearchCity(city)
  }

  return (
    <div>

      <input
        type="text"
        placeholder="Enter a city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={handleSearch}>
        Ask the Weather Oracle
      </button>

      {isLoading && <p>The oracle is consulting the skies...</p>}

      {data && (
        <div>
          <h2>{data.city}</h2>
          <p>Temperature: {data.temp}°C</p>
          <p>Weather: {data.weather}</p>
          <h3>🔮 {data.oracle}</h3>
        </div>
      )}

    </div>
  )
}