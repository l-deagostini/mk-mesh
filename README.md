# MK-Mesh

A fake backend for fake eCommerce platforms.

MK stands for *Market*.

There are 3 microservices:

- Catalogue
- Basket
- Order

Each microservice is written using Nest.JS on top of TS and Node.

Data is stored in a mongoDB database.

Everything can be ran using docker swarm.