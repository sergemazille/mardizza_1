<?php
declare(strict_types = 1);

namespace AppBundle\Controller;

use AppBundle\Entity\Pizza;
use AppBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PizzaController extends Controller
{
    public function addFavoriteAction(Pizza $pizza)
    {
        if(! $pizza){
            throw $this->createNotFoundException('Aucune pizza trouvée.');
        }

        $user = $this->getUser();
        $user->getFavoritePizzas()->add($pizza);
        
        $this->getDoctrine()->getManager()->flush();

        return $this->json(true);
    }

    public function removeFavoriteAction(Pizza $pizza)
    {
        if(! $pizza){
            throw $this->createNotFoundException('Aucune pizza trouvée.');
        }

        $user = $this->getUser();
        $user->getFavoritePizzas()->removeElement($pizza);

        $this->getDoctrine()->getManager()->flush();

        return $this->json(true);
    }
}
