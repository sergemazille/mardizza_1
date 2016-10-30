<?php

namespace AppBundle\Validator;

use AppBundle\Entity\Group;
use AppBundle\Entity\User;
use Doctrine\ORM\EntityManager;

class InvitationValidator
{
    private $message;
    private $user;
    private $group;
    private $mailTo;
    private $em;

    /**
     * InvitationValidator constructor.
     * @param $em
     */
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    /**
     * @param User $user
     * @param Group $group
     * @param string $mailTo
     * @return InvitationValidator
     */
    public function init(User $user, Group $group, string $mailTo) : InvitationValidator
    {
        $this->user = $user;
        $this->group = $group;
        $this->mailTo = $mailTo;

        return $this;
    }

    /**
     * @return bool
     */
    public function invitationIsValid() : bool
    {
        if(! $this->hostIsValid()){
            return false;
        }

        if(! $this->invitedIsValid()){
            return false;
        }

        // if everything is ok then send back true
        $this->message = "L'invitation est valide.";
        return true;
    }

    /**
     * @return bool
     */
    private function hostIsValid() : bool
    {
        // check if host is part of the group
        $groups = $this->user->getGroups();
        if (! $groups->contains($this->group)) {
            $this->message = "Vous ne pouvez pas envoyer d'invitation à un groupe auquel vous ne faites pas partie.";
            return false;
        }

        // check user doesn't invite himself
        if ($this->mailTo == $this->user->getEmail()) {
            $this->message = "Vous ne pouvez pas vous envoyer une invitation à vous même.";
            return false;
        }

        return true;
    }

    /**
     * @return bool
     */
    private function invitedIsValid() : bool
    {
        // check invited user doesn't belong to group already
        foreach ($this->group->getMembers() as $member) {
            if ($this->mailTo == $member->getEmail()) {
                $this->message = "L'utilisateur invité fait déjà partie du groupe.";
                return false;
            }
        }

        // check if user hasn't already been invited into this group
        if($this->em->getRepository('AppBundle:Invitation')->findOneByEmailAndGroup($this->mailTo, $this->group)) {
            $this->message = "L'utilisateur a déjà eté invité à rejoindre le groupe.";
            return false;
        }

        return true;
    }

    /**
     * @return string
     */
    public function getMessage() : string
    {
        return $this->message;
    }
}