<?php

namespace AppBundle\Service;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Asset\Context\RequestStackContext;

class PizzaService
{

    private $assetContext;

    public function __construct(EntityManager $em, RequestStackContext $assetContext)
    {
        $this->em = $em;
        $this->assetContext = $assetContext;
    }

    public function getPizzas()
    {
        return $this->em->getRepository('AppBundle:Pizza')->findAll();
    }

    public function getPizzasWithFavorites($user)
    {

        $assetsBasePath = $this->assetContext->getBasePath();

        $pizzas = $this->getPizzas();

        $userFavoritePizzas = $user->getFavoritePizzas();

        // add favorite info
        $pizzaItems = [];
        foreach ($pizzas as $pizza) {

            $pizzaItem['id'] = $pizza->getId();
            $pizzaItem['image'] = $assetsBasePath . "/assets/images/pizzas/" . $pizza->getImage() . ".jpg";
            $pizzaItem['imageSnapshot'] = $assetsBasePath . "/assets/images/pizzas/snapshots/" . $pizza->getImage() . ".jpg";
            $pizzaItem['ingredients'] = $pizza->getIngredients();
            $pizzaItem['name'] = $pizza->getName();
            $pizzaItem['price'] = $pizza->getPrice();
            $pizzaItem['isFavorite'] = $userFavoritePizzas->contains($pizza);

            $pizzaItems[] = $pizzaItem;
        }

        return $pizzaItems;
    }
}
