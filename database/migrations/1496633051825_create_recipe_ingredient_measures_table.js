'use strict'

const Schema = use('Schema')

class RecipeIngredientMeasuresTableSchema extends Schema {

  up () {
    this.create('recipe_ingredient_measures', (table) => {
      table.increments()
      table.integer('qty').notNullable()
      table.integer('measure_id').unsigned().references('id').inTable('measures')
      table.integer('ingredient_id').unsigned().references('id').inTable('ingredients')
      table.integer('recipe_id').unsigned().references('id').inTable('recipes')
      table.timestamps()
    })
  }

  down () {
    this.drop('recipe_ingredient_measures')
  }

}

module.exports = RecipeIngredientMeasuresTableSchema
