'use strict'

const Schema = use('Schema')

class KitchenIngredientsTableSchema extends Schema {

  up () {
    this.create('kitchen_ingredients', (table) => {
      table.increments()
      table.integer('kitchen_id').unsigned().references('id').inTable('kitchens')
      table.integer('ingredient_id').unsigned().references('id').inTable('ingredients')
      table.timestamps()
    })
  }

  down () {
    this.drop('kitchen_ingredients')
  }

}

module.exports = KitchenIngredientsTableSchema
