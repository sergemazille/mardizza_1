<?php

namespace AppBundle\Validator;

class ImageValidator
{
    private $message;
    private $imageFile;

    /**
     * @param $imageFile
     */
    public function setImageFile($imageFile)
    {
        $this->imageFile = $imageFile;
    }

    /**
     * @return bool
     */
    public function imageIsValid() : bool
    {
        if(! $this->imageFile){
            $this->message = "Aucune image.";
            return false;
        }

        if(! $this->mimeTypeIsValid()){
            return false;
        }

        if(! $this->imageSizeIsValid()){
            return false;
        }

        // if everything is ok then send back true
        $this->message = "L'image est valide.";
        return true;
    }

    /**
     * @return bool
     */
    private function mimeTypeIsValid() : bool
    {
        $mimeType = $this->imageFile->getMimeType();
        if ($mimeType != 'image/png' && $mimeType != 'image/jpeg' && $mimeType != 'image/gif') {

            $this->message = "L'image doit être au format jpg, png ou gif.";
            return false;
        }

        return true;
    }

    /**
     * @return bool
     */
    private function imageSizeIsValid() : bool
    {
        if ($this->imageFile->getSize() > 100000) {
            $this->message = "L'image ne doit pas faire plus de 1 Mo.";
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