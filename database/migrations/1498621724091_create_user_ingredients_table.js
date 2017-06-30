'use strict'

const Schema = use('Schema')

class CreateUserIngredientsTableTableSchema extends Schema {

  up () {
    this.create('user_ingredients', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('ingredient_id').unsigned().references('id').inTable('ingredients')
      table.timestamps()
    })
  }

  down () {
    this.drop('user_ingredients')
  }

}

module.exports = CreateUserIngredientsTableTableSchema
