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
        $mailTo = $request->get('mailTo');

        // invitation validation
        $invitationValidator = $this->get('mardizza.invitation_validator')->init($user, $group, $mailTo);
        if(! $invitationValidator->invitationIsValid()) {
            $errorMessage = $invitationValidator->getMessage();
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

            $em = $this->getDoctrine()->getManager();
            $em->persist($invitation);
            $em->flush();

            return $this->json("ok");
        }

        return false;
    }
}
