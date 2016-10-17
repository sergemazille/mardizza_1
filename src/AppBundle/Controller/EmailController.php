<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class EmailController extends Controller
{
    public function groupInvitationAction(Request $request)
    {
        $submittedToken = $request->get('csrf');
        if(! $this->isCsrfTokenValid('group_token', $submittedToken)){
            return $this->json("L'action a expirée");
        }

        // create a validation token
        $tokenManager = $this->get("security.csrf.token_manager");
        $token = $tokenManager->refreshToken('group_invitation');

        // send the actual invitation
        $mailTo = $request->get('mailTo');
        $message = \Swift_Message::newInstance()
            ->setSubject('Invitation Mardizza')
            ->setFrom('contact.mardizza@gmail.com')
            ->setTo($mailTo)
            ->setBody(
                $this->renderView(
                    '@App/emails/group-invitation.html.twig'
                ),
                'text/html'
            );

        $emailSent = $this->get('mailer')->send($message);
        if($emailSent){
            return $this->json("ok");
        }

        return false;
    }
}
