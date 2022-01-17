import test from "japa";
import {OpaqueToken} from "@adonisjs/auth/build/src/Tokens/OpaqueToken";
import User from "App/Models/User";
import {BASE_URL, dummyUser, dummyCustomer as user} from "../helpers/configs";
import Role from "App/Models/Role";
import supertest from "supertest";
import {string} from "@ioc:Adonis/Core/Helpers";

const ENDPOINT = '/api/v1/products'

test.group('Products', async group => {
  let adminToken: OpaqueToken, userToken: OpaqueToken, admin: User, customer: User
  group.before(async () => {
    admin = await User.firstOrCreate({email: dummyUser.email}, dummyUser)
    customer = await User.firstOrCreate({email: user.email}, user)
    const adminRole = await Role.firstOrCreate(
      {name: 'admin'},
      {name: 'admin', description: 'The admin'}
    )
    const customerRole = await Role.firstOrCreate(
      {name: 'customer'},
      {name: 'customer', description: 'A customer'}
    )

    await Promise.all([
      customer.related('roles').sync([customerRole.id]),
      admin.related('roles').sync([adminRole.id]),
    ])

    const res1 = await supertest(BASE_URL).post('/api/v1/auth/login')
      .send({email: dummyUser.email, password: dummyUser.password})
    adminToken = res1.body

    //Create a token for customer
    const res2 = await supertest(BASE_URL).post('/api/v1/auth/login')
      .send({email: user.email, password: user.password})
    userToken = res2.body

  })
  //delete the user after this group
  group.after(async () => {
    if (admin) {
      await admin.delete()
    }
    if (customer) {
      await customer.delete()
    }
  })

  test('create a product as an admin', async assert => {
    const response = await supertest(BASE_URL).post(`${ENDPOINT}/new`)
      .send({
        name: 'Apple Macbook Air M1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed varius sed lacus aliquet hendrerit.' +
          'Aliquam erat volutpat. Sed maximus vulputate tortor blandit luctus',
        manufacturer: 'Apple Inc',
        distributor: 'DHL',
        category: 'Laptops',
        unitCost: 130200,
        quantity: 20,
      })
      .set('Authorization', `Bearer ${adminToken.token}`)

    assert.equal(response.statusCode, 201)
    assert.equal(response.body!.data!.name, string.escapeHTML('Apple Macbook Air M1'))
    assert.equal(response.body!.data!.category, string.escapeHTML('Laptops'))
    assert.equal(response.body!.data!.manufacturer, string.escapeHTML('Apple Inc'))
    assert.equal(response.body!.data!.type, 'internal')
    assert.equal(response.body!.data!.user_id, admin.id)
  })
  test('create a product as a customer', async assert => {
    const response = await supertest(BASE_URL).post(`${ENDPOINT}/new`)
      .send({
        name: 'IPhone 13 Pro',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed varius sed lacus aliquet hendrerit.' +
          'Aliquam erat volutpat. Sed maximus vulputate tortor blandit luctus',
        manufacturer: 'Apple Inc',
        distributor: 'DHL',
        category: 'Phones & Tablets',
        unitCost: 116100,
        quantity: 100,
      })
      .set('Authorization', `Bearer ${userToken.token}`)

    assert.equal(response.statusCode, 201)
    assert.equal(response.body!.data!.name, string.escapeHTML('IPhone 13 Pro'))
    assert.equal(response.body!.data!.category, string.escapeHTML('Phones & Tablets'))
    assert.equal(response.body!.data!.manufacturer, string.escapeHTML('Apple Inc'))
    assert.equal(response.body!.data!.type, 'private')
    assert.equal(response.body!.data!.user_id, customer.id)
  })
  test('ensure a user can only view own products', async assert => {
    const response = await supertest(BASE_URL).get(`${ENDPOINT}/show`)
      .set('Authorization', `Bearer ${userToken.token}`)

    assert.equal(response.statusCode, 200)
    const products = response.body!.data.filter(p => p.user_id == customer.id)
    assert.equal(response.body!.data!.length, products.length)
  })

  test('ensure a user can search their own products', async assert => {
    const response = await supertest(BASE_URL).get(`${ENDPOINT}/search?name=Macbook`)
      .set('Authorization', `Bearer ${userToken.token}`)

    assert.equal(response.statusCode, 200)
    const products = response.body!.data.filter(p => p.user_id == customer.id)
    assert.equal(response.body!.data!.length, products.length)
    //This search should not return any result
    assert.equal(response.body!.data!.length, 0)
  })

  test('ensure a user cannot view internal products', async assert => {
    const response = await supertest(BASE_URL).get(`${ENDPOINT}/show/1`)
      .set('Authorization', `Bearer ${userToken.token}`)

    assert.equal(response.statusCode, 403)
  })

  test('ensure a user can view single own product', async assert => {
    const response = await supertest(BASE_URL).get(`${ENDPOINT}/show/2`)
      .set('Authorization', `Bearer ${userToken.token}`)

    assert.equal(response.statusCode, 200)
  })

  test('ensure a user cannot update a product', async assert => {
    const response = await supertest(BASE_URL).put(`${ENDPOINT}/update/2`)
      .set('Authorization', `Bearer ${userToken.token}`)
      .send({
        name: 'A Fake name'
      })

    assert.equal(response.statusCode, 403)
  })

  test('ensure an admin can update a product', async assert => {
    const response = await supertest(BASE_URL).put(`${ENDPOINT}/update/2`)
      .set('Authorization', `Bearer ${adminToken.token}`)
      .send({
        name: 'IPhone 13 Pro Max', quantity: 90,
      })

    assert.equal(response.statusCode, 200)
    assert.equal(response.body!.data!.name, string.escapeHTML('IPhone 13 Pro Max'))
    assert.equal(response.body!.data!.quantity, 90)
  })
})
