import { Router } from 'express'
import { makeVerifyParkingPositionHandler } from './VerifyParkingPosition.handler'
import type { VerifyParkingPositionRequest } from './VerifyParkingPosition.types'
import type { Container } from '../../composition/types'

export function makeVerifyParkingPositionRouter(deps: Container['verifyParkingPosition']): Router {
  const router = Router()
  const handler = makeVerifyParkingPositionHandler(deps)

  router.get('/operator/vehicles/:vehicleId/verify-parking', async (req, res) => {
    const input = req.query as unknown as VerifyParkingPositionRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
