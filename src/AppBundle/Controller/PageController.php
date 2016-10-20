<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Group;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PageController extends Controller
{
    public function homeAction()
    {
        // already logged in users are sent directly to order page if they have only 1 group and to groups page if they have 0 or more than 1 group
        $user = $this->getUser();
        if ($user) {
            if($user->getGroups()->count() == 1){
                $userGroupId = $user->getGroups()->first()->getId();
                return $this->redirectToRoute('order_group', [
                    'id' => $userGroupId
                ]);
            }else{
                return $this->redirectToRoute('group_list');
            }
        }

        return $this->render('@App/home.html.twig');
    }

    public function orderAction(Group $group)
    {
        // anonymous users are sent back to login form
        $user = $this->getUser();
        if (!$user) {
            return $this->redirectToRoute('login');
        }

        // redirect to group list if user doesn't belong to the group
        if(! $user->getGroups()->contains($group)){
            return $this->redirectToRoute('group_list');
        }

        // reference for database
        $orderRef = $this->get('mardizza.order_service')->getOrderRef($group);

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
