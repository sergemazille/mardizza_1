<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class OrderController extends Controller
{
    public function createAction()
    {
        $order = $this->get('mardizza.order');

        return $this->redirectToRoute('order', [
            'order' => $order,
        ]);
    }
}