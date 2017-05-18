'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.on('/').render('welcome')

Route.group('ingredient', function () {
  Route.post('', 'IngredientController.create').middleware('auth')
  Route.get('', 'IngredientController.getAll')
}).prefix('api/ingredient')

Route.group('user', function () {
  Route.post('signup', 'UserController.signup')
  Route.post('login', 'UserController.login').middleware('unauth')
  Route.get('logout', 'UserController.logout').middleware('auth')
  Route.get('logoutothers', 'UserController.logoutOthers').middleware('auth')
  Route.post('updatepassword', 'UserController.updatePassword').middleware('auth')
}).prefix('api/user')
