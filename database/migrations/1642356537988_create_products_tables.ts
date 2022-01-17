import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up() {


    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.text('description')
      table.string('type').index()
      table.string('category').index()
      table.string('manufacturer').index()
      table.string('distributor').index()
      table.string('currency').defaultTo('KES')
      table.integer('unit_cost')
      table.integer('quantity')
      table.integer('user_id')
        .references('id')
        .inTable('users')
        .onDelete('cascade')
      table.timestamp('created_at', {useTz: true})
      table.timestamp('updated_at', {useTz: true})
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
