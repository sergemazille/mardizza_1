<?php

namespace AppBundle\Service;

use AppBundle\Entity\Group;
use AppBundle\Entity\Order;
use DateTime;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Routing\Router;

class OrderService
{
    private $order;

    public function __construct(EntityManager $em, Router $router, Order $order)
    {
        $this->em = $em;
        $this->order = $order;
        $this->router = $router;
    }

    public function create()
    {
        return $this->router->generate('group_order', [
            'order' => $this->order,
        ]);
    }

    public function save(Order $order)
    {
        $order->setUpdatedAt(new DateTime());

        $this->em->persist($order);
        $this->em->flush();
    }

    public function delete(Order $order)
    {
        $order->setIsActive(false);
        $order->setDeletedAt(new DateTime());

        $this->em->persist($order);
        $this->em->flush();
    }

    /**
     * @param Group $group
     * @return Order
     */
    public function getOrder(Group $group) : Order
    {
        $orderRepository = $this->em->getRepository('AppBundle:Order');
        $today = new DateTime('TODAY');

        // check if there's already an order today
        $todaysOrder = $orderRepository->findOneByDateAndGroupId($today, $group->getId());

        // else create a new one
        if(! $todaysOrder){
            $todaysOrder = $this->order;
            $todaysOrder->setGroup($group);
            $todaysOrder->setCreatedAt($today);
            $todaysOrder->setUpdatedAt($today);

            $this->em->persist($todaysOrder);
            $this->em->flush();
        }

        return $todaysOrder;
    }

    /**
     * @param Group $group
     * @return string
     */
    public function getOrderRef(Group $group) : string
    {
        $order = $this->getOrder($group);

        // groupId is added to order ref in order to differentiate orders by groups
        return $order->getCreatedAt()->format('Ymd') . $group->getId();
    }
}
