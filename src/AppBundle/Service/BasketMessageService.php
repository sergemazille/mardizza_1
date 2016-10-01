<?php
/**
 * Created by PhpStorm.
 * User: Serge
 * Date: 01/10/2016
 * Time: 08:55
 */

namespace AppBundle\Service;


use Doctrine\ORM\EntityManager;

class BasketMessageService
{
    private $em;

    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    public function getBasketMessages()
    {
        $messages = [];
        foreach($this->em->getRepository('AppBundle:Message')->findAll() as $message){
            $messages[] = $message->getBody();
        }
        return $messages;
    }
}