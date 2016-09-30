<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class UserController extends Controller
{
    public function getUsernameAction()
    {
        return $this->json($this->getUser()->getUsername());
    }
}
