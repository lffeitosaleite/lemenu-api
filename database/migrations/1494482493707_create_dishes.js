'use strict'

const Schema = use('Schema')

class DishesTableSchema extends Schema {

  up () {
    this.create('dishes', (table) => {
      table.increments()
      table.integer('menu_id').unsigned().references('id').inTable('menus')
      table.integer('recipe_id').unsigned().references('id').inTable('recipes')
      table.integer('meal_id').unsigned().references('id').inTable('meals')
      table.date('day').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('dishes')
  }

}

module.exports = DishesTableSchema
