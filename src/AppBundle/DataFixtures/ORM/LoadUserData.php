<?php
declare(strict_types = 1);

namespace AppBundle\DataFixtures\ORM;

use AppBundle\Entity\User;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

class LoadUserData implements FixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $users = [
            [
                "firstName" => "Serge",
                "email" => "serge.mazille@gmail.com",
            ]
        ];

        foreach($users as $item){
            $user = new User();
            $user->setFirstName($item['firstName']);
            $user->setEmail($item['email']);

            $manager->persist($user);
            $manager->flush();
        }
    }
}
