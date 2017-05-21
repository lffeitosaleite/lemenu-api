'use strict'

const Lucid = use('Lucid')

class Ingredient extends Lucid {
  static get messages () {
    return {
      'name.required': 'Nome de ingrediente é nescessário',
      'name.unique': 'O nome de ingrediente já está em uso',
      'name.min': 'Nome deve ter no mínimo 2 caractéres',
      'name.max': 'Nome deve ter no máximo 40 caractéres'
    }
  }

  static get rules () {
    return {
      name: 'required|unique:ingredients|min:2|max:40'
    }
  }

  ingredients () {
    return this.hasManyThrough('App/Model/Recipe', 'App/Model/RecipeIngredient', 'id', 'ingredient_id', 'recipe_id', 'id')
  }

  
}

module.exports = Ingredient
