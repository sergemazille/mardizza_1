<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class HomeController extends Controller
{
    public function homeAction()
    {
        $pizzas = $this->get('mardizza.pizza')->getPizzas();

        return $this->render('@App/home.html.twig', compact('pizzas'));
    }
}
