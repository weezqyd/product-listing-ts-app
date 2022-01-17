import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from "App/Models/User";

export default class UserPolicy extends BasePolicy {
  public async manage(user: User) {
    await user.load('roles')
    return user.isAdmin
  }
}
