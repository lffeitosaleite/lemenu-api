'use strict'

const Lucid = use('Lucid')

class Meal extends Lucid {

  menu () {
    return this.belongsTo('App/Model/Menu')
  }

  recipes () {
    return this.hasManyThrough('App/Model/Recipe', 'App/Model/Dish', 'id', 'meal_id', 'recipe_id', 'id')
  }
}

module.exports = Meal
