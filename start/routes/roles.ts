import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post('new', 'Auth/RolesController.create')
  Route.get('show/:id', 'Auth/RolesController.findOne')
  Route.get('show', 'Auth/RolesController.getAll')
  Route.put('update/:id', 'Auth/RolesController.update')
  Route.delete('delete/:id', 'Auth/RolesController.delete')
}).prefix('api/v1/roles').middleware('auth:api')
