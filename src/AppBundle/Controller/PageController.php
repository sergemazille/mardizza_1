<?php

namespace AppBundle\Controller;

use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PageController extends Controller
{
    public function homeAction()
    {
        // already logged in users are sent directly to order page
        $user = $this->getUser();
        if ($user) {
            return $this->redirectToRoute('order');
        }

        return $this->render('@App/home.html.twig', [
            'user' => $user,
        ]);
    }

    public function orderAction()
    {
        // anonymous users are sent back to login form
        $user = $this->getUser();
        if (!$user) {
            return $this->redirectToRoute('login');
        }

        $em = $this->getDoctrine()->getManager();
        $orderRepository = $em->getRepository('AppBundle:Order');
        $today = new DateTime('TODAY');

        // check if there's already an order today
        $todaysOrder = $orderRepository->findOneBy(['createdAt' => $today]);

        // else create a new one
        if(! $todaysOrder){
            $todaysOrder = $this->get('mardizza.order');
            $todaysOrder->setCreatedAt($today);
            $todaysOrder->setUpdatedAt($today);

            $em->persist($todaysOrder);
            $em->flush();
        }

        // Welcome message
        $this->addFlash("success", "Bon appétit !!!");

        // get pizzas
        $pizzas = $this->get('mardizza.pizza_service')->getPizzasWithFavorites();

        return $this->render('@App/order.html.twig', [
            'pizzas' => $pizzas,
            'user' => $user,
            'order' => $todaysOrder,
        ]);
    }
}
