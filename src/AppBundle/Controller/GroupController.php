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

    public function quitGroupAction(Request $request, Group $group)
    {
        $submittedToken = $request->get('csrf');
        if (!$this->isCsrfTokenValid('group_token', $submittedToken)) {
            $errorMessage = "L'action a expirée.";
            return $this->json($errorMessage);
        }

        $user = $this->getUser();
        if (!$user) {
            return $this->redirectToRoute('login');
        }

        // remove user from group
        $group->getMembers()->removeElement($user);
        $group->getAdmins()->removeElement($user);
        $user->getGroups()->removeElement($group);

        $em = $this->getDoctrine()->getManager();
        $em->flush();

        // return confirmation
        return $this->json("ok");
    }

    public function deleteGroupAction(Request $request, Group $group)
    {
        $submittedToken = $request->get('csrf');
        if (!$this->isCsrfTokenValid('group_token', $submittedToken)) {
            $errorMessage = "L'action a expirée.";
            return $this->json($errorMessage);
        }

        $user = $this->getUser();
        if (!$user) {
            return $this->redirectToRoute('login');
        }

        // cleanup
        $group->getMembers()->clear();
        $group->getAdmins()->clear();
        $user->getGroups()->removeElement($group);

        // delete group
        $em = $this->getDoctrine()->getManager();
        $em->remove($group);
        $em->flush();

        // add confirmation message
        $this->addFlash('success', "Le groupe a bien été supprimé.");

        // return confirmation
        return $this->json("ok");
    }

    // TODO: invitation process:
    public function addToGroupAction(Group $group)
    {
        if (!$group) {
            $errorMessage = "Aucun groupe trouvé.";
            return $this->json($errorMessage);
        }

        $user = $this->getUser();
        $groups = $user->getGroups();

        // check if group isn't already in user's groups
        if ($groups->contains($group)) {
            $errorMessage = "Vous êtes déjà membre de ce groupe.";
            return $this->json($errorMessage);
        }

        $groups->add($group);
        $this->getDoctrine()->getManager()->flush();

        // return confirmation
        return $this->json("ok");
    }

    public function createGroupAction(Request $request)
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->redirectToRoute('login');
        }

        $submittedToken = $request->get('csrf');
        if (!$this->isCsrfTokenValid('group_token', $submittedToken)) {
            $errorMessage = "L'action a expirée.";
            return $this->json($errorMessage);
        }

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

        // return confirmation
        return $this->json("ok");
    }

    public function removeFromGroupAction(Group $group)
    {
        if (! $group) {
            $errorMessage = "Aucun groupe trouvé.";
            return $this->json($errorMessage);
        }

        $user = $this->getUser();
        $userGroups = $user->getGroups();

        // return false if group isn't in user's groups
        if (!$userGroups->contains($group)) {
            $errorMessage = "L'utilisateur ne fait pas partie du groupe.";
            return $this->json($errorMessage);
        }

        $userGroups->removeElement($group);

        $this->getDoctrine()->getManager()->flush();

        // add confirmation message
        $this->addFlash('success', "Vous avez bien quitté le groupe.");

        // return confirmation
        return $this->json("ok");
    }

    public function updateGroupAction(Group $group, Request $request)
    {
        if (!$this->getUser()) {
            return $this->redirectToRoute('login');
        }

        $submittedToken = $request->get('csrf');
        if (!$this->isCsrfTokenValid('group_token', $submittedToken)) {
            $errorMessage = "L'action a expirée.";
            return $this->json($errorMessage);
        }

        $em = $this->getDoctrine()->getManager();
        $userRepo = $em->getRepository('AppBundle:User');

        // update group admins
        $adminIds = explode(",", $request->get('adminIds'));

        if ($adminIds) {
            // check if users are members of the group
            foreach ($adminIds as $userId) {
                $user = $userRepo->find($userId);
                if (!$user || !$group->getMembers()->contains($user)) {
                    $errorMessage = "Au moins un utilisateur n'est pas membre du groupe.";
                    return $this->json($errorMessage);
                }
            }

            $groupAdmins = $group->getAdmins();
            $groupAdmins->clear(); // start clean

            foreach ($adminIds as $adminId) {
                $user = $userRepo->find($adminId);
                if (!$groupAdmins->contains($user)) {
                    $groupAdmins->add($user);
                }
            }
        }

        // image management
        $imageFile = $request->files->get('image');

        if ($imageFile) {
            $imageValidator = $this->get('mardizza.image_validator')->init($imageFile);

            if(! $imageValidator->imageIsValid()){
                $errorMessage = $imageValidator->getMessage();
                return $this->json($errorMessage);
            }

            $imageName = $this->get('mardizza.image_service')->saveImage($imageFile);
            $group->setImage($imageName);
        }

        // update remaining data
        $name = $request->get('name');
        $color = $request->get('color');

        $group->setName($name);
        $group->setColor($color);

        $stamps = $request->get('stamps');
        $stamps = ($stamps == '') ? 0 : $stamps;
        $group->setStamps($stamps);

        // update users stamps number
        $members = json_decode($request->get('members'));
        foreach($members as $member){
            $user = $userRepo->find($member->id);
            $user->setStampNumber($member->stampNumber);
        }

        // save updates
        $em->flush();

        // add confirmation message
        $this->addFlash('success', "Le groupe a bien été mis à jour.");

        // return confirmation
        return $this->json("ok");
    }
}
