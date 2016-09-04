<?php
declare(strict_types = 1);

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class SecurityController extends Controller
{
    public function loginAction()
    {
        $authenticationUtils = $this->get('security.authentication_utils');

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();

        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render(
            '@App/login.html.twig', [
                'last_username' => $lastUsername,
                'error' => $error,
            ]
        );
    }

    public function logoutAction()
    {
        // Symfony takes care of the logout action by itself (security.yml : firewalls > main > logout)
        throw new \Exception('Ne peut pas être atteint...');
    }
}
