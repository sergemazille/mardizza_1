<?php

namespace AppBundle\Service;

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
        return $this->router->generate('order', [
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
}
