// index.ts
import server from './server.ts'
import 'dotenv/config'

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log('API KEY:', process.env.OPENWEATHER_API_KEY)
  console.log(`Listening on port ${PORT}`)
})