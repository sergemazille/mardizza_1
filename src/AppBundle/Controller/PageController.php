<?php

namespace AppBundle\Controller;

use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PageController extends Controller
{
    public function homeAction()
    {
        // already logged in users are sent directly to groups page or even more quickly to order page if they have only one group
        $user = $this->getUser();
        if ($user) {
            $route = (count($user->getGroups()) <= 1) ? 'order' : 'group_list';
            return $this->redirectToRoute($route);
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

    public function groupsAction()
    {
        // anonymous users are sent back to login form
        $user = $this->getUser();
        if (!$user) {
            return $this->redirectToRoute('login');
        }

        return $this->render('@App/groups.html.twig', [
            'user' => $user,
        ]);
    }
}
