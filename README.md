# Products Listing Demo app AdonisJS and Typescript

## Installation
To set up this demo application in your local environment, clone this repository and install dependencies
```shell
$ git clone https://github.com/weezqyd/product-listing-ts-app
$ cd product-listing-ts-app
$ yarn install
$ cp .env.example .env
```
Open the `.env` file and change the values if need be, but the default values are OK. All you need from now is `docker` and `docker-compose`

```shell
$ docker composer up --build
```
The above command will set up and configure the app with `PostgresSQL 13` and `pgAdmin4` to access the user interface for pgadmin4 go to `http://localhost:9090` and use the credentials to login

```
username: admin@example.com
password: secret
```
The default database configs are as below.
```shell
DB_HOST=postgres
DB_PORT=5432
DB_USER=homestead
DB_PASSWORD=secret
```

You will have to create a separate database that will be used to run tests, the naming convention is `${DB_NAME}_test` for example `product_listing_test` 

Now try to navigate to the url `http://localhost:8080/ping` the following message will be displayed
```json
{"message":"pong"}
```

### Running Unit Tests
Once you have configured the test database, run the test now

```shell
docker exec -it product-listing yarn test
```
