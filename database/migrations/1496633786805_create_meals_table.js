'use strict'

const Schema = use('Schema')

class MealsTableSchema extends Schema {

  up () {
    this.create('meals', (table) => {
      table.increments()
      table.integer('menu_id').unsigned().references('id').inTable('menus')
      table.integer('day').notNullable()
      table.enum('type', ['breakfast', 'brunch', 'lunch', 'snack', 'dinner']).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('meals')
  }

}

module.exports = MealsTableSchema
