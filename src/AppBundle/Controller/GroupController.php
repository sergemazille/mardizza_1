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

            $em = $this->getDoctrine()->getManager();
            $userRepo = $em->getRepository('AppBundle:User');


            // update group admins
            $adminIds = explode(",", $request->get('adminIds'));

            if ($adminIds) {

                // check if future admins are part of the group
                $userIsMemberValidator = $this->get('mardizza.validation_service');
                foreach ($adminIds as $user) {
                    if (! $userIsMemberValidator->useIsMemberOfGroup($group, $user)) {
                        return $this->createAccessDeniedException('Au moins un utilisateur ne fait pas partie du groupe');
                    }
                }

                $groupAdmins = $group->getAdmins();
                $groupAdmins->clear(); // start clean

                foreach ($adminIds as $adminId) {
                    $adminUser = $userRepo->find($adminId);
                    if ($adminUser && !$groupAdmins->contains($adminUser)) {
                        $groupAdmins->add($adminUser);
                    }
                }
            }

            // image management
            $imageFile = $request->files->get('image');
            if ($imageFile) {
                $imageName = $imageFile->getClientOriginalName();
                $group->setImage($imageName);

                // move image file to group images folder
                $groupImagesDir = $this->container->getParameter('kernel.root_dir') . '/../web/assets/images/group';
                $imageFile->move($groupImagesDir, $imageName);
            }

            // update remaining data
            $name = $request->get('name');
            $color = $request->get('color');
            $group->setName($name);
            $group->setColor($color);

            // save updates
            $em->flush();

            // return confirmation
            return $this->json("ok");

        } else {
            throw new \Exception("L'action a expirée");
        }
    }
}
