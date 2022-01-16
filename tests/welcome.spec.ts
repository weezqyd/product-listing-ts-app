import test from 'japa'
import supertest from 'supertest'

import {BASE_URL} from './helpers/configs'

test.group('Bootstrap', () => {
  test('ensure home page works', async (assert) => {
    const { body } = await supertest(BASE_URL).get('/ping')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/).expect(200)

    assert.deepEqual(body, { message: 'pong' })
  })
})
