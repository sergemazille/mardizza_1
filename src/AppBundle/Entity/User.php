<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity
 * @ORM\Table(name="user")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", unique=true)
     */
    private $username;

    /**
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\Column(type="string", unique=true)
     */
    private $email;

    /**
     * @ORM\ManyToMany(targetEntity="Pizza", inversedBy="userFavorites")
     * @ORM\JoinTable(name="users_favorite_pizzas")
     */
    private $favoritePizzas;

    /**
     * @ORM\ManyToMany(targetEntity="Group", inversedBy="users")
     * @ORM\JoinTable(name="groups_users")
     */
    private $groups;

    /**
     * User constructor.
     */
    public function __construct()
    {
        $this->groups = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function setUsername($username)
    {
        $this->username = $username;
    }

    public function getRoles()
    {
        return ['ROLE_USER'];
    }

    /**
     * @return string
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * @param string $password
     */
    public function setPassword($password)
    {
        $this->password = password_hash($password, PASSWORD_BCRYPT);
    }

    /**
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param string $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * @return Pizza ArrayCollection
     */
    public function getFavoritePizzas()
    {
        return $this->favoritePizzas;
    }

    /**
     * @return Group ArrayCollection
     */
    public function getGroups()
    {
        return $this->groups;
    }

    public function getSalt()
    {
        // automatic with bcrypt
    }

    public function eraseCredentials()
    {
    }
}
