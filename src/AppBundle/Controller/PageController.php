<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PageController extends Controller
{
    public function homeAction()
    {
        return $this->render('@App/home.html.twig');
    }

    public function orderAction()
    {
        // anonymous users are sent back to login form
        $securityContext = $this->container->get('security.authorization_checker');

        if (!$securityContext->isGranted('ROLE_USER')) {
            return $this->redirectToRoute('login');
        }

        $pizzas = $this->get('mardizza.pizza')->getPizzas();

        return $this->render('@App/order.html.twig', [
            'pizzas' => $pizzas,
        ]);
    }
}
