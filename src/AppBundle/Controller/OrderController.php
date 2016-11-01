<?php
declare(strict_types = 1);

namespace AppBundle\Controller;

use AppBundle\Entity\Group;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class OrderController extends Controller
{
    public function updateAction(Group $group, Request $request)
    {
        if (!$this->getUser()) {
            return $this->redirectToRoute('login');
        }

        $submittedToken = $request->get('csrf');
        if (!$this->isCsrfTokenValid('order_token', $submittedToken)) {
            $errorMessage = "L'action a expirée.";
            return $this->json($errorMessage);
        }

        // update group stamps
        $group->setStamps($request->get('stamps'));

        $em = $this->getDoctrine()->getManager();

        // update free pizza user stamps
        $freePizzaUserId = $request->get('freePizzaUserId');
        if(null != $freePizzaUserId) {
            $user = $em->getRepository('AppBundle:User')->find($freePizzaUserId);
            $userStamps = $user->getStampNumber();
            $user->setStampNumber($userStamps + 1);
        }

        // save updates
        $em->flush();

        // add confirmation message
        $this->addFlash('success', "La commande a bien été mise à jour.");

        // return confirmation
        return $this->json("ok");
    }
}
