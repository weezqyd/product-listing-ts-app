import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Product from 'App/Models/Product'

export default class ProductPolicy extends BasePolicy {
	public async viewList(user: User) {
    await user.load('roles')
     return user.isAdmin || user.isCustomer
  }

  public async manage(user: User, product: Product) {
    await user.load('roles')
    return user.isAdmin && product !== undefined
  }

  public async view(user: User, product: Product) {
    await user.load('roles')
    return user.isAdmin || (user.isCustomer && product.type === 'private' && product.userId === user.id)
  }
}
