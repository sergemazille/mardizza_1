<?php
declare(strict_types = 1);

namespace AppBundle\Controller;

use AppBundle\Entity\Pizza;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class PizzaController extends Controller
{
    /**
     * @param Pizza $pizza
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function getPizzaAction(Pizza $pizza) : Response
    {
        $user = $this->getUser();
        $favorites = $user->getFavoritePizzas();
        $favorite = $favorites->contains($pizza);

        return $this->render('@App/partials/_pizza_detail_modal.html.twig', [
            'favorite' => $favorite,
            'pizza' => $pizza,
        ]);
    }

    public function addFavoriteAction(Pizza $pizza)
    {
        if (!$pizza) {
            throw $this->createNotFoundException('Aucune pizza trouvée.');
        }

        $user = $this->getUser();
        $favorites = $user->getFavoritePizzas();

        // check if pizza isn't already in user's favorites
        if ($favorites->contains($pizza)) {
            return $this->json(false);
        }

        $favorites->add($pizza);
        $this->getDoctrine()->getManager()->flush();
        return $this->json(true);
    }

    public function removeFavoriteAction(Pizza $pizza)
    {
        if (!$pizza) {
            throw $this->createNotFoundException('Aucune pizza trouvée.');
        }

        $user = $this->getUser();
        $favorites = $user->getFavoritePizzas();

        // return false if pizza isn't in user's favorites
        if (!$favorites->contains($pizza)) {
            return $this->json(false);
        }

        $favorites->removeElement($pizza);

        $this->getDoctrine()->getManager()->flush();

        return $this->json(true);
    }
}
