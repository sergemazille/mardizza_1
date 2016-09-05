<?php
declare(strict_types = 1);

namespace AppBundle\Security;

use AppBundle\Entity\User;
use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\Authenticator\AbstractFormLoginAuthenticator;

class LoginFormAuthenticator extends AbstractFormLoginAuthenticator
{
    private $em;
    private $router;

    public function __construct(EntityManager $em, RouterInterface $router)
    {
        $this->em = $em;
        $this->router = $router;
    }

    // this method is called on each and every request, but we are just interested by a login form submission
    public function getCredentials(Request $request)
    {
        $isLoginSubmit = ($request->getPathInfo() == '/login') && ($request->isMethod('POST'));

        if (!$isLoginSubmit) {
            return;
        }

        return array('_email' => $request->get('_email'), '_password' => $request->get('_password'));
    }

    public function getUser($credentials, UserProviderInterface $userProvider) : User
    {
        $email = $credentials['_email'];

        return $this->em->getRepository('AppBundle:User')->findOneBy(['email' => $email]);
    }

    public function checkCredentials($credentials, UserInterface $user)
    {
        $password = $credentials['_password'];

        if (password_verify($password, $user->getPassword())) {
            return true;
        }

        return false;
    }

    // if authentication fails send to login page
    protected function getLoginUrl()
    {
        return $this->router->generate('login');
    }

    protected function getDefaultSuccessRedirectUrl()
    {
        return $this->router->generate('order');
    }
}
