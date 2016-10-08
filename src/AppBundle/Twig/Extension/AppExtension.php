<?php

namespace AppBundle\Twig\Extension;

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
            new \Twig_SimpleFilter('exampleFilter', array($this, 'exampleFilter')),
        );
    }

    public function exampleFilter()
    {
        return true;
    }

    public function getName()
    {
        return 'app_extension';
    }
}
