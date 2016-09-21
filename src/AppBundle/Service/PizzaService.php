<?php

namespace AppBundle\Service;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

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

    public function getJsonPizzas()
    {
        $normalizer = array(new ObjectNormalizer());
        $encoder = array(new JsonEncoder());
        $serializer = new Serializer($normalizer, $encoder);

        $pizzas = $this->em->getRepository('AppBundle:Pizza')->findAll();

        $pizzasTab = [];
        foreach($pizzas as $pizza){
            $pizzasTab[] = $serializer->serialize($pizza, 'json');
        }

        return $serializer->serialize($pizzas, 'json');
    }
}
