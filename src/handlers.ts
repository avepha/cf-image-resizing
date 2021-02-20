import {Handler} from 'aws-lambda'

export const handler: Handler = async _ => {
  return {msg: 'hello'}
}
