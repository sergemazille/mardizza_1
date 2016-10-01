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

        // Welcome message
        $this->addFlash("success", "Bon appétit !!!");

        // reference for database
        $orderRef = $this->get('mardizza.order_service')->getOrderRef();

        return $this->render('@App/order.html.twig', [
            'user' => $user,
            'orderRef' => $orderRef,
        ]);
    }
}
