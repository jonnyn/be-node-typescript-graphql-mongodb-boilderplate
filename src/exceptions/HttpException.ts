import { HttpExceptionJSON } from 'utils/types'

class HttpException extends Error {
  status: number

  message: string

  constructor(status: number, message: string) {
    super(message)

    this.status = status
    this.message = message
  }

  toJSON(): HttpExceptionJSON {
    return {
      status: this.status,
      message: this.message,
    }
  }
}

export default HttpException
