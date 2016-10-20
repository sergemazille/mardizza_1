<?php
declare(strict_types = 1);

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class SecurityController extends Controller
{
    public function loginAction()
    {
        // already logged in users are sent directly to order page if they have only 1 group and to groups page if they have 0 or more than 1 group
        $user = $this->getUser();
        if ($user) {
            if($user->getGroups()->count() == 1){
                $userGroupId = $user->getGroups()->first()->getId();
                return $this->redirectToRoute('order_group', [
                    'id' => $userGroupId
                ]);
            }else{
                return $this->redirectToRoute('group_list');
            }
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

        // user creation
        $user->setUsername($username);
        $user->setEmail($request->get('_email'));
        $user->setPassword($request->get('_password'));

        // group creation
        $group = $this->get('mardizza.group');
        $group->getAdmins()->add($user);
        $group->getMembers()->add($user);
        $group->setStamps(0);

        $groups = $user->getGroups();
        $groups->add($group);

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->persist($group);
        $em->flush();

        // Welcome message
        $this->addFlash("success", "Bienvenue sur Mardizza !!!");

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
