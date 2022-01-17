import test from 'japa'
import supertest from 'supertest'

import {BASE_URL, dummyUser as userData} from '../helpers/configs'

test.group('Registration', () => {
  test('ensure a customer can register', async (assert) => {
    const {body, statusCode} = await supertest(BASE_URL).post('/api/v1/auth/register').send(userData)

    assert.equal(statusCode, 201)
    assert.equal(body!.message, "Registration was successful")
  })
})
