import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SignUpValidator from "App/Validators/Auth/SignUpValidator";
import User from "App/Models/User";

export default class RegistrationController {
  async signup({request}: HttpContextContract) {
    const userData = await request.validate(SignUpValidator)
    const user = await User.create(userData)

    return {data: user}
  }
}
