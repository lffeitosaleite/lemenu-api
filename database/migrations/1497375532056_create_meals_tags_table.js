'use strict'

const Schema = use('Schema')

class MealsTagsTableSchema extends Schema {

  up () {
    this.create('meals_tags', (table) => {
      table.increments()
      table.integer('tag_id').unsigned().references('id').inTable('tags')
      table.integer('meal_id').unsigned().references('id').inTable('meals')
      table.timestamps()
    })
  }

  down () {
    this.drop('meals_tags')
  }

}

module.exports = MealsTagsTableSchema
