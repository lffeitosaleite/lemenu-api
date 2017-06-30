'use strict'

const User = use('App/Model/User')
const Mail = use('Mail')
const Validator = use('Validator')
const EmailToken = use('App/Model/EmailToken')
const Helpers = use('Helpers')
const FS = use('fs')
const Hash = use('Hash')

class UserController {
	* emailRecovery(user) {
		var emailTokenMax = yield EmailToken.query().last()
		if(emailTokenMax == null) {
			emailTokenMax = {id: 0};
		}
		const token = EmailToken.genToken(user.id, emailTokenMax.id)
		const expiry = EmailToken.expiryTime(30)
		const emailToken = yield user.emailTokens().create({
			'token': token,
			'expiry': expiry,
			'recovery': true
		})

		yield Mail.send('emails.code', {'greetings': 'Olá '+user.first_name, 'message': 'código de recuperação de senha:', 'emailToken': emailToken, 'regards': 'Atenciosamente'}, (message)=>{
			message.to(user.email, user.first_name+' '+user.last_name)
			message.from('LeMenu')
			message.subject('Recuperação de senha')
		})
	}

	* emailWelcome(user) {
		var emailTokenMax = yield EmailToken.query().last()
		if(emailTokenMax == null) {
			emailTokenMax = {id: 0};
		}
		const token = EmailToken.genToken(user.id, emailTokenMax.id)
		const expiry = EmailToken.expiryTime(30)
		const emailToken = yield user.emailTokens().create({
			'token': token,
			'expiry': expiry
		})

		yield Mail.send('emails.code', {'greetings': 'Olá '+user.first_name, 'message': 'código de validação de usuário:', 'emailToken': emailToken, 'regards': 'Atenciosamente'}, (message)=>{
			message.to(user.email, user.first_name+' '+user.last_name)
			message.from('LeMenu')
			message.subject('Código de ativação')
		})
	}


	* signup (request, response) {
		const userData = request.all()
		const validation = yield Validator.validate(userData, User.rules, User.messages)

		if(validation.fails()) {
			response.status(400)
			.json({data:validation.messages()})
			return
		}

		const user = new User()
		user.first_name = userData.first_name
    user.last_name = userData.last_name
    user.username = userData.username
    user.email = userData.email
    user.password = userData.password
    user.active = false

		yield user.save()

		yield this.emailWelcome(user)

		response.status(201)
		.json({message: 'usuário cadastrado'})
	}

	* login (request, response) {
		const basicAuth = request.auth.authenticator('basic')
		const apiAuth = request.auth.authenticator('api')

		yield basicAuth.validate(request.input('email'), request.input('password'))
		const user = yield User.findBy('email', request.input('email'))

		if (user.active == false){
			response.status(401)
			.json({message: 'usuário precisa ser ativado', data: {toActivation: true}})
		}

		const apiToken = yield apiAuth.generate(user)

		response.status(200)
		.json({message: 'login efetuado', data: apiToken})
	}

	* setActive (request, response) {
		const now = new Date()
		const emailToken = yield EmailToken.findByOrFail('token', request.input('token'))
		const expiry = new Date(emailToken.expiry)
		if(expiry.getTime() >= now.getTime()){
			if(emailToken.recovery == true || emailToken.is_revoked == true) {
				response.status(401)
				.json({message: 'código inválido'})
				return
			}
			const user = yield emailToken.user().first()
			if(user.email !== request.input('email')) {
				response.status(401)
				.json({message: 'código não pertence ao usuário'})
				return
			}

			if(user.active == true) {
				response.status(200)
				.json({message: 'usuário já confirmado'})
				return
			}

			user.active = true
			yield user.save()

			response.status(200)
			.json({message: 'usuário confirmado'})
			return

		} else {
			response.status(401)
			.json({message: 'código expirado'})
			return
		}
	}

	* sendActivationEmail (request, response) {

		const user = yield User.findByOrFail('email', request.input('email'))
    if (user.active == false) {
    	yield this.emailWelcome(user)
  		response.status(201)
  		.json({'message': 'verifique seu email'})
    }

    response.status(200)
    .json({'message': 'usuário já confirmado'})

	}


	* sendRecoveryEmail (request, response) {

		const user = yield User.findByOrFail('email', request.input('email'))

		yield this.emailRecovery(user)
  	response.status(201)
  	.json({'message': 'verifique seu email'})

	}

	* get (request, response) {
		const user = request.authUser
		yield user.related('myRecipes').load()
		yield user.related('ingredients').load()
		yield user.related('recipes').load()
		yield user.related('menus').load()

		response.status(200)
		.json({message:'usuário resgatado', data: user})
	}

  * logout (request, response) {
    const token = request.header('Authorization').replace('Bearer ', '')
    yield request.auth.revoke(request.authUser, [token])
    response.status(200)
    .json({message: 'logout efetuado'})
  }


	* recovery (request, response) {
		const now = new Date()
		const emailToken = yield EmailToken.findByOrFail('token', request.input('token'))
		const expiry = new Date(emailToken.expiry)

		if (expiry.getTime() >= now.getTime()){
			if(emailToken.recovery == false || emailToken.is_revoked == true) {
				response.status(200)
				.json({message: 'código inválido'})
				return
			}

			const user = yield emailToken.user().first()

			let passwordData = {
				'password': request.input('password'),
				'password_confirmation': request.input('password_confirmation')
			}
			const validation = yield Validator.validate(passwordData, {
				password: 'required|confirmed|min:6|max:128'
			}, {
				'password.required': 'senha necessária',
				'password.confirmed': 'senha deve ser confimarda corretamente',
				'password.min': 'senha deve ter no mínimo 6 caracteres',
				'password.max': 'senha deve ter no máximo 128 caracteres'
			})

			if(validation.fails()) {
				response.status(400)
				.json({data:validation.messages()})
				return
			}

			user.password = yield Hash.make(request.input('password'))
			yield user.save()

			emailToken.is_revoked = true
			yield emailToken.save()

			response.status(200)
			.json({message: 'senha recuperada'})

			return

		} else {
			response.status(401)
			.json({message: 'código expirado'})
			return
		}
	}

	* updatePassword (request, response) {
		const basicAuth = request.auth.authenticator('basic')
		const apiAuth = request.auth.authenticator('api')

		const user = request.authUser


		yield basicAuth.validate(user.email, request.input('old_password'))

		let passwordData = {
			'password': request.input('password'),
			'password_confirmation': request.input('password_confirmation')
		}
		const validation = yield Validator.validate(passwordData, {
			password: 'required|confirmed|min:6|max:128'
		}, {
			'password.required': 'senha necessária',
			'password.confirmed': 'senha deve ser confimarda corretamente',
			'password.min': 'senha deve ter no mínimo 6 caracteres',
			'password.max': 'senha deve ter no máximo 128 caracteres'
		})

		if(validation.fails()) {
			response.status(400)
			.json({data:validation.messages()})
			return
		}

		user.password = yield Hash.make(request.input('password'))
		yield user.save()
		response.status(200)
		.json({messages: 'senha atualziada'})
	}

	* remove (request, response) {
		request.authUser.active = false
		yield request.authUser.save()

		yield request.auth.revoke(request.authUser)

		yield request.authUser.delete()
	}
/*


  * remove (request, response){
    request.authUser.active = false
    yield request.authUser.save()

    yield request.auth.revoke(request.authUser)

    yield request.authUser.delete()

    response.status(200)
    .json({message: 'user deleted'})
  }



  * removeAvatar (request, response) {
    if (request.authUser.avatar !== null) {
      FS.unlink(request.authUser.avatar, (err)=> {
        if(err)
          throw err
      })

      request.authUser.avatar = null
      yield request.authUser.save()
    }
    response.status(200)
    .json({message: 'avatar removido'})
  }

  * updateAvatar (request, response) {
    const avatar = request.file('avatar', {
      maxSize: '2mb',
      allowedExtensions: ['jpg', 'png', 'jpeg']
    })

    const fileName = `${new Date().getTime()}.${avatar.extension()}`
    yield avatar.move(Helpers.storagePath(), fileName)

    if (!avatar.moved()) {
      response.badRequest(avatar.errors())
      return
    }

    if (request.authUser.avatar !== null) {
      FS.unlink(request.authUser.avatar, (err)=> {
        if(err)
          throw err
      })
    }

    request.authUser.avatar = avatar.uploadPath()
    yield request.authUser.save()
    response.status(200)
    .json({message:'avatar enviado'})
  }








*/
}

module.exports = UserController
