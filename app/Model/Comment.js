'use strict'

const Lucid = use('Lucid')

class Comment extends Lucid {

  static get messages () {
    return {
      'comment.required': 'comentário é necessário',
      'comment.max': 'comentário deve ter no máximo 1024 caracteres',
      'comment.min': 'comentário deve ter no mínimo 2 caracteres',
    }
  }

  static get rules () {
    return {
      'comment': 'required|min:1|max:1024'
    }
  }
}

module.exports = Comment
