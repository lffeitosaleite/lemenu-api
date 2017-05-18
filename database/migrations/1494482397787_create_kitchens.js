'use strict'

const Schema = use('Schema')

class KitchensTableSchema extends Schema {

  up () {
    this.create('kitchens', (table) => {
      table.increments()
      table.string('name', 60).notNullable().unique()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('kitchens')
  }

}

module.exports = KitchensTableSchema
