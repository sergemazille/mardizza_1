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
- php bin/console doctrine:fixtures:load
- sudo npm install gulp-sass --save-dev
- sudo npm install gulp-concat --save-dev
- sudo npm install del --save-dev
- gulp deploy

Don't forget to give read/write permissions to var/ directory