import {originResponse} from '../src/handlers'
import {cfResponse} from './fixtures';

describe('Handlers', () => {
  test('originResponse', async () => {
    // @ts-ignore
    await originResponse(cfResponse, null, null)
  })
})