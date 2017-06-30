'use strict'

const Validator = use('Validator')
const Menu = use('App/Model/Menu')
const Meal = use('App/Model/Meal')
const Recipe = use('App/Model/Recipe')
const Dish = use('App/Model/Dish')
const User = use('App/Model/User')
class MenuController {
  * suggestion (request, response) {
    const meal = yield Meal.findOrFail(request.param('id'))
    const user = yield User.query().where('id', request.currentUser.id)
    .with('ingredients').first()

    const ingredients = Array.from(user.relations.ingredients)

    let ingredientsQuery = new Array()

    for(var i=0; i<ingredients.length; i++){
      ingredientsQuery.push(ingredients[i].name)
    }

    var tagsQuery = [meal.type]

    switch(meal.type) {
      case 'breakfast':
        tagsQuery.push('café da manhã')
        break
      case 'brunch':
        tagsQuery.push('lanche da manhã')
        break
      case 'lunch':
        tagsQuery.push('almoço')
        break
      case 'snack':
        tagsQuery.push('lanche')
        break
      case 'dinner':
        tagsQuery.push('jantar')
        break
    }

    var aux;
    var firstIngredient = false
    var firstTag = false
    var ingredientRecipesIds = new Array()
    var tagRecipesIds = new Array()

    for (var i=0; i<ingredientsQuery.length; i++){
      aux = yield Recipe.query().where('public', true)
      .whereHas('ingredients', (builder)=>{
        builder.where('name', ingredientsQuery[i])
      }).pluck('id')
      aux = Array.from(aux)
      if(aux.length>0) {
        if(!firstIngredient){
          ingredientRecipesIds = aux
          firstIngredient = true
        } else {
          ingredientRecipesIds = aux.filter(x=>recipesIds.indexOf(x)>=0)
        }
      }
    }

    for (var i=0; i<tagsQuery.length; i++){
      aux = yield Recipe.query().where('public', true)
      .whereHas('tags', (builder)=>{
        builder.where('name', tagsQuery[i])
      }).pluck('id')
      aux = Array.from(aux)
      if(aux.length>0) {
        if(!firstTag){
          tagRecipesIds = aux
          firstTag = true
        } else {
          tagRecipesIds = aux.filter(x=>recipesIds.indexOf(x)>=0)
        }
      }
    }

    var myRecipes = yield Recipe.query().where('user_id', user.id).pluck('id')
    myRecipes = Array.from(myRecipes)

    const recipesIds = myRecipes.concat(tagRecipesIds).concat(ingredientRecipesIds)

    const recipes = yield Recipe.query().whereIn('id', recipesIds)
    .with('ingredientsMeasures', 'tags')
    .scope('ingredientsMeasures', (builder)=>{builder.with('ingredient', 'measure')})
    .orderBy('views', 'desc').limit(5).fetch()

    response.status(200)
    .json({message: 'receitas resgatadas', data: recipes})
  }
  * removeRecipe (request, response) {
    const dish = yield Dish.query().where('meal_id', request.param('meal_id'))
    .where('recipe_id', request.param('recipe_id')).first()
    const meal = yield Meal.findOrFail(request.param('meal_id'))
    const menu = yield Menu.findOrFail(meal.menu_id)

    if(dish == null) {
      response.status(404)
      .json({message: 'recurso não encontrado'})
      return
    }

    if(menu.user_id != request.authUser.id) {
      response.status(401)
      .json({message: 'credenciais inválidas'})
      return
    }

    yield dish.delete()

    response.status(200)
    .json({message: 'receita removida'})
  }

  * addRecipe (request, response) {
      const meal = yield Meal.findOrFail(request.param('meal_id'))
      const recipe = yield Recipe.findOrFail(request.param('recipe_id'))
      const menu = yield Menu.findOrFail(meal.menu_id)

      if(menu.user_id != request.authUser.id) {
        response.status(401)
        .json({message: 'credenciais inválidas'})
      }

      if(recipe.public == false && recipe.user_id != request.authUser.id){
        response.status(401)
        .json({message: 'credenciais inválidas'})
      }

      const dish = yield Dish.findOrCreate({
        meal_id: meal.id,
        recipe_id: recipe.id
      }, {
        meal_id: meal.id,
        recipe_id: recipe.id
      })

      response.status(201)
      .json({message:'receita adicionada'})
  }

  * remove (request, response) {
      const menu = yield Menu.findOrFail(request.param('id'))
      if(menu.user_id != request.authUser.id) {
        response.status(401)
        .json({message: 'credenciais inválidas'})
      }

      yield menu.delete()

      response.status(200)
      .json({message: 'cardápio removido'})
  }

  * edit (request, response) {
    const menu = yield Menu.findOrFail(request.param('id'))
    if(menu.user_id != request.authUser.id) {
      response.status(401)
      .json({message: 'credenciais inválidas'})
    }

    const validation = yield Validator.validate({name: request.input('name')},
    {
      name: 'required|min:2|max:64',
    }, {
      'name.required': 'nome é necessário',
      'name.max': 'nome deve ter no máximo 64 caracteres',
      'name.min': 'nome deve ter no mínimo 2 caracteres',
    })
    if(validation.fails()) {
      response.status(400)
      .json({data:validation.messages()})
      return
    }

    menu.name = request.input('name')
    yield menu.save()

    response.status(200)
    .json({message: 'cardápio atualizado', data: menu})
  }

  * get (request, response) {
      const menu = yield Menu.query().where('id', request.param('id'))
      .with('meals').scope('meals', (builder)=>{builder.with('recipes')}).first()

      //const menu = yield Menu.findOrFail(request.param('id'))

      if(menu.user_id != request.currentUser.id) {
        response.status(401)
        .json({message: 'credenciais inválidas'})
      }
      //yield menu.related('meals').load()

      response.status(200)
      .json({message: 'cardápio resgatado', data: menu})
  }

  * getAll (request, response) {
    const menus = yield Menu.query().where('user_id', request.currentUser.id)
    .with('meals').fetch()

    response.status(200)
    .json({message: 'cardápios resgatados', data: menus})
  }

  * create (request, response) {
    const menuData = request.all()

    const validation = yield Validator.validate(menuData, Menu.rules(menuData.begin), Menu.messages)
    if(validation.fails()) {
      response.status(400)
      .json({data:validation.messages()})
      return
    }

    const menu = new Menu()
    menu.fill(menuData)
    menu.user_id = request.authUser.id
    menu.breakfast = menuData.breakfast || false
    menu.brunch = menuData.brunch || false
    menu.lunch = menuData.lunch || false
    menu.snack = menuData.snack || false
    menu.dinner = menuData.dinner || false
    yield menu.save()

    const begin = new Date(menu.begin)
    const end = new Date(menu.end)

    var timeDiff = Math.abs(begin.getTime() - end.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    diffDays++
    for(var i=0; i<diffDays; i++){
      if(menu.breakfast == true) {
        yield menu.meals().create({
          'type': 'breakfast',
          'day': i
        })
      }

      if(menu.brunch == true) {
        yield menu.meals().create({
          'type': 'brunch',
          'day': i
        })
      }

      if(menu.lunch == true) {
        yield menu.meals().create({
          'type': 'lunch',
          'day': i
        })
      }

      if(menu.snack == true) {
        yield menu.meals().create({
          'type': 'snack',
          'day': i
        })
      }

      if(menu.dinner == true) {
        yield menu.meals().create({
          'type': 'dinner',
          'day': i
        })
      }
    }

    response.status(201)
    .json({message: 'cardápio criado'})
  }
}

module.exports = MenuController
