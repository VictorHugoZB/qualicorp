# Desafio Qualicorp

Desafio proposto pela Qualicorp para a vaga de Analista Desenvolvedor Fullstack Jr.
O desafio foi desenvolvido utilizando a **versão v10.24.1 do Node**.

Na pasta client encontra-se o front-end desenvolvido em Vue.js e utilizando a bilbioteca Vuetify, enquanto na pasta backend encontra-se o servidor desenvolvido em node.js utilizando o Restify e o banco de dados neo4j.

## Solução

Para solução do desafio, foi desenvolvido um sistema de gerenciamento de Todo's, permitindo que o usuário adicione, edite, delete e visualize Todo's. Para isso, também foi desenvolvido de forma simplificada um sistema de Login utilizando tokens JWT, permitindo gerenciar os Todo's de acordo com o usuário. Para salvar os dados, foi utilizado o banco de dados neo4j e o seu serviço de gerenciamento na nuvem: neo4j Aura. O banco de dados possui dois tipos de nós: User e Todo, e uma relação na forma User -[CREATED]-> Todo.

Observação: O arquivo **.env do backend** foi **mantido no github de forma proposital** para facilitar a execução do aplicativo, o qual **não seria realizado em uma aplicação real**.

## Execução

Executar o backend: no diretório backend, rodar `npm install` e em seguida `npm start`

Executar o frontend: no diretório client, rodar `npm install`, `npm build` e, em seguida, `npm start`.
