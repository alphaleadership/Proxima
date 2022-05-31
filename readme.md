# Proxima 🪙  

Proxima est un futur serveur proxy qui a pour objectif d'encrypter le contenu qui transite 
par le proxy dans le but de créer un réseau de contenu cacher.

## Initialisation du projet

- npm install


## Démarrage du projet 

- npm start

## Utilisation postman 

Exemple de requête :  
  
- GET : localhost:3000/json_placeholder/posts/1   
[Authorization] = cequevousvoulez  
  
- POST : localhost:3000/json_placeholder/posts  
[Authorization] = cequevousvoulez  
[Body] = {  
    "title" : "test",  
    "body" : "test",  
    "userId" : 1   
}  