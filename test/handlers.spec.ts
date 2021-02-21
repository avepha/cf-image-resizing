import {originResponse} from 'src/handlers'
import {cfResponse} from './fixtures';

describe('Handlers', () => {
  test('originResponse', async () => {
    // @ts-ignore
    const result = await originResponse(cfResponse, null, null)
    console.log(result)
  })
})