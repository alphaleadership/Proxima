# Proxima 🪙  

Proxima est un futur serveur proxy qui a pour objectif d'encrypter le contenu qui transite 
par le proxy dans le but de créer un réseau de contenu cacher.

## Initialisation du projet

- npm install


## Démarrage du projet 

- npm start

## Utilisation avec Firefox 
Il faut aller dans "settings => proxy => manual proxy (http & https) & set `localhost` `3000`"
Toutes les future recherches de firefox passerons donc via ce proxy a partir de maintenant.<br>

### Comment le script detecte une compatibilité ?
A la visite sur un nouveau domaine, le script recherche `_paranoia.[domain] TXT` afin de recuperer une clef de chiffrement du systeme. Cette clef est ensuite utilisé par le proxy pour une communication chiffré avec le serveur.

## Todo
- key management
- encrypted request
- interpret response
- exemple server