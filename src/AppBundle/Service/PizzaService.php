<?php

namespace AppBundle\Service;

use Doctrine\ORM\EntityManager;

class PizzaService
{
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    public function getPizzas()
    {
        return $this->em->getRepository('AppBundle:Pizza')->findAll();
    }
}
