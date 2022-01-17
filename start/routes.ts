/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
|
*/

import './routes/auth'
import './routes/users'
import './routes/roles'
import './routes/products'
import Route from '@ioc:Adonis/Core/Route'

Route.get('/ping', async () => ({ message: 'pong' }))
