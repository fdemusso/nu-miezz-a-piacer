import { Router } from 'express'
import { makeSuggestBestVehicleHandler } from './SuggestBestVehicle.handler'
import type { SuggestBestVehicleRequest } from './SuggestBestVehicle.types'
import type { Container } from '../../composition/types'

export function makeSuggestBestVehicleRouter(deps: Container['suggestBestVehicle']): Router {
  const router = Router()
  const handler = makeSuggestBestVehicleHandler(deps)

  router.get('/vehicles/suggest', async (req, res) => {
    const input = req.query as unknown as SuggestBestVehicleRequest
    const result = await handler(input)
    res.status(200).json(result)
  })

  return router
}
