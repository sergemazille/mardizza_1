<?php
/**
 * Created by PhpStorm.
 * User: Serge
 * Date: 29/10/2016
 * Time: 14:02
 */

namespace AppBundle\Service;

class ImageService
{
    public function saveImage($imageFile)
    {
        if (! $imageFile) {
            throw new \ErrorException();
        }

        $imageNameToHash = $imageFile->getClientOriginalName() . random_int(1,5);
        $imageExtension = $imageFile->guessExtension();
        $imageName = hash('md5', $imageNameToHash) . '.' . $imageExtension;

        // move image file to group images folder
        $imagesDir = $_SERVER['DOCUMENT_ROOT'] . '/assets/files/images/';
        $imageFile->move($imagesDir, $imageName);

        return "{$imageName}";
    }
}