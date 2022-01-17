import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import Product from "App/Models/Product";

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.phoneNumber(),
      password: faker.internet.password(),
    }
  })
  .build()

export const ProductFactory = Factory.define(Product, ({faker}) => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    distributor: faker.company.companyName(),
    manufacturer: faker.company.companyName(),
    quantity: faker.datatype.number({min: 10, max:999}),
    unitCost: faker.datatype.number({min: 50, max:9999}),
  }
})
