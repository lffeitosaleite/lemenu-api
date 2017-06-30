'use strict'

const Schema = use('Schema')

class EmailTokensTableSchema extends Schema {

  up () {
    this.create('email_tokens', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('token', 128).notNullable().unique()
      table.timestamp('expiry')
      table.boolean('recovery').notNullable().defaultTo(false)
      table.boolean('is_revoked').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('email_tokens')
  }

}

module.exports = EmailTokensTableSchema
