import {DateTime} from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import User from "App/Models/User";

export default class Product extends BaseModel {
  public static searchable = {name: 'like', category: '=', manufacturer: 'like', distributor: 'like',}

  @column({isPrimary: true})
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public type: string

  @column()
  public category: string

  @column()
  public quantity: number

  @column()
  public currency: string

  @column()
  public unitCost: number

  @column()
  public userId: number

  @column()
  public manufacturer: string

  @column()
  public distributor: string

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
