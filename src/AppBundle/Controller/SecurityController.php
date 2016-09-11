<?php
declare(strict_types = 1);

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class SecurityController extends Controller
{
    public function loginAction()
    {
        // redirect to order page if already logged in
        if ($this->getUser()) {
            return $this->redirectToRoute('order');
        }

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

    public function createAction(Request $request)
    {
        $user = $this->get('mardizza.user');

        $username = $request->get('_username');
        $isUniqueUsername = $this->checkUniqueUsername($username);

        // other fields are check by Firebase
        if (!$isUniqueUsername) {

            $this->addFlash('error', "Ce prénom est déjà utilisé.");
            return $this->redirectToRoute('login');
        }

        $user->setUsername($username);
        $user->setEmail($request->get('_email'));
        $user->setPassword($request->get('_password'));

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();

        return $this->get('security.authentication.guard_handler')
            ->authenticateUserAndHandleSuccess(
                $user,
                $request,
                $this->get('mardizza.security.login_form_authenticator'),
                'main'
            );
    }

    public function checkAjaxUniqueUsernameAction(Request $request)
    {
        $username = $request->get('username');
        $isUniqueUsername = $this->checkUniqueUsername($username);

        return $this->json($isUniqueUsername);
    }
    
    private function checkUniqueUsername($username)
    {
        $userRepository = $em = $this->getDoctrine()->getManager()->getRepository('AppBundle:User');
        return !$userRepository->findOneBy(["username" => $username]);
    }
}
