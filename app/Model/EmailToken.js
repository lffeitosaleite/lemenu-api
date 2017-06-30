'use strict'

const Lucid = use('Lucid')

class EmailToken extends Lucid {

	static genToken (userId, maxId) {
		return parseFloat(userId.toString() + maxId.toString() + Date.now().toString()).toString(36)
	}

	static expiryTime (min) {
		const now = new Date()
		return new Date(now.getTime() + min*60000)
	}

	revokeToken () {
		this.is_revoked = true
	}

	user () {
    return this.belongsTo('App/Model/User')
  }
}

module.exports = EmailToken
