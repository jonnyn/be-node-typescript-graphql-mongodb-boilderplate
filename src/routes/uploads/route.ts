import { Router } from 'express'

import { uploadDocument, uploadAvatar } from './controller'

const router = Router()

router.route('/documents').post(uploadDocument)
router.route('/avatars').post(uploadAvatar)

export default router
