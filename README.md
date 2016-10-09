Mardizza
========

Application de gestion de choix de la pizza du mardi

# Dépendances
- Composer
- NPM
- Gulp

# Installation
- git clone https://github.com/sergemazille/mardizza.git
- cd mardizza
- composer install
- php bin/console app:reset:db
- npm install
- gulp deploy

N'oubliez pas de donner les droits d'écriture et de lecture sur le répertoire `var/`

# Note concernant Firebase
Afin de garder le contrôle de vos données, il est vivement conseillé de créer votre propre projet Firebase et de remplacer la configuration dans le fichier `./src/AppBundle/Resources/public/js/constantes.js`
Rendez-vous sur le site de Firebase pour plus d'informations sur la procédure : [https://firebase.google.com/docs/web/setup](https://firebase.google.com/docs/web/setup)
