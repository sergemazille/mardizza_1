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
- php bin/console doctrine:database:create [--force]
- php bin/console doctrine:fixtures:load
- [sudo] npm install
- gulp deploy

N'oubliez pas de donner les droits d'écriture et de lecture sur le répertoire `var/`