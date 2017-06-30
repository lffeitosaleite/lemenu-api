'use strict'

const Lucid = use('Lucid')

class RecipeIngredientMeasure extends Lucid {

  static get messages () {
    return {
      'ingredient_name.required': 'nome de ingrediente é necessário',
      'ingredient_name.max': 'nome de ingrediente deve ter no máximo 64 caracteres',
      'ingredient_name.min': 'nome de ingrediente deve ter no mínimo 2 caracteres',

      'measure_name.required': 'nome de medida é necessário',
      'measure_name.max': 'nome de medida deve ter no máximo 64 caracteres',
      'measure_name.min': 'nome de medida deve ter no mínimo 2 caracteres',

      'qty.required': 'quantidade é necessária',
      'qty.integer': 'quantidade deve ser um número'
    }
  }



  static get rules () {
		return {
			ingredient_name: 'required|min:2|max:64',
			measure_name: 'required|min:2|max:64',
			qty: 'required|integer'
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

module.exports = RecipeIngredientMeasure
