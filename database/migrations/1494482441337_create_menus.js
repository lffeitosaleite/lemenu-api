'use strict'

const Schema = use('Schema')

class MenusTableSchema extends Schema {

  up () {
    this.create('menus', (table) => {
      table.increments()
      table.string('name', 40).notNullable()
      table.date('begin').notNullable()
      table.date('end').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('kitchen_id').unsigned().references('id').inTable('kitchens')
      table.timestamps()
    })
  }

  down () {
    this.drop('menus')
  }

}

module.exports = MenusTableSchema
