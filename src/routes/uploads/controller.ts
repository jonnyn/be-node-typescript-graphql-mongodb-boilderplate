/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus, { CREATED } from 'http-status'
import { Request, Response } from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import mime from 'mime-types'
import uuid from 'uuid'
import AWS from 'aws-sdk'
import CONFIG from '../../utils/config'
import { generateFileUrl } from '../../connectors/s3'

const s3 = new AWS.S3({
  accessKeyId: CONFIG.AWS.ACCESS_KEY,
  secretAccessKey: CONFIG.AWS.SECRET_ACCESS_KEY,
})

const limits = {
  fileSize: 50 * 1024 * 1024, // 50Mb, in bytes
}

export const uploadDocument = (req: Request | any, res: Response): void => {
  const storage = multerS3({
    s3,
    bucket: CONFIG.AWS.S3.BUCKET,
    key: (_, file, cb) => {
      const f: any = file
      const extension = mime.extension(file.mimetype)
      f.id = `documents/${uuid.v4()}.${extension}`.replace(/-/g, '')
      f.extension = extension
      cb(null, f.id)
    },
  })

  const fileFilter = (_: any, file: any, cb: any) => {
    const allowedExtensions = ['pdf']
    const extension: any = mime.extension(file.mimetype)

    if (allowedExtensions.includes(extension)) {
      cb(null, true)
    } else {
      const error: any = new Error('Invalid file extension')
      error.code = 'INVALID_EXTENSION'
      cb(error)
    }
  }
  const upload = multer({ storage, fileFilter, limits }).single('file')

  upload(req, res, async (err: any) => {
    if (err) {
      res.status(httpStatus.BAD_REQUEST).json({
        code: err.code.toLowerCase(),
        message: err.message,
      })
      return
    }

    const file = {
      name: req.file.originalname,
      key: req.file.id,
    }

    res.status(CREATED).json(file)
  })
}

export const uploadAvatar = async (req: Request | any, res: Response): Promise<any> => {
  const storage = multerS3({
    s3,
    bucket: CONFIG.AWS.S3.BUCKET,
    key: (_, file, cb) => {
      const f: any = file
      const extension: any = mime.extension(file.mimetype)
      f.id = `avatars/${uuid.v4()}.${extension}`.replace(/-/g, '')
      f.extension = extension
      cb(null, f.id)
    },
  })

  const fileFilter = (_: any, file: any, cb: any) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png']
    const extension: any = mime.extension(file.mimetype)

    if (allowedExtensions.includes(extension)) {
      cb(null, true)
    } else {
      const error: any = new Error('Invalid file extension')
      error.code = 'INVALID_EXTENSION'
      cb(error)
    }
  }
  const upload = multer({ storage, fileFilter, limits }).single('file')

  upload(req, res, async (err: any) => {
    if (err) {
      res.status(httpStatus.BAD_REQUEST).json({
        code: err.code.toLowerCase(),
        message: err.message,
      })
      return
    }

    const file = {
      name: req.file.originalname,
      key: req.file.key,
      url: await generateFileUrl(req.file.key),
    }

    res.status(CREATED).json(file)
  })
}

export default { uploadDocument, uploadAvatar }
