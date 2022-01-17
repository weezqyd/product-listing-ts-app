import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserRole extends BaseSchema {
  protected tableName = 'user_role'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id')
      table.integer('role_id')
      table.index(['user_id', 'role_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
