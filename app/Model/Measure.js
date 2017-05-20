'use strict'

const Lucid = use('Lucid')

class Measure extends Lucid {
  static get messages () {
    return {
      'name.required': 'Nome de medida é nescessário',
      'name.unique': 'O nome de medida já está em uso',
      'name.max': 'Nome deve ter no máximo 20 caractéres'
    }
  }

  static get rules () {
    return {
      name: 'required|unique:measures|max:20'
    }
  }
}

module.exports = Measure
