import {rules, schema} from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SignUpValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
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
    phoneNumber: schema.string({trim: true, escape: true}, [
      rules.mobile({locales: ["en-KE"]}), rules.maxLength(16)
    ]),
    password: schema.string({}, [
      rules.minLength(6), rules.maxLength(64)
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
