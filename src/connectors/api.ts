/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'node-fetch'
import retry from 'async-retry'
import qs from 'querystring'
import { INTERNAL_SERVER_ERROR } from 'http-status'
import log from 'utils/log'

const MAX_RETRIES = 5
const FACTOR = 2
const MIN_TIMEOUT = 50

export default async (uri: string, options = {}): Promise<any> => (
  retry(async (bail: any, attempt: number) => {
    if (attempt > 1) {
      log.warn('retry, attempt', attempt)
    }
    const {
      method = 'GET', body, headers = {}, query,
    }: any = options
    const url = query ? `${uri}?${qs.stringify(query)}` : uri

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers
      },
      method,
      body: JSON.stringify(body),
    })

    if (!response.ok && response.status >= INTERNAL_SERVER_ERROR) {
      const error: any = new Error(response.statusText)
      error.response = response
      error.text = await response.text()
      throw error
    }

    return response.json()
  }, { retries: MAX_RETRIES, factor: FACTOR, minTimeout: MIN_TIMEOUT })
)
