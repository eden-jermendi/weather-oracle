import { Router } from 'express'
import { getOracle } from '../controllers/oraclecontroller'

const router = Router()

router.get('/oracle', getOracle)

export default router

// full endpoint will be ~ /v1/oracle ~ when mounted in the server