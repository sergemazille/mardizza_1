<?php

namespace AppBundle\Service;

use DateTime;
use Doctrine\ORM\EntityManager;

class OrderService
{
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    public function create()
    {
        $order = $this->get('mardizza.order');

        return $this->redirectToRoute('order', [
            'order' => $order,
        ]);
    }

    public function save(int $id)
    {
        $order = $this->em->getRepository('AppBundle:Order')->find($id);
        $order->setUpdatedAt(new DateTime());

        $this->em->persist($order);
        $this->em->flush();
    }

    public function delete(int $id)
    {
        $order = $this->em->getRepository('AppBundle:Order')->find($id);
        $order->setIsActive(false);
        $order->setDeletedAt(new DateTime());

        $this->em->persist($order);
        $this->em->flush();
    }
}
