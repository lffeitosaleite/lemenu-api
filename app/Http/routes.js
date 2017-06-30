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

Route.group('user', function() {
	Route.post('signup', 'UserController.signup').middleware('unauth')//okay
	Route.post('login', 'UserController.login').middleware('unauth')//okay
	Route.get('logout', 'UserController.logout').middleware('auth')//okay
	Route.get('', 'UserController.get').middleware('auth')//okay
	Route.post('activation-email', 'UserController.sendActivationEmail').middleware('unauth')//okay
	Route.put('activate', 'UserController.setActive').middleware('unauth')//okay
	//Route.put('update-avatar', 'UserController.updateAvatar').middleware('auth')//okay
	Route.put('update-password', 'UserController.updatePassword').middleware('auth')//okay
	//Route.put('remove-avatar', 'UserController.removeAvatar').middleware('auth')//okay
	Route.post('recovery-email', 'UserController.sendRecoveryEmail').middleware('unauth')//okay
	Route.put('recovery', 'UserController.recovery').middleware('unauth')//okay
	Route.delete('', 'UserController.remove').middleware('auth')//okay
}).prefix('api/user')

Route.group('ingredient', function() {
	Route.put('/add-to-user', 'IngredientController.addToUser').middleware('auth')//okay
	Route.delete('/remove-from-user/:id', 'IngredientController.removeFromUser').middleware('auth')//okay
}).prefix('api/ingredient')

Route.group('tag', function() {
	Route.put('/add-to-recipe/:id', 'TagController.addToRecipe').middleware('auth')//okay
	Route.delete('/remove-from-recipe/:recipe_id/:tag_id', 'TagController.removeFromRecipe').middleware('auth')//okay
}).prefix('api/tag')

Route.group('recipe', function() {
	Route.get('', 'RecipeController.getAll')//okay
	Route.get('/:id', 'RecipeController.get')//okay
	Route.post('', 'RecipeController.create').middleware('auth')//okay
	Route.put('ingredient/:id', 'RecipeController.addIngredient').middleware('auth')//okay
	Route.delete('ingredient/:id', 'RecipeController.removeIngredient').middleware('auth')//okay
	Route.put('edit/:id', 'RecipeController.edit').middleware('auth')//okay
	Route.put('/add-to-user/:id', 'RecipeController.addToUser').middleware('auth')//okay
	Route.delete('/remove-from-user/:id', 'RecipeController.removeFromUser').middleware('auth')//okay
	Route.delete('/:id', 'RecipeController.remove').middleware('auth')//okay
	Route.get('search/*', 'RecipeController.search')//okay
	Route.get('search-by-ingredients/*', 'RecipeController.searchByIngredients')//okay
	Route.get('search-by-tags/*', 'RecipeController.searchByTags')//okay
	Route.put('view/:id', 'RecipeController.view')//okay
	Route.post('comment/:id', 'RecipeController.comment')//okay
	Route.put('review/:id', 'RecipeController.review')//okay
}).prefix('api/recipe')

Route.group('menu', function() {
	Route.post('', 'MenuController.create').middleware('auth')//okay
	Route.get('', 'MenuController.getAll').middleware('auth')//okay
	Route.get('/:id', 'MenuController.get').middleware('auth')//okay
	Route.put('/:id', 'MenuController.edit').middleware('auth')//okay
	Route.delete('/:id', 'MenuController.remove').middleware('auth')//okay
	Route.put('recipe/:meal_id/:recipe_id', 'MenuController.addRecipe').middleware('auth')//okay
	Route.get('recipe/:id', 'MenuController.suggestion').middleware('auth')//okay
	Route.delete('recipe/:meal_id/:recipe_id', 'MenuController.removeRecipe').middleware('auth')//okay
}).prefix('api/menu')
