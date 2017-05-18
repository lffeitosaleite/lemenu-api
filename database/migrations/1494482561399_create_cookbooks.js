'use strict'

const Schema = use('Schema')

class CookbooksTableSchema extends Schema {

  up () {
    this.create('cookbooks', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('cookbooks')
  }

}

module.exports = CookbooksTableSchema
