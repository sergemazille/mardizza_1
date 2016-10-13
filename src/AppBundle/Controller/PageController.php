<?php

namespace AppBundle\Controller;

use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PageController extends Controller
{
    public function homeAction()
    {
        // already logged in users are sent directly to order page if they have only 1 group and to groups page if they have 0 or more than 1 group
        $user = $this->getUser();
        if ($user) {
            $route = ($user->getGroups()->count() == 1) ? 'order' : 'group_list';
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

        // users who don't have a group can't access this page
        if($user->getGroups()->count() <= 0){
            return $this->redirectToRoute('group_list');
        }

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
