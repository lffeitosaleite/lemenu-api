'use strict'

const Lucid = use('Lucid')
const Antl = use('Antl')

class Ingredient extends Lucid {

  static get messages () {
		return {
			'name.required': 'nome é necessário',
			'name.max': 'nome deve ter no máximo 64 caracteres',
			'name.min': 'nome deve ter no mínimo 2 caracteres',
		}
	}

  static get rules () {
    return {
      name: 'required|min:2|max:64',
    }
  }

  recipes () {
    return this.hasManyThrough('App/Model/Recipe', 'App/Model/RecipeIngredientMeasure', 'id',  'ingredient_id', 'recipe_id', 'id')
  }



}

module.exports = Ingredient
