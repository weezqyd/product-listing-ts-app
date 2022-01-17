import User from "App/Models/User";
import supertest from "supertest";
import Role from "App/Models/Role";

export const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
export const dummyUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: 'foo&Bar%1',
  phoneNumber: '0712345678'
}

export const dummyCustomer = {
  firstName: "Jane",
  lastName: "Smith",
  email: "jane.smith@example.com",
  password: 'baz&foo%1',
  phoneNumber: '0700345678'
}
export type TestUser = {
  user: User
  token: string
}

export async function getTestUser(roleName) : Promise<TestUser>  {
  const admin = await User.firstOrCreate({email: dummyUser.email}, dummyUser)
  const role = await Role.firstOrCreate({name: 'admin'}, {name: roleName, description: roleName})
  await admin.related('roles').sync([role.id])
  const {body} = await supertest(BASE_URL).post('/api/v1/auth/login')
    .send({email: dummyUser.email, password: dummyUser.password})

  return {
    user: admin,
    token: body.token.toString()
  }
}
