import test from "japa";
import User from "App/Models/User";
import {BASE_URL, getTestUser} from "../helpers/configs";
import supertest from "supertest";
import Role from "App/Models/Role";


test.group('User Management', async group => {
  let token: string, admin: User
  group.before(async () => {
    const testUser = await getTestUser('admin')
    admin = testUser.user
    token = testUser.token
  })
  //delete the user after this group
  group.after(async () => {
    if (admin) await admin.delete()
  })

  test('an admin can create a user', async assert => {
    const customer = await Role.firstOrCreate({name: 'customer'}, {name: 'customer', description: 'test role'})
    const response = await supertest(BASE_URL).post('/api/v1/users/new').send({
      firstName: 'Dummy', lastName: 'User', email: 'dummy.user@example.com', roleId: customer.id,
    }).set("Authorization", `Bearer ${token}`)

    assert.equal(response.statusCode, 201)
    assert.equal(response.body!.data!.email, 'dummy.user@example.com')
    assert.deepEqual(response.body!.data!.roles[0], customer.serialize())
  })
})
