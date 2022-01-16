import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from "App/Validators/Auth/LoginValidator";

export default class LoginController {

  async authenticate({request, auth, response}: HttpContextContract) {
    const {email, password} = await request.validate(LoginValidator)
    try {
      return await auth.use('api').attempt(email, password)
    } catch {
      return response.badRequest({code: 401, message: 'Invalid credentials'})
    }
  }
}
