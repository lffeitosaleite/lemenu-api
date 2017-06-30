'use strict'

const Schema = use('Schema')

class TagsTableSchema extends Schema {

  up () {
    this.create('tags', (table) => {
      table.increments()
      table.string('name', 64).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('tags')
  }

}

module.exports = TagsTableSchema
