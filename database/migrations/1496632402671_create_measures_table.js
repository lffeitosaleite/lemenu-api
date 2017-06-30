'use strict'

const Schema = use('Schema')

class MeasuresTableSchema extends Schema {

  up () {
    this.create('measures', (table) => {
      table.increments()
      table.string('name', 80).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('measures')
  }

}

module.exports = MeasuresTableSchema
