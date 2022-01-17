import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post('new', 'Users/UsersController.create')
  Route.get('show/:id', 'Users/UsersController.findOne')
  Route.get('show', 'Users/UsersController.findAll')
  Route.put('update/:id', 'Users/UsersController.update')
  Route.delete('delete/:id', 'Users/UsersController.delete')
}).prefix('api/v1/users').middleware('auth:api')
