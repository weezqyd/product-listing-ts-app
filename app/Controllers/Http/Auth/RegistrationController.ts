import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SignUpValidator from "App/Validators/Auth/SignUpValidator";
import User from "App/Models/User";
import Event from "@ioc:Adonis/Core/Event";
import Role from "App/Models/Role";

export default class RegistrationController {
  async signup({request, response}: HttpContextContract) {
    const userData = await request.validate(SignUpValidator)
    const user = await User.create(userData)
    const role = await Role.firstOrCreate({name: "customer"}, {
      name: 'customer', description: 'Public user or customer'
    })

    await Promise.all([
      Event.emit('user.self.registered', {data:user}),
      user.related('roles').attach([role.id])
    ])

    return response.created({code: 200, message: 'Registration was successful'})
  }
}
