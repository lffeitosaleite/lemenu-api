'use strict'

const Lucid = use('Lucid')

class Measure extends Lucid {

  static get messages () {
    return {
      'name.required': Antl.formatMessage('messages.field.required', {field:Antl.formatMessage('messages.name')}),
      'name.max': Antl.formatMessage('messages.field.max', {field:Antl.formatMessage('messages.name'), max:'64'}),
      'name.min': Antl.formatMessage('messages.field.min', {field:Antl.formatMessage('messages.name'), min:'2'}),
    }
  }

  static get rules () {
    return {
      name: 'required|min:2|max:64',
    }
  }
}

module.exports = Measure
