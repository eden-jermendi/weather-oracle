import * as Path from 'node:path'
import express from 'express'
import cors, { CorsOptions } from 'cors'
import 'dotenv/config'
import oracleRoutes from "./routes/oracleroute"

const server = express()
server.use("/v1", oracleRoutes)

server.use(express.json())
server.use(cors('*' as CorsOptions))

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
