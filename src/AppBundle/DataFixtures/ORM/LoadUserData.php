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
                "username" => "Serge",
                "password" => "password",
            ]
        ];

        foreach($users as $item){
            $user = new User();
            $user->setUsername($item['username']);
            $user->setPassword($item['password']);

            $manager->persist($user);
            $manager->flush();
        }
    }
}