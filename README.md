# MK-Mesh

A fake backend for fake eCommerce platforms.

MK stands for *Market*. Since I do not like generic names on projects and programs I decided to create the suite *MK-Mesh* and all the microservices have had their names changed to fit the naming for this suite.

Here are the microservices:
- Catalogue called **MK-Cat** in the directory `./mk-cat`
- Basket called **MK-Basket** in the directory `./mk-basket`
- Order called **MK-Order** in the directory `./mk-order`

Available there is also an API gateway used to interact with the microservices. It is called **MK-User** and is in the directory `./mk-order`. It is reachable, by default, at the port `3000` and you can access the Swagger interface at `localhost:3000/api` to test out the features.

Each microservice is written using Nest.JS on top of TS and Node.

Data is stored in a mongoDB database.

Everything can be ran using Docker Compose and/or Docker Swarm.

In the `./shared` folder there are some interfaces and enums that should be placed in a common package to standardize the communication between the modules. For simplicity's sake the files are just copied to the `src` of each module after running `npm install` or can be manually copied by doing `npm run import:shared`.

While building with Docker those files are also copied, but since the folder is outside of the build context, the `src/shared` directory will be copied instead. If you have issues while building the images, make sure to have ran `npm run import:shared` at least once.

## Quickstart

If you just want to start up everything, you'll need to:
- Execute `npm run import:shared` at least once in every microservice and API gateway directory
- Run `docker compose up --build`. This will build all the components and start up a local compose
- After the compose is up you can:
    - Access the API gateway at the port `15500`
    - Express is accessible at the port `8081` with default credentials (`admin:pass`)
    - RabbitMQ management is at the port `15672` with credentials `user:password`

If you need you can change the initial data in the MongoDB instance by modifying the `init-*.js` scripts inside the `mongodb` directory, those will be copied by the compose and executed in the database. This is also where the indexes and accounts are defined.

All the microservices are configurable through environment variables.

## Notes

Due to time constraints the project is not as polished as I'd like it to be, but it is functional enough for the purpose of this exercise, in particular error handling is not done well and you may get a generic internal server error when a microservices encounters an issue.

Currently there is no check on actual users, so anywhere that a `userId` is mentioned you can use any string you'd like, it will be treated as if it were an actual user.
