import { Router } from 'express'
import { makeVerifyParkingPositionHandler } from './VerifyParkingPosition.handler'
import type { VerifyParkingPositionRequest } from './VerifyParkingPosition.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeVerifyParkingPositionHandler(container.verifyParkingPosition)

router.get('/operator/vehicles/:vehicleId/verify-parking', async (req, res) => {
  const input = req.query as unknown as VerifyParkingPositionRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as verifyParkingPositionRouter }
