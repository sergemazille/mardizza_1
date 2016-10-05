<?php

namespace AppBundle\DataFixtures\ORM;

use AppBundle\Entity\Message;
use AppBundle\Entity\Pizza;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

class LoadData implements FixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $pizzas = [
            [
                "name" => "Quatre fromages",
                "ingredients" => "tomate, mozzarella, parmesan, fromage, roquefort",
                "price" => 11.00,
                "image" => "4-fromage",
            ],

            [
                "name" => "Bressane",
                "ingredients" => "crème fraîche, fromage, poulet, oignons, persillade",
                "price" => 11.00,
                "image" => "bressane",
            ],

            [
                "name" => "Campagnola",
                "ingredients" => "crème fraîche, fromage, poulet, champignons, tabasco",
                "price" => 11.00,
                "image" => "campagnola",
            ],

            [
                "name" => "Capra",
                "ingredients" => "tomate, fromage, lard tranché fumé, chèvre",
                "price" => 11.00,
                "image" => "capra",
            ],

            [
                "name" => "Carciofo",
                "ingredients" => "tomate, fromage, jambon de parme, coeur d'artichaut",
                "price" => 11.00,
                "image" => "carciofo",
            ],

            [
                "name" => "Calzone",
                "ingredients" => "tomate, fromage, jambon, oeuf, champignons, crème fraîche",
                "price" => 10.00,
                "image" => "calzone",
            ],

            [
                "name" => "Double",
                "ingredients" => "tomate, jambon, deux oeufs, double fromage",
                "price" => 11.00,
                "image" => "double",
            ],

            [
                "name" => "Fattrice",
                "ingredients" => "crème fraîche, fromage, lardons, champignons, tomate fraîche, parmesan, deux oeufs",
                "price" => 11.00,
                "image" => "fattrice",
            ],

            [
                "name" => "Flamande",
                "ingredients" => "crème fraîche, lardons, fromage, oignons",
                "price" => 10.00,
                "image" => "flamande",
            ],

            [
                "name" => "Gondole",
                "ingredients" => "tomate, fromage, jambon, crème fraîche, grana padano rapé",
                "price" => 9.50,
                "image" => "gondole",
            ],

            [
                "name" => "Gorgonzola",
                "ingredients" => "crème fraîche, fromage, gorgonzola, poivrons",
                "price" => 10.00,
                "image" => "gorgonzola",
            ],

            [
                "name" => "Indiana",
                "ingredients" => "crème fraîche, fromage, poulet, oignons, curry",
                "price" => 11.00,
                "image" => "indiana",
            ],

            [
                "name" => "Margherita",
                "ingredients" => "tomate, mozzarella, basilic frais",
                "price" => 9.00,
                "image" => "margherita",
            ],

            [
                "name" => "Marinara",
                "ingredients" => "tomate, fromage, origan, olives",
                "price" => 8.50,
                "image" => "marinara",
            ],

            [
                "name" => "Marine",
                "ingredients" => "tomate, fromage, thon, crème fraîche",
                "price" => 9.50,
                "image" => "marine",
            ],

            [
                "name" => "Mont d'or",
                "ingredients" => "tomate, mozzarella, jambon de parme, basilic, copeaux de parmesan, tomate fraîche",
                "price" => 11.50,
                "image" => "mont-dor",
            ],

            [
                "name" => "Montanara",
                "ingredients" => "crème fraîche, fromage, reblochon, pomme de terre, lardons",
                "price" => 11.50,
                "image" => "montanara",
            ],

            [
                "name" => "Mozza",
                "ingredients" => "tomate, mozzarella, jambon",
                "price" => 10.00,
                "image" => "mozza",
            ],

            [
                "name" => "Napolitaine",
                "ingredients" => "tomate, mozzarella, câpre, anchois",
                "price" => 10.00,
                "image" => "napolitaine",
            ],

            [
                "name" => "Orientale",
                "ingredients" => "tomate, fromage, merguez, poivrons",
                "price" => 9.50,
                "image" => "orientale",
            ],

            [
                "name" => "Parme",
                "ingredients" => "Tomate, fromage, jambon de parme, grana padano rapé, crème fraîche",
                "price" => 10.50,
                "image" => "parme",
            ],

            [
                "name" => "Pescatore",
                "ingredients" => "crème fraîche, fromage, thon, persillade, oignons",
                "price" => 10.00,
                "image" => "pescatore",
            ],

            [
                "name" => "Piquante",
                "ingredients" => "tomate, fromage, chorrizo, champignons",
                "price" => 9.50,
                "image" => "piquante",
            ],

            [
                "name" => "Primavera",
                "ingredients" => "tomate, mozzarella, gorgonzola, roquette, pignon de pin, copeaux de parmesan",
                "price" => 11.50,
                "image" => "no-image",
            ],

            [
                "name" => "Provençale",
                "ingredients" => "tomate, fromage, oignons, persillade",
                "price" => 9.00,
                "image" => "provencale",
            ],

            [
                "name" => "Quattro Stagione",
                "ingredients" => "tomate, fromage, persillade, 1/4 champignons, 1/4 coeur d'artichaut, 1/4 jambon de parme, 1/4 mozzarella",
                "price" => 11.50,
                "image" => "quattro-stagione",
            ],

            [
                "name" => "Reine",
                "ingredients" => "tomate, fromage, champignons, jambon",
                "price" => 9.50,
                "image" => "reine",
            ],

            [
                "name" => "Romaine",
                "ingredients" => "tomate, fromage, jambon",
                "price" => 9.00,
                "image" => "romaine",
            ],

            [
                "name" => "Salmone",
                "ingredients" => "crème fraîche, fromage, saumon fumé, ciboulette, citron",
                "price" => 11.00,
                "image" => "salmone",
            ],

            [
                "name" => "Saucisse",
                "ingredients" => "crème fraîche, fromage, champignons, moutarde, saucisse fumée",
                "price" => 11.00,
                "image" => "saucisse",
            ],

            [
                "name" => "Spéciale",
                "ingredients" => "tomate, mozzarella, champignons, thym, persillade",
                "price" => 10.50,
                "image" => "speciale",
            ],

            [
                "name" => "Sucrée Salée",
                "ingredients" => "crème fraîche, fromage, miel, chèvre",
                "price" => 11.00,
                "image" => "sucre-salee",
            ],

            [
                "name" => "Superba",
                "ingredients" => "tomate, fromage, jambon, champignons, grana padano rapé, gorgonzola",
                "price" => 11.00,
                "image" => "superba",
            ],

            [
                "name" => "Tartare",
                "ingredients" => "tomate, fromage, boeuf haché, oignons, crème fraîche, cumin",
                "price" => 10.50,
                "image" => "tartare",
            ],

            [
                "name" => "Tartiflette",
                "ingredients" => "tomate, lardons, oignons, reblochon et raclette",
                "price" => 11.00,
                "image" => "tartiflette",
            ],

            [
                "name" => "Tartuffe",
                "ingredients" => "crème fraîche, fromage, mozzarella à la truffe, jambon de parme, huile de noisette.",
                "price" => 13.00,
                "image" => "no-image",
            ],

            [
                "name" => "Végétarienne",
                "ingredients" => "tomate, fromage, champignons, câpre, coeurs d'artichaut, tomates fraîches",
                "price" => 10.00,
                "image" => "vegetarienne",
            ],
        ];
        $messages = [
            "C'est l'heure de commander une pizza !!!",
            "Pour l'instant je suis un peu inutile...",
            "Mieux vaut une pizza que... heu... qu'aucune !!!",
            "Sélectionnez au moins une pizza... allez, pour me faire plaisir !",
            "Vincent recommande la pizza tartiflette !!!",
            "Eric recommande d'ajouter un supplément merguez !",
            "Le mardi c'est permis !",
            "Kowabunga, les Tortues Ninjas recommandent de ne pas choisir et de toutes les prendre !!!"
        ];

        foreach($pizzas as $item){
            $pizza = new Pizza();
            $pizza->setName($item['name']);
            $pizza->setIngredients($item['ingredients']);
            $pizza->setPrice($item['price']);
            $pizza->setImage($item['image']);

            $manager->persist($pizza);
            $manager->flush();
        }

        foreach($messages as $item){
            $message = new Message();
            $message->setBody($item);

            $manager->persist($message);
            $manager->flush();
        }
    }
}