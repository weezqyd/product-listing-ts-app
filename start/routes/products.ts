import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.post('new', 'Products/ProductsController.create')
  Route.get('show/:id', 'Products/ProductsController.findOne')
  Route.get('show', 'Products/ProductsController.showAll')
  Route.get('search', 'Products/ProductsController.search')
  Route.put('update/:id', 'Products/ProductsController.update')
  Route.delete('delete/:id', 'Products/ProductsController.delete')
}).prefix('api/v1/products').middleware('auth:api')
