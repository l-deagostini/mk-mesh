# MK-Mesh

A fake backend for fake eCommerce platforms.

MK stands for *Market*. Since I do not like generic names on projects and programs I decided to create the suite *MK-Mesh* and all the microservices have had their names changed to fit the naming for this suite.

Here are the microservices:
- Catalogue called **MK-Cat** in the directory `./mk-cat`
- Basket
- Order

Each microservice is written using Nest.JS on top of TS and Node.

Data is stored in a mongoDB database.

Everything can be ran using docker compose. Will add docker swarm implementation later.