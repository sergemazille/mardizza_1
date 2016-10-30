<?php
declare(strict_types = 1);

namespace AppBundle\Controller;

use AppBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    /**
     * @param User $user
     * @return Response
     */
    public function userAction(User $user) : Response
    {
        // get invitations
        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('AppBundle:Invitation');
        $userInvitations = $repo->findBy(['invitedEmail' => $user->getEmail()]);

        return $this->render('AppBundle::user-config.html.twig', [
            'user' => $user,
            'invitations' => $userInvitations,
        ]);
    }
}
