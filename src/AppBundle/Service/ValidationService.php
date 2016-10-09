<?php

namespace AppBundle\Service;

use AppBundle\Entity\Group;
use AppBundle\Entity\User;

class ValidationService
{
    public function useIsMemberOfGroup(Group $group, User $user) : bool
    {
        return $group->getMembers()->contains($user);
    }
}