import { Router } from 'express'
import { makeMarkUrbanWarningZoneHandler } from './MarkUrbanWarningZone.handler'
import type { MarkUrbanWarningZoneRequest } from './MarkUrbanWarningZone.types'
import type { Container } from '../../composition/types'

export function makeMarkUrbanWarningZoneRouter(deps: Container['markUrbanWarningZone']): Router {
  const router = Router()
  const handler = makeMarkUrbanWarningZoneHandler(deps)

  router.post('/admin/zones/warning', async (req, res) => {
    const input = req.body as unknown as MarkUrbanWarningZoneRequest
    const result = await handler(input)
    res.status(201).json(result)
  })

  return router
}
