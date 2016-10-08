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
            $groupItem['color'] = $group->getColor();
            $groupItem['imageUrl'] = "/assets/images/group/" . $group->getImage();

            $groupItems[] = $groupItem;
        }

        return $groupItems;
    }

    public function getRandomColor() : string
    {
        $colors = [
            "#58FF00",
            "#E8A30C",
            "#FF0000",
            "#330CE8",
            "#0DFFDA",
        ];

        return $colors[rand(0, 4)];
    }
}
