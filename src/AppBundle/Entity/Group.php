<?php

namespace AppBundle\Entity;

use AppBundle\Service\GroupService;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="`group`")  // as a reserved word, 'group' is escaped
 */
class Group
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
    private $name;

    /**
     * @ORM\Column(type="string")
     */
    private $image;

    /**
     * @ORM\Column(type="string")
     */
    private $color;

    /**
     * @ORM\ManyToMany(targetEntity="AppBundle\Entity\User")
     */
    private $admins;

    /**
     * @ORM\ManyToMany(targetEntity="AppBundle\Entity\User", mappedBy="groups")
     */
    private $members;

    /**
     * @ORM\Column(type="integer")
     */
    private $stamps;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Order", mappedBy="group", cascade={"remove"})
     */
    private $orders;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Invitation", mappedBy="group")
     */
    private $invitations;

    /**
     * Group constructor.
     * @param GroupService $groupService
     */
    public function __construct(GroupService $groupService)
    {
        $this->color = $groupService->getRandomColor();
        $this->image = "group_default_image.png";
        $this->name = "Groupe";
        $this->admins = new ArrayCollection();
        $this->members = new ArrayCollection();
        $this->invitedMembers = new ArrayCollection();
    }

    /**
     * @return string
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * @param string $image
     */
    public function setImage(string $image)
    {
        $this->image = $image;
    }

    /**
     * @return string
     */
    public function getColor() : string
    {
        return $this->color;
    }

    /**
     * @param string $color
     */
    public function setColor(string $color)
    {
        $this->color = $color;
    }

    /**
     * @return int
     */
    public function getId() : int
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getName() : string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name)
    {
        $this->name = $name;
    }

    /**
     * @return ArrayCollection
     */
    public function getAdmins()
    {
        return $this->admins;
    }

    /**
     * @return ArrayCollection
     */
    public function getMembers()
    {
        return $this->members;
    }

    /**
     * @return ArrayCollection
     */
    public function getInvitations()
    {
        return $this->invitations;
    }

    /**
     * @return int
     */
    public function getStamps() : int
    {
        return $this->stamps;
    }

    public function setStamps($stamps)
    {
        $this->stamps = $stamps;
    }

    /**
     * @return Order
     */
    public function getOrders() : Order
    {
        return $this->orders;
    }

    /**
     * @param Order $orders
     */
    public function setOrders(Order $orders)
    {
        $this->orders = $orders;
    }
}
