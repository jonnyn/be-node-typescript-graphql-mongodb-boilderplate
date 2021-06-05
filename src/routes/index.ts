import { Router } from 'express'

import { authenticate } from '../middleware/auth.middleware'
import uploads from './uploads/route'

const router = Router()

router.use('/uploads', authenticate, uploads)

export default router
