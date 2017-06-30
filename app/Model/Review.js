'use strict'

const Lucid = use('Lucid')

class Review extends Lucid {
  static get messages () {
		return {
			'rate.required': 'nota é necessária',
			'rate.integer': 'nota deve ser um número',
      'rate.range': 'nota deve ser entre 0 e 5'
		}
	}

  static get rules () {
    return {
      rate: 'required|integer|range:0,5',
    }
  }
}

module.exports = Review
