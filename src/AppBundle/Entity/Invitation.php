<?php

namespace AppBundle\Entity;

use AppBundle\Service\GroupService;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="invitation")
 */
class Invitation
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string")
     */
    private $invitedEmail;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Group", inversedBy="invitations")
     */
    private $group;

    /**
     * @return int
     */
    public function getId() : int
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId(int $id)
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getInvitedEmail() : string
    {
        return $this->invitedEmail;
    }

    /**
     * @param string $invitedEmail
     */
    public function setInvitedEmail(string $invitedEmail)
    {
        $this->invitedEmail = $invitedEmail;
    }

    /**
     * @return Group
     */
    public function getGroup() : Group
    {
        return $this->group;
    }

    /**
     * @param Group $group
     */
    public function setGroup(Group $group)
    {
        $this->group = $group;
    }
}
