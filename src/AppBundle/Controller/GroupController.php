<?php
declare(strict_types = 1);

namespace AppBundle\Controller;

use AppBundle\Entity\Group;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

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

    public function updateGroupAction(Group $group, Request $request)
    {
        $submittedToken = $request->get('csrf');

        if ($this->isCsrfTokenValid('group_token', $submittedToken)) {

            // TODO: sanitize data

            // get data from request
            $adminIds = $request->get('adminIds');
            $memberIds = $request->get('memberIds');
            $name = $request->get('name');
            $color = $request->get('color');
            $image = $request->get('image');

            $em = $this->getDoctrine()->getManager();
            $userRepo = $em->getRepository('AppBundle:User');

            // update group admins
            $groupAdmins = $group->getAdmins();
            $groupAdmins->clear(); // start clean

            foreach ($adminIds as $adminId) {
                $user = $userRepo->find($adminId);
                if(! $groupAdmins->contains($user)){
                    $groupAdmins->add($user);
                }
            }

            // update group members
            $groupMembers = $group->getMembers();
            $groupMembers->clear(); // start clean

            foreach ($memberIds as $memberId) {
                $user = $userRepo->find($memberId);
                if(! $groupMembers->contains($user)){
                    $groupMembers->add($user);
                }
            }

            // update remaining data
            $group->setName($name);
            $group->setColor($color);
            $group->setImage($image);

            // save updates
            $em->flush();

            // return confirmation
            return $this->json("ok");

        } else {
            throw new \Exception("L'action a expirée");
        }
    }
}
