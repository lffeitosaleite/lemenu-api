'use strict'

const Schema = use('Schema')

class RecipesTableSchema extends Schema {

  up () {
    this.create('recipes', (table) => {
      table.increments()
      table.string('title', 64).notNullable()
      table.text('description').notNullable()
      table.integer('duration')
      table.integer('portions')
      table.boolean('public').defaultTo(false)
      table.string('illustration', 512)
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('views').defaultTo(0)
      table.timestamps()
      table.softDeletes()
    })
  }

  down () {
    this.drop('recipes')
  }

}

module.exports = RecipesTableSchema
