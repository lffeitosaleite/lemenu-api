'use strict'

const Schema = use('Schema')

class MenusTableSchema extends Schema {

  up () {
    this.create('menus', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('name', 80).notNullable()
      table.date('begin').notNullable()
      table.date('end').notNullable()
      table.boolean('breakfast').default(false)
      table.boolean('brunch').default(false)
      table.boolean('lunch').default(false)
      table.boolean('snack').default(false)
      table.boolean('dinner').default(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('menus')
  }

}

module.exports = MenusTableSchema
