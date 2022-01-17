import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {column, beforeSave, BaseModel, ManyToMany, manyToMany, computed} from '@ioc:Adonis/Lucid/Orm'
import Role from "App/Models/Role";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public email: string

  @column()
  public phoneNumber: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Role, {
    pivotTable: 'user_role'
  })
  public roles: ManyToMany<typeof Role>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @computed()
  public get isAdmin() {
    return this.roles!.some(role => role.name == 'admin')
  }

  @computed()
  public get isCustomer() {
    return this.roles!.some(role => role.name == 'customer')
  }
}
