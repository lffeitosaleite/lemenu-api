'use strict'

const Schema = use('Schema')

class RecipesTableSchema extends Schema {

  up () {
    this.create('recipes', (table) => {
      table.increments()
      table.string('title', 40).notNullable()
      table.text('description').notNullable()
      table.integer('preparation_time')
      table.integer('portions')
      table.boolean('public').defaultTo(false)
      table.integer('views').defaultTo(0)
      table.integer('uses').defaultTo(0)
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('recipes')
  }

}

module.exports = RecipesTableSchema
