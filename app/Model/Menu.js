'use strict'

const Lucid = use('Lucid')

class Menu extends Lucid {
  static get messages () {
    return {
      'name.required': 'nome é necessário',
      'name.max': 'nome deve ter no máximo 64 caracteres',
      'name.min': 'nome deve ter no mínimo 2 caracteres',

      'begin.required': 'começo é necessário',
      'begin.afteroffset': 'começo deve ser uma data a partir de hoje',

      'end.required': 'fim é necessário',
      'end.after': 'fim deve ser uma data depois do começo',

      'breakfast.boolean': 'café da manhã deve ser verdadeiro ou falso',

      'brunch.boolean': 'lanche da manhã deve ser verdadeiro ou falso',

      'lunch.boolean': 'almoço deve ser verdadeiro ou falso',

      'snack.boolean': 'lanche deve ser verdadeiro ou falso',

      'dinner.boolean': 'jantar deve ser verdadeiro ou falso',

    }
  }
  static rules (begin_input) {
    begin_input = new Date(begin_input)

    return {
			name: 'required|min:2|max:64',
			begin: 'required|after_offset_of:-1,days',
      end: 'required|after:'+begin_input,
			breakfast: 'boolean',
      brunch: 'boolean',
      lunch: 'boolean',
      snack: 'boolean',
      dinner: 'boolean',
		}
  }

  meals () {
    return this.hasMany('App/Model/Meal')
  }

  user () {
    return this.belongsTo('App/Model/User')
  }
}

module.exports = Menu
