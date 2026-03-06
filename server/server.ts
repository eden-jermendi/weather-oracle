import express from 'express'
import cors from 'cors'
import * as Path from 'node:path'
import 'dotenv/config'
import oracleRoutes from './routes/oracleroute'

const server = express()

// Enable CORS for all origins (frontend on 5173)
server.use(cors())
server.use(express.json())

// Mount API routes
server.use('/v1', oracleRoutes)

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server