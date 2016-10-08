<?php

namespace AppBundle\Twig\Extension;

use AppBundle\Entity\Group;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;

class AppExtension extends \Twig_Extension
{
    private $tokenStorage;

    public function __construct(TokenStorage $tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;
    }

    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('userIsGroupAdmin', array($this, 'userIsGroupAdmin')),
        );
    }

    /**
     * @param Group $group
     * @return boolean
     */
    public function userIsGroupAdmin(Group $group)
    {
        $user = $this->tokenStorage->getToken()->getUser();
        return true;
    }

    public function getName()
    {
        return 'app_extension';
    }
}
