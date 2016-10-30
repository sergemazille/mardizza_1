<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Group;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class EmailController extends Controller
{
    public function groupInvitationAction(Request $request, Group $group)
    {
        $submittedToken = $request->get('csrf');
        if (!$this->isCsrfTokenValid('group_token', $submittedToken)) {
            $errorMessage = "L'action a expirée.";
            return $this->json($errorMessage);
        }

        $user = $this->getUser();
        $groups = $user->getGroups();

        // check if host is part of the group
        if (! $groups->contains($group)) {
            $errorMessage = "Vous ne pouvez pas envoyer d'invitation à un groupe auquel vous ne faites pas partie.";
            return $this->json($errorMessage);
        }

        // check user doesn't invite himself
        $mailTo = $request->get('mailTo');
        if ($mailTo == $user->getEmail()) {
            $errorMessage = "Vous ne pouvez pas vous envoyer une invitation à vous même.";
            return $this->json($errorMessage);
        }

        // send the actual invitation
        $message = \Swift_Message::newInstance()
            ->setSubject('Invitation Mardizza')
            ->setFrom('contact.mardizza@gmail.com')
            ->setTo($mailTo)
            ->setBody(
                $this->renderView(
                    '@App/emails/group-invitation.html.twig', [
                        'sender' => $user,
                        'group' => $group,
                    ]
                ),
                'text/html'
            );

        $emailSent = $this->get('mailer')->send($message);
        if(true){
            //register the invitation
            $invitation = $this->get('mardizza.invitation');
            $invitation->setGroup($group);
            $invitation->setInvitedEmail($mailTo);

            return $this->json("ok");
        }

        return false;
    }
}
