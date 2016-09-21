<?php

namespace AppBundle\Service;

use Doctrine\ORM\EntityManager;

class PizzaService
{
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    public function getPizzas()
    {
        return $this->em->getRepository('AppBundle:Pizza')->findAll();
    }

    public function getPizzasWithFavorites($user)
    {
        $pizzas = $this->getPizzas();

        $userFavoritePizzas = $user->getFavoritePizzas();

        // add favorite info
        $pizzaItems = [];
        foreach ($pizzas as $pizza) {

            $pizzaItem['id'] = $pizza->getId();
            $pizzaItem['image'] = $pizza->getImage();
            $pizzaItem['ingredients'] = $pizza->getIngredients();
            $pizzaItem['name'] = $pizza->getName();
            $pizzaItem['price'] = $pizza->getPrice();
            $pizzaItem['isFavorite'] = $userFavoritePizzas->contains($pizza);

            $pizzaItems[] = $pizzaItem;
        }

        return $pizzaItems;
    }
}
