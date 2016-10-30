<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Group;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class InvitationController extends Controller
{
    public function addToGroupAction(Request $request, Group $group)
    {
        if (!$group) {
            $this->addFlash('error', 'Aucun groupe trouvé');
            throw $this->createNotFoundException();
        }

        $user = $this->getUser();
        $response = $request->get('invitation-response');

        if("refuse" == $response) {
            $this->deleteInvitation($group);
            $this->addFlash('success', "L'invitation a bien été supprimée.");
            return $this->redirectToRoute('user', [
                'id' => $user->getId(),
            ]);
        }

        // check if group isn't already in user's groups
        $groups = $user->getGroups();
        if ($groups->contains($group)) {
            $this->addFlash('error', 'Vous faites déjà partie de ce groupe.');
            throw $this->createAccessDeniedException();
        }

        // add group to user's groups
        $groups->add($group);
        $this->getDoctrine()->getManager()->flush();

        // delete invitation
        $this->deleteInvitation($group);

        // return confirmation
        $this->addFlash('success', "Bienvenue dans le groupe '{$group->getName()}'");
        return $this->redirectToRoute('user', [
            'id' => $user->getId(),
        ]);
    }

    private function deleteInvitation(Group $group)
    {
        $user = $this->getUser();

        $em = $this->getDoctrine()->getManager();
        $invitation = $em->getRepository('AppBundle:Invitation')->findOneByEmailAndGroup($user->getEmail(), $group);
        $em->remove($invitation);
        $em->flush();
    }
}