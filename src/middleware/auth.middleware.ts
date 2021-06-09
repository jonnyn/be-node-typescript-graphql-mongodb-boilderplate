import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import request from 'request'
import jwkToPem from 'jwk-to-pem'
import CONFIG from '../utils/config'

export const getCognitoPems = async () => {
  const options = {
    url: CONFIG.AWS.COGNITO.JWKS_URL,
    json: true,
  }
  request.get(options, (err, resp, body) => {
    if (err) {
      // console.debug(`Failed to download JWKS data. err: ${err}`)
      return (new Error('Internal error occurred downloading JWKS data.')) // don't return detailed info to the caller
    }
    if (!body || !body.keys) {
      // console.debug(`JWKS data is not in expected format. Response was: ${JSON.stringify(resp)}`)
      return (new Error('Internal error occurred downloading JWKS data.')) // don't return detailed info to the caller
    }
    const pems: any = {}
    for (let i = 0; i < body.keys.length; i += 1) {
      pems[body.keys[i].kid] = jwkToPem(body.keys[i])
    }
    // console.info(`Successfully downloaded ${body.keys.length} JWK key(s)`)
    return pems
  })
}

export const authenticate = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization
    if (!header) throw new Error('Authorization header is missing')

    const cognitoPems: any = await getCognitoPems()
    const token = header.split(' ')[1]

    // Decode the JWT token so we can match it to a key to verify it against
    const decodedNotVerified: any = jwt.decode(token, { complete: true })

    const user: any = await jwt.verify(
      header.split(' ')[1],
      cognitoPems[decodedNotVerified.header.kid],
      { algorithms: ['RS256'] },
    )
    user.id = user.sub
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

export const anotherMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // console.log('anotherMiddleware')
  next()
}
