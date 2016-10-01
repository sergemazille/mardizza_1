<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class BasketMessageController extends Controller
{
    public function getBasketMessageAction()
    {
        $messages = $this->get('mardizza.message_service')->getBasketMessages();
        return $this->json($messages);
    }
}
