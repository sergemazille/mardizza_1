<?php

namespace AppBundle\Service;

use AppBundle\Entity\Pizza;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Asset\Context\RequestStackContext;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;

class PizzaService
{

    private $assetContext;
    private $tokenStorage;

    public function __construct(EntityManager $em, RequestStackContext $assetContext, TokenStorage $tokenStorage)
    {
        $this->em = $em;
        $this->assetContext = $assetContext;
        $this->tokenStorage = $tokenStorage;
    }

    public function getPizzas()
    {
        return $this->em->getRepository('AppBundle:Pizza')->findAll();
    }

    /**
     * @param int $id
     * @return array
     */
    public function getPizzaWithFavorite(int $id)
    {
        $user = $this->tokenStorage->getToken()->getUser();
        $userFavoritePizzas = $user->getFavoritePizzas();
        $assetsBasePath = $this->assetContext->getBasePath();
        $pizza = $this->em->getRepository('AppBundle:Pizza')->find($id);

        $pizzaItem['id'] = $pizza->getId();
        $pizzaItem['imageUrl'] = $assetsBasePath . "/assets/images/pizzas/" . $pizza->getImage() . ".jpg";
        $pizzaItem['imageSnapshotUrl'] = $assetsBasePath . "/assets/images/pizzas/snapshots/" . $pizza->getImage() . ".jpg";
        $pizzaItem['ingredients'] = $pizza->getIngredients();
        $pizzaItem['name'] = $pizza->getName();
        $pizzaItem['price'] = $pizza->getPrice();
        $pizzaItem['isFavorite'] = $userFavoritePizzas->contains($pizza);

        return $pizzaItem;
    }

    public function getPizzasWithFavorites()
    {
        $pizzas = $this->getPizzas();

        $pizzaItems = [];
        foreach ($pizzas as $pizza) {
            $pizzaItems[] = $this->getPizzaWithFavorite($pizza->getId());
        }

        return $pizzaItems;
    }
}
