<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PageController extends Controller
{
    public function homeAction()
    {
        return $this->render('@App/home.html.twig');
    }

    public function orderAction(){

        $pizzas = $this->get('mardizza.pizza')->getPizzas();

        return $this->render('@App/order.html.twig', [
            'pizzas' => $pizzas,
        ]);
    }
}
