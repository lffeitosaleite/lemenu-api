'use strict'

const Schema = use('Schema')

class RecipeTagsTableSchema extends Schema {

  up () {
    this.create('recipe_tags', (table) => {
      table.increments()
      table.integer('tag_id').unsigned().references('id').inTable('tags')
      table.integer('recipe_id').unsigned().references('id').inTable('recipes')
      table.timestamps()
    })
  }

  down () {
    this.drop('recipe_tags')
  }

}

module.exports = RecipeTagsTableSchema
