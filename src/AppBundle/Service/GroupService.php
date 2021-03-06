<?php

namespace AppBundle\Service;

use AppBundle\Entity\Group;
use Doctrine\ORM\EntityManager;
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
            $groupItem['stamps'] = $group->getStamps();
            $groupItem['userIsAdmin'] = $group->getAdmins()->contains($user);
            $groupItem['members'] = $this->getMembers($group);
            $groupItem['imageUrl'] = "/assets/files/images/" . $group->getImage();

            $groupItems[] = $groupItem;
        }

        return $groupItems;
    }

    public function getGroup(Group $group) : array
    {
        $groupItem['id'] = $group->getId();
        $groupItem['name'] = $group->getName();
        $groupItem['color'] = $group->getColor();
        $groupItem['stamps'] = $group->getStamps();
        $groupItem['members'] = $this->getMembers($group);
        $groupItem['imageUrl'] = "/assets/files/images/" . $group->getImage();

        return $groupItem;
    }

    public function getRandomColor() : string
    {
        $colors = [
            "#00145E",
            "#034A61",
            "#00AB74",
            "#007D0C",
            "#508500",
        ];

        return $colors[rand(0, 4)];
    }

    /**
     * @param Group $group
     * @return bool
     */
    public function userIsAdmin(Group $group) : bool
    {
        $user = $this->tokenStorage->getToken()->getUser();
        return $group->getAdmins()->contains($user);
    }

    private function getMembers($group)
    {
        $members = $group->getMembers();

        $memberItems = [];
        foreach ($members as $member){
            $memberItem['id'] = $member->getId();
            $memberItem['username'] = $member->getUsername();
            $memberItem['stampNumber'] = $member->getStampNumber();
            $memberItem['isAdmin'] = $group->getAdmins()->contains($member);

            $memberItems[] = $memberItem;
        }

        return $memberItems;
    }
}
