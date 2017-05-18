'use strict'

const Schema = use('Schema')

class RecipeIngredientsTableSchema extends Schema {

  up () {
    this.create('recipe_ingredients', (table) => {
      table.increments()
      table.integer('ingredient_id').unsigned().references('id').inTable('ingredients')
      table.integer('measure_id').unsigned().references('id').inTable('measures')
      table.integer('recipe_id').unsigned().references('id').inTable('recipes')
      table.decimal('qty').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('recipe_ingredients')
  }

}

module.exports = RecipeIngredientsTableSchema
