'use strict'

const Schema = use('Schema')

class KitchenUsersTableSchema extends Schema {

  up () {
    this.create('kitchen_users', (table) => {
      table.increments()
      table.integer('kitchen_id').unsigned().references('id').inTable('kitchens')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('kitchen_users')
  }

}

module.exports = KitchenUsersTableSchema
