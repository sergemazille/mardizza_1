<?php
declare(strict_types = 1);

namespace AppBundle\Controller;

use AppBundle\Entity\Group;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class GroupController extends Controller
{
    public function getGroupsAction()
    {
        $userGroups = $this->get('mardizza.group_service')->getUserGroups();
        return $this->json($userGroups);
    }

    public function addGroupAction(Group $group)
    {
        if (!$group) {
            throw $this->createNotFoundException('Aucun groupe trouvé.');
        }

        $user = $this->getUser();
        $groups = $user->getGroups();

        // check if group isn't already in user's groups
        if ($groups->contains($group)) {
            return $this->json(false);
        }

        $groups->add($group);
        $this->getDoctrine()->getManager()->flush();
        return $this->json(true);
    }

    public function removeGroupAction(Group $group)
    {
        if (!$group) {
            throw $this->createNotFoundException('Aucun groupe trouvé.');
        }

        $user = $this->getUser();
        $groups = $user->getGroups();

        // return false if group isn't in user's groups
        if (!$groups->contains($group)) {
            return $this->json(false);
        }

        $groups->removeElement($group);

        $this->getDoctrine()->getManager()->flush();

        return $this->json(true);
    }
}
