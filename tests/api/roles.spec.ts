import test from 'japa'
import supertest from 'supertest'

import {BASE_URL, dummyUser} from '../helpers/configs'
import User from "App/Models/User";
import {OpaqueToken} from "@adonisjs/auth/build/src/Tokens/OpaqueToken";
import Role from "App/Models/Role";

const ENDPOINT = '/api/v1/roles'

test.group('Roles', async group => {
  let token: OpaqueToken, user: User
  group.before(async () => {
    user = await User.firstOrCreate({email: dummyUser.email}, dummyUser)
    const role = await Role.firstOrCreate(
      {name: 'admin'},
      {name: 'admin', description: 'The admin'}
    )
    user.related('roles').attach([role.id])

    const {body} = await supertest(BASE_URL).post('/api/v1/auth/login')
      .send({email: dummyUser.email, password: dummyUser.password})
    token = body
  })
  //delete the user after this group
  group.after(async () => {
    if (user) {
      await user.delete()
    }
  })

  test('an admin can create a role', async assert => {
    const {body, statusCode} = await supertest(BASE_URL).post(`${ENDPOINT}/new`)
      .send({name: 'guest', description: 'visitor'}).set('Authorization', `Bearer ${token.token}`)

    assert.equal(statusCode, 201)
    assert.equal(body?.data!.name, 'guest')
  })
  test('ensure a role cannot be created twice', async assert => {
    const {body, statusCode} = await supertest(BASE_URL).post(`${ENDPOINT}/new`)
      .send({name: 'guest', description: 'visitor'}).set('Authorization', `Bearer ${token.token}`)
    assert.equal(statusCode, 422)
    assert.deepEqual(body, {
        errors: [
          {
            rule: 'unique',
            field: 'name',
            message: 'unique validation failure'
          }
        ]
      }
    )
  })

  test('an admin can view a role', async assert => {
    const {body, statusCode} = await supertest(BASE_URL).get(`${ENDPOINT}/show/1`)
      .set('Authorization', `Bearer ${token.token}`)

    assert.equal(statusCode, 200)
    assert.equal(body?.data!.id, 1)
  })

  test('an admin can view all roles', async assert => {
    const {body, statusCode} = await supertest(BASE_URL).get(`${ENDPOINT}/show`)
      .set('Authorization', `Bearer ${token.token}`)

    assert.equal(statusCode, 200)
    assert.typeOf(body?.data, 'array')
  })

  test('an admin can update a role', async assert => {
    const {body, statusCode} = await supertest(BASE_URL).put(`${ENDPOINT}/update/3`)
      .send({name: 'foo', description: 'bar'}).set('Authorization', `Bearer ${token.token}`)

    assert.equal(statusCode, 200)
    assert.equal(body?.data!.name, 'foo')
    assert.equal(body?.data!.description, 'bar')
  })

  test('an admin can delete a role', async assert => {
    let {statusCode} = await supertest(BASE_URL).delete(`${ENDPOINT}/delete/3`)
      .set('Authorization', `Bearer ${token.token}`)

    assert.equal(statusCode, 204)
    // verify that the role has been deleted
    let response = await supertest(BASE_URL).get(`${ENDPOINT}/show/3`)
      .set('Authorization', `Bearer ${token.token}`)

    assert.equal(response.statusCode, 404)
  })
})

