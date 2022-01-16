import test from 'japa'
import supertest from 'supertest'

import {BASE_URL, dummyUser} from '../helpers/configs'
import User from "App/Models/User";

const LOGIN_URL = '/api/v1/auth/login'

test.group('Authentication', (group) => {
  let user: User
  group.before(async () => {
    user = await User.firstOrCreate({email: dummyUser.email}, dummyUser)
  })
  //delete the user after this group
  group.after(async () => {
    if (user) {
      await user.delete()
    }
  })
  const {email, password} = dummyUser
  test('a user can login with correct credential', async assert => {
    const {statusCode, body} = await supertest(BASE_URL).post(LOGIN_URL).send({email, password})

    assert.equal(statusCode, 200)
    assert.equal(body.type, "bearer")
    assert.typeOf(body.token, "string")
  })

  test('login will fail due to invalid credentials', async assert => {
    const response = await supertest(BASE_URL).post(LOGIN_URL)
      .send({email: "user@example.com", password: "baz123"})

    assert.equal(response.statusCode, 400)
    assert.deepEqual(response.body, {code: 401, message: "Invalid credentials"})
  })
})
