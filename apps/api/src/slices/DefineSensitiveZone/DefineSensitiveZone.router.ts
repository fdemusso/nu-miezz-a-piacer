import { Router } from 'express'
import { makeDefineSensitiveZoneHandler } from './DefineSensitiveZone.handler'
import type { DefineSensitiveZoneRequest } from './DefineSensitiveZone.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeDefineSensitiveZoneHandler(container.defineSensitiveZone)

router.post('/admin/zones/sensitive', async (req, res) => {
  const input = req.body as unknown as DefineSensitiveZoneRequest
  const result = await handler(input)
  res.status(201).json(result)
})

export { router as defineSensitiveZoneRouter }
