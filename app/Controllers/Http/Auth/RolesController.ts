import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {schema, rules} from "@ioc:Adonis/Core/Validator";
import Role from "App/Models/Role";

export default class RolesController {

  async create({request, response, bouncer}: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize("manage")
    const data = await request.validate({
      schema: schema.create({
        name: schema.string({escape: true, trim: true},
          [rules.maxLength(60), rules.unique({
            table: 'roles', column: 'name'
          }) ]),
        description: schema.string({escape: true, trim: true}, [rules.maxLength(255)])
      })
    })
    const role = await Role.create(data)

    return response.created({code: 200, data: role})
  }

  async getAll({response, bouncer}: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize("manage")
    const roles = await Role.all()

    return response.ok({code: 200, data: roles})
  }

  async findOne({request, response, bouncer}: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize("manage")
    const role = await Role.findOrFail(request.param('id'))

    return response.ok({code: 200, data: role})
  }

  async update({request, response, bouncer}: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize("manage")
    const data = await request.validate({
      schema: schema.create({
        name: schema.string({escape: true, trim: true}, [rules.maxLength(60)]),
        description: schema.string({escape: true, trim: true}, [rules.maxLength(255)])
      })
    })
    const role = await Role.findOrFail(request.param('id'))
    await role.merge(data).save()

    return response.ok({code: 200, data: role})
  }

  async delete({request, response, bouncer}: HttpContextContract) {
    await bouncer.with('RolePolicy').authorize("manage")
    const role = await Role.findOrFail(request.param('id'))
    await role.delete()

    return response.noContent()
  }
}
