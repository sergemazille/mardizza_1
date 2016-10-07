<?php

namespace AppBundle\Service;

use AppBundle\Entity\Pizza;
use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;

class GroupService
{

    private $tokenStorage;

    public function __construct(EntityManager $em, TokenStorage $tokenStorage)
    {
        $this->em = $em;
        $this->tokenStorage = $tokenStorage;
    }

    public function getUserGroups()
    {
        $user = $this->tokenStorage->getToken()->getUser();
        $groups = $user->getGroups();

        $groupItems = [];
        foreach ($groups as $group) {
            $groupItem['id'] = $group->getId();
            $groupItem['name'] = $group->getName();
            $groupItems[] = $groupItem;
        }

        return $groupItems;
    }
}
