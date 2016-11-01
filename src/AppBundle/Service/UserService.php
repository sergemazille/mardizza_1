<?php
/**
 * User: Serge
 * Date: 01/11/2016
 * Time: 12:13
 */

namespace AppBundle\Service;

use AppBundle\Entity\Group;
use Doctrine\ORM\EntityManager;

class UserService
{
    private $em;

    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    public function getGroupUsersReadModel(Group $group)
    {
        $members = $group->getMembers();
        $groupMembers = [];
        foreach($members as $member) {
            $groupMemberItem['id'] = $member->getId();
            $groupMemberItem['username'] = $member->getUsername();
            $groupMemberItem['stamps'] = $member->getStampNumber();
            $groupMembers[] = $groupMemberItem;
        }

        return $groupMembers;
    }
}