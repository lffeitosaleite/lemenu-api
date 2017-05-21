'use strict'

const Lucid = use('Lucid')

class Recipe extends Lucid {

  static get hidden () {
    return ['user_id']
  }

  static get messages () {
    return {
      'title.required': 'Título de receita é necessário',
      'title.max': 'Título deve ter no máximo 40 caractéres',
      'description.required': 'Descrição de receita necessária',
      'description.max': 'Descrição deve ter no máximo 5200 caractéres',
      'preparation_time.integer': 'Tempo de preparo deve ser um número',
      'preparation_time.min': 'Tempo de preparo deve ser no mínimo 1',
      'portions.integer': 'Porções deve ser um número',
      'portions.min': 'Porções deve ser no mínimo 1',
      'public.boolean': 'O campo pública deve ser verdadeiro ou falso'
    }
  }

  static get rules () {
    return {
      title: 'required|max:40',
      description: 'required|max:5200',
      preaparation_time: 'integer|min:1',
      portions: 'integer|min:1',
      public: 'boolean'
    }
  }

  /*ingredients () {
    return this.hasManyThrough('App/Model/Ingredient', 'App/Model/RecipeIngredient', 'id', 'recipe_id', 'ingredient_id', 'id')
  }*/

  ingredients () {
    return this.hasMany('App/Model/RecipeIngredient')
  }

  user () {
    return this.belongsTo('App/Model/User', 'id', 'user_id')
  }
}

module.exports = Recipe
