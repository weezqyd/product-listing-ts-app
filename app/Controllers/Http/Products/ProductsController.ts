import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import CreateProductValidator from "App/Validators/Products/CreateProductValidator";
import Product from "App/Models/Product";
import UpdateProductValidator from "App/Validators/Products/UpdateProductValidator";
import _ from "lodash";

export default class ProductsController {
  async create({request, response, auth}: HttpContextContract) {
    const data = await request.validate(CreateProductValidator)
    await auth.user!.load('roles')
    const productType = auth.user!.isAdmin ? 'internal' : 'private'

    const product = await Product.create({
      ...data,
      type: productType,
      userId: auth.user!.id,
      currency: 'KES', // this could be a value from store settings
    })

    return response.created({code: 200, data: product})
  }

  async showAll({request, response, auth, bouncer}: HttpContextContract) {
    await bouncer.with('ProductPolicy').authorize('viewList')

    const perPage = request.qs().per_page ? request.qs().per_page : 15
    const page = request.qs().page ? request.qs().page : 1
    //If the user is an admin show them all products ordered by id desc
    if (auth.user!.isAdmin) {
      const products = await Product.query().orderBy('id', "desc").paginate(page, perPage)

      return response.ok(products)
    }

    // Alternatively show the customer their own products
    const products = await Product.query()
      .where({type: 'private', userId: auth.user!.id})
      .orderBy('id', "desc")
      .paginate(page, perPage)

    return response.ok(products)
  }

  async search({request, response, auth, bouncer}: HttpContextContract) {
    await bouncer.with('ProductPolicy').authorize('viewList')
    await auth.user?.load('roles')

    const perPage = request.qs().per_page ? request.qs().per_page : 15
    const page = request.qs().page ? request.qs().page : 1
    let query = Product.query()
    if (!auth.user!.isAdmin) {
      query = query.where({type: 'private', userId: auth.user!.id})
    }
    // Filter based on query params
    for (let field in request.qs()) {
      //apply filter only if the field is marked as searchable
      if (Product.searchable[field] !== undefined) {
        const operator = Product.searchable[field]
        let value = request.qs()[field]
        query = query.where(q => q.where(field, operator, operator === 'like' ? `%${value}%` : value))
      }
    }
    const result = await query.paginate(page, perPage)

    return response.ok(result)
  }

  async findOne({request, response, bouncer}: HttpContextContract) {
    let product = await Product.findOrFail(request.param('id'))
    await bouncer.with('ProductPolicy').authorize('view', product)

    return response.ok({code: 200, data: product})
  }

  async update({request, response, bouncer}: HttpContextContract) {
    let product = await Product.findOrFail(request.param('id'))
    await bouncer.with('ProductPolicy').authorize('manage', product)
    const validated = _.pickBy(await request.validate(UpdateProductValidator))
    product = product.merge(validated)
    await product.save()

    return response.ok({code: 200, data: product})
  }

  async delete({request, response, bouncer}: HttpContextContract) {
    const product = await Product.findOrFail(request.param('id'))
    await bouncer.with('ProductPolicy').authorize('manage', product)
    await product.delete()

    return response.noContent()
  }
}
