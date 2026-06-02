import { Router } from 'express'
import { makeBookVehicleHandler } from './BookVehicle.handler'
import type { BookVehicleRequest } from './BookVehicle.types'
import type { Container } from '../../composition/types'

export function makeBookVehicleRouter(deps: Container['bookVehicle']): Router {
  const router = Router()
  const handler = makeBookVehicleHandler(deps)

  router.post('/bookings', async (req, res) => {
    const input = req.body as unknown as BookVehicleRequest
    const result = await handler(input)
    res.status(201).json(result)
  })

  return router
}
