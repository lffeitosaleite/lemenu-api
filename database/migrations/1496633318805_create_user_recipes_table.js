'use strict'

const Schema = use('Schema')

class UserRecipesTableSchema extends Schema {

  up () {
    this.create('user_recipes', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('recipe_id').unsigned().references('id').inTable('recipes')
      table.timestamps()
    })
  }

  down () {
    this.drop('user_recipes')
  }

}

module.exports = UserRecipesTableSchema
