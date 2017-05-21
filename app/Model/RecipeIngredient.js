'use strict'

const Lucid = use('Lucid')

class RecipeIngredient extends Lucid {
  static get hidden () {
    return ['recipe_id', 'ingredient_id', 'measure_id', 'id']
  }

  static get messages () {
    return {
      'qty.required': 'Quantidade é especificar a quantidade',
      'qty.integer': 'Quantidade deve ser um número',
      'qty.min': 'Quantidade deve ser no mínimo 1'
    }
  }

  static get rules () {
    return {
      qty: 'required|integer|min:1',
    }
  }

  recipe () {
    return this.belongsTo('App/Model/Recipe')
  }

  ingredient () {
    return this.belongsTo('App/Model/Ingredient')
  }

  measure () {
    return this.belongsTo('App/Model/Measure')
  }

}

module.exports = RecipeIngredient
