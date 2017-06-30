'use strict'

const Lucid = use('Lucid')
const Antl = use('Antl')

class Recipe extends Lucid {


  static get messages () {
		return {
			'title.required': 'título é necessário',
			'title.max': 'título deve ter no máximo 64 caracteres',
			'title.min': 'título deve ter no mínimo 2 caracteres',

      'description.required': 'descrição é necessária',
      'description.min': 'descrição deve ter no mínimo 2 caracteres',
      'description.max': 'descrição deve ter no máximo 2048 caracteres',

      'duration.integer': 'duração deve ser um número',

      'portions.integer': 'porções deve ser um número',

      'public.boolean': 'pública deve ser verdadeiro ou falso',

		}
	}

  static get rules () {
		return {
			title: 'required|min:2|max:64',
			description: 'required|min:2|max:2048',
			duration: 'integer',
			portions: 'integer',
			public: 'boolean',
		}
	}

  user () {
    return this.belongsTo('App/Model/User')
  }

  tags () {
    return this.hasManyThrough('App/Model/Tag', 'App/Model/RecipeTag', 'id', 'recipe_id', 'tag_id', 'id')
  }

  ingredients () {
    return this.hasManyThrough('App/Model/Ingredient', 'App/Model/RecipeIngredientMeasure', 'id', 'recipe_id', 'ingredient_id', 'id')
  }

  ingredientsMeasures () {
    return this.hasMany('App/Model/RecipeIngredientMeasure')
  }

  comments () {
    return this.hasMany('App/Model/Comment')
  }

  reviews () {
    return this.hasMany('App/Model/Review')
  }
}

module.exports = Recipe
