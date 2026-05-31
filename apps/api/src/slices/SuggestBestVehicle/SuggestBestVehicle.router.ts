import { Router } from 'express'
import { makeSuggestBestVehicleHandler } from './SuggestBestVehicle.handler'
import type { SuggestBestVehicleRequest } from './SuggestBestVehicle.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeSuggestBestVehicleHandler(container.suggestBestVehicle)

router.get('/vehicles/suggest', async (req, res) => {
  const input = req.query as unknown as SuggestBestVehicleRequest
  const result = await handler(input)
  res.status(200).json(result)
})

export { router as suggestBestVehicleRouter }
