import { Router } from 'express'
import { makeBookVehicleHandler } from './BookVehicle.handler'
import type { BookVehicleRequest } from './BookVehicle.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeBookVehicleHandler(container.bookVehicle)

router.post('/bookings', async (req, res) => {
  const input = req.body as unknown as BookVehicleRequest
  const result = await handler(input)
  res.status(201).json(result)
})

export { router as bookVehicleRouter }
