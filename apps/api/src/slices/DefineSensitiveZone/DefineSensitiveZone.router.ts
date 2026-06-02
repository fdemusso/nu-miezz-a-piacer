import { Router } from 'express'
import { makeDefineSensitiveZoneHandler } from './DefineSensitiveZone.handler'
import type { DefineSensitiveZoneRequest } from './DefineSensitiveZone.types'
import type { Container } from '../../composition/types'

export function makeDefineSensitiveZoneRouter(deps: Container['defineSensitiveZone']): Router {
  const router = Router()
  const handler = makeDefineSensitiveZoneHandler(deps)

  router.post('/admin/zones/sensitive', async (req, res) => {
    const input = req.body as unknown as DefineSensitiveZoneRequest
    const result = await handler(input)
    res.status(201).json(result)
  })

  return router
}
