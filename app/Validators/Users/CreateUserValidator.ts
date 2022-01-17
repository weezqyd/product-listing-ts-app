import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   */
  public schema = schema.create({
    firstName: schema.string({trim: true, escape: true}, [
      rules.minLength(3), rules.maxLength(45)
    ]),
    lastName: schema.string({trim: true, escape: true}, [
      rules.minLength(3), rules.maxLength(45)
    ]),
    email: schema.string({trim: true, escape: true}, [
      rules.email(), rules.maxLength(60)
    ]),
    phoneNumber: schema.string.optional({trim: true, escape: true}, [
      rules.mobile({locales: ["en-KE"]}), rules.maxLength(16)
    ]),
    roleId: schema.number([
      rules.exists({
        table: 'roles',
        column: 'id'
      })
    ])
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {}
}
