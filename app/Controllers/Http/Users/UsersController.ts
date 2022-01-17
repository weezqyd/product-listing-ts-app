import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import CreateUserValidator from "App/Validators/Users/CreateUserValidator";
import User from "App/Models/User";
import Event from "@ioc:Adonis/Core/Event";
import UpdateUserValidator from "App/Validators/Users/UpdateUserValidator";
import _ from "lodash";
import { cuid } from '@ioc:Adonis/Core/Helpers'

export default class UsersController {

  async create({request, response, bouncer, auth}: HttpContextContract) {
    await bouncer.with('UserPolicy').authorize("manage")
    const data = await request.validate(CreateUserValidator)
    const password = cuid()
    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      password: password,
    })
    await user.related('roles').attach([data.roleId])
    await user.load('roles')
    //We can send a verification email from the event listener
    await Event.emit('users.manage.create', {data: user, creator: auth.user, password})

    return response.created({code: 200, data: user})
  }

  async getAll({request, response, bouncer}: HttpContextContract) {
    await bouncer.with('UserPolicy').authorize("manage")
    const perPage = request.qs().per_page ? request.qs().per_page : 15
    const page = request.qs().page ? request.qs().page : 1
    const users = await User.query().orderBy('created_at', 'desc')
      .preload('roles').paginate(page, perPage)

    return response.ok(users)
  }

  async getOne({request, response, bouncer}: HttpContextContract) {
    await bouncer.with('UserPolicy').authorize("manage")
    const user = await User.query().preload('roles')
      .where({id: request.param('id')})
      .firstOrFail()

    return response.ok({code: 200, data: user})
  }

  async update({request, response, bouncer, auth}: HttpContextContract) {
    await bouncer.with('UserPolicy').authorize("manage")
    let user = await User.findOrFail(request.param('id'))
    //remove null and empty values
    const validated = _.pickBy(await request.validate(UpdateUserValidator))
    user = user.merge(validated)
    await Promise.all([
      user.save(),
      Event.emit('users.manage.updated', {
        data: {user},
        user: auth.user
      }),
    ])

    return response.ok({code: 200, data: user})
  }

  async delete({request, response, bouncer, auth}: HttpContextContract) {
    await bouncer.with('UserPolicy').authorize("manage")
    const user = await User.findOrFail(request.param('id'))

    await Promise.all([
      user.delete(),
      Event.emit('users.manage.deleted', {
        data: user,
        user: auth.user
      }),
    ])

    return response.noContent()
  }
}
