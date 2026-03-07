import { getOracle } from '../controllers/oraclecontroller'
import express from 'express'

const router = express.Router()

router.get('/oracle', getOracle)

export default router

// full endpoint will be ~ /v1/oracle ~ when mounted in the server
