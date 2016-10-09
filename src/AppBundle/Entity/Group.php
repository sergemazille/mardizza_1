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
    public function setImage($image)
    {
        $this->image = $image;
    }

    public function getColor() : string
    {
        return $this->color;
    }

    /**
     * @param string $color
     */
    public function setColor($color)
    {
        $this->color = $color;
    }

    public function getId() : int
    {
        return $this->id;
    }

    public function getName() : string
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getAdmins()
    {
        return $this->admins;
    }

    public function getMembers()
    {
        return $this->members;
    }

    public function getStamps() : int
    {
        return $this->stamps;
    }

    public function setStamps($stamps)
    {
        $this->stamps = $stamps;
    }
}
