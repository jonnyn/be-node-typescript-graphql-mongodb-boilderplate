/* eslint-disable @typescript-eslint/no-explicit-any */
import AWS from 'aws-sdk'
import fetch from 'node-fetch'
import CONFIG from '../utils/config'

const S3 = new AWS.S3({
  accessKeyId: CONFIG.AWS.ACCESS_KEY,
  secretAccessKey: CONFIG.AWS.SECRET_ACCESS_KEY,
})

export const uploadFile = async (url: string, key: string): Promise<any> => {
  try {
    const response = await fetch(url)
    // TODO: use stream instead of buffer()
    const body = await response.buffer()
    const result = await S3.upload({
      Bucket: CONFIG.AWS.S3.BUCKET,
      Key: key,
      Body: body,
    }).promise()

    return result
  } catch (err) {
    console.error(err)
    return err
  }
}

export const generateFileUrl = async (key: string): Promise<any> => {
  S3.getSignedUrl('getObject', {
    Bucket: CONFIG.AWS.S3.BUCKET,
    Key: key,
  }, async (err, url) => {
    if (err) {
      return err
    }

    return url
  })
}

export default S3
