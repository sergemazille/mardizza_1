<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class OrderController extends Controller
{
    public function getOrderReferenceAction()
    {
        $orderReference = $this->get('mardizza.order_service')->getOrder()->getCreatedAt()->format('d-m-y');
        return $this->json($orderReference);
    }
}
