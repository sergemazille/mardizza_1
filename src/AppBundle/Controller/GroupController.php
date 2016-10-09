<?php
declare(strict_types = 1);

namespace AppBundle\Controller;

use AppBundle\Entity\Group;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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
        if(! $this->getUser()){
            return $this->redirectToRoute('login');
        }

        $submittedToken = $request->get('csrf');

        if ($this->isCsrfTokenValid('group_token', $submittedToken)) {

            $em = $this->getDoctrine()->getManager();
            $userRepo = $em->getRepository('AppBundle:User');

            // update group admins
            $adminIds = explode(",", $request->get('adminIds'));

            if ($adminIds) {
                // check if users are members of the group
                foreach ($adminIds as $userId) {
                    $user = $userRepo->find($userId);
                    if (! $user || ! $group->getMembers()->contains($user)) {
                        return $this->json("Au moins un utilisateur n'est pas membre du groupe");
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
                $mimeType = $imageFile->getMimeType();

                if($mimeType != 'image/png' && $mimeType != 'image/jpeg' && $mimeType != 'image/gif'){
                    return $this->json("L'image doit être au format jpg, png ou gif");
                }

                if($imageFile->getSize() > 100000){
                    return $this->json("L'image ne doit pas faire plus de 1 Mo");
                }

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
            return $this->json("L'action a expirée");
        }
    }
}
