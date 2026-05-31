import { Router } from 'express'
import { makeMarkUrbanWarningZoneHandler } from './MarkUrbanWarningZone.handler'
import type { MarkUrbanWarningZoneRequest } from './MarkUrbanWarningZone.types'
import { container } from '../../composition/container'

const router = Router()
const handler = makeMarkUrbanWarningZoneHandler(container.markUrbanWarningZone)

router.post('/admin/zones/warning', async (req, res) => {
  const input = req.body as unknown as MarkUrbanWarningZoneRequest
  const result = await handler(input)
  res.status(201).json(result)
})

export { router as markUrbanWarningZoneRouter }
