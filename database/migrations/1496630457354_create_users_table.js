'use strict'

const Schema = use('Schema')

class UsersTableSchema extends Schema {

  up () {
    this.create('users', table => {
      table.increments()
      table.string('username', 80).notNullable().unique()
		  table.string('first_name', 80).notNullable()
      table.string('last_name', 80).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.boolean('active').defaultTo(false)
      table.string('avatar', 512)
      table.timestamps()
      table.softDeletes()
    })
  }

  down () {
    this.drop('users')
  }

}

module.exports = UsersTableSchema
