'use strict'

const Schema = use('Schema')

class CookbooksRecipesTableSchema extends Schema {

  up () {
    this.create('cookbooks_recipes', (table) => {
      table.increments()
      table.integer('cookbook_id').unsigned().references('id').inTable('cookbooks')
      table.integer('recipe_id').unsigned().references('id').inTable('recipes')
      table.timestamps()
    })
  }

  down () {
    this.drop('cookbooks_recipes')
  }

}

module.exports = CookbooksRecipesTableSchema
