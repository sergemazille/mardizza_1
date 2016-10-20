<?php

namespace AppBundle\Repository;

use DateTime;
use Doctrine\ORM\EntityRepository;

class OrderRepository extends EntityRepository
{
    public function findOneByDateAndGroupId(DateTime $date, int $groupId)
    {
        $repo = $this->getEntityManager()->getRepository('AppBundle:Order');
        return $repo->createQueryBuilder('o')
            ->andWhere('o.group = :group_id')
            ->setParameter('group_id', $groupId)
            ->andWhere('o.createdAt = :date')
            ->setParameter('date', $date)
            ->getQuery()
            ->getOneOrNullResult();
    }
}