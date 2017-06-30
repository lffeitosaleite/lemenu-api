'use strict'

const Schema = use('Schema')

class ReviewsTableSchema extends Schema {

  up () {
    this.create('reviews', (table) => {
      table.increments()
	    table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('recipe_id').unsigned().references('id').inTable('recipes')
      table.integer('rate').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('reviews')
  }

}

module.exports = ReviewsTableSchema
