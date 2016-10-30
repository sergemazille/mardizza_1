<?php

namespace AppBundle\Repository;

use AppBundle\Entity\Group;
use Doctrine\ORM\EntityRepository;

class InvitationRepository extends EntityRepository
{
    public function findOneByEmailAndGroup(string $email, Group $group)
    {
        $repo = $this->getEntityManager()->getRepository('AppBundle:Invitation');
        return $repo->createQueryBuilder('i')
            ->andWhere('i.group = :group_id')
            ->setParameter('group_id', $group->getId())
            ->andWhere('i.invitedEmail = :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }
}