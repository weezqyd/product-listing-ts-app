import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
 Route.post('register', 'Auth/RegistrationController.signup')
 Route.post('login', 'Auth/LoginController.authenticate')
}).prefix('api/v1/auth')
