'use strict'

const Schema = use('Schema')

class DishesTableSchema extends Schema {

  up () {
    this.create('dishes', (table) => {
      table.increments()
      table.integer('meal_id').unsigned().references('id').inTable('meals')
      table.integer('recipe_id').unsigned().references('id').inTable('recipes')
      table.timestamps()
    })
  }

  down () {
    this.drop('dishes')
  }

}

module.exports = DishesTableSchema
