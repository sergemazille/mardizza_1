<?php
declare(strict_types = 1);

namespace AppBundle\Security;

use AppBundle\Entity\User;
use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManager;
use Symfony\Component\Security\Guard\Authenticator\AbstractFormLoginAuthenticator;

class LoginFormAuthenticator extends AbstractFormLoginAuthenticator
{
    private $em;
    private $router;
    private $csrfValidator;

    public function __construct(EntityManager $em, RouterInterface $router, CsrfTokenManager $csrfValidator)
    {
        $this->em = $em;
        $this->router = $router;
        $this->csrfValidator = $csrfValidator;
    }

    // this method is called on each and every request, but we are just interested by a login form submission
    public function getCredentials(Request $request)
    {
        $isLoginSubmit = ($request->getPathInfo() == '/login') && ($request->isMethod('POST'));

        if (!$isLoginSubmit) {
            return;
        }

        // check csrf_token
        $submittedToken = $request->get("csrf_token");
        if(! $this->csrfValidator->isTokenValid(new CsrfToken('login_form', $submittedToken))){
            throw new AccessDeniedException("Le jeton a expiré, veuillez réessayer");
        }

        // return credentials
        return array('_email' => $request->get('_email'), '_password' => $request->get('_password'));
    }

    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        $email = $credentials['_email'];
        $user = $this->em->getRepository('AppBundle:User')->findOneBy(['email' => $email]);

        if($user){
            return $user;
        }
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
        return $this->router->generate('home');
    }
}
