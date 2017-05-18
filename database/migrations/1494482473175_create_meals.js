'use strict'

const Schema = use('Schema')

class MealsTableSchema extends Schema {

  up () {
    this.create('meals', (table) => {
      table.increments()
      table.string('name', 40).notNullable()
      table.time('hour').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('meals')
  }

}

module.exports = MealsTableSchema
