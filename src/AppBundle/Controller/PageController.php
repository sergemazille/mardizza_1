<?php

namespace AppBundle\Controller;

use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PageController extends Controller
{
    public function homeAction()
    {
        return $this->render('@App/home.html.twig', [
            'user' => $this->getUser(),
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

        $pizzas = $this->get('mardizza.pizza')->getPizzas();

        return $this->render('@App/order.html.twig', [
            'pizzas' => $pizzas,
            'user' => $user,
            'order' => $todaysOrder,
        ]);
    }
}
