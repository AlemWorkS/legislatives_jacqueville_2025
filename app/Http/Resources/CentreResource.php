<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CentreResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'lib_cen' => $this->lib_cen,
            'pop_cen' => $this->pop_cen,
            'nb_inscrits' => $this->nb_inscrits,
            'nb_bur' => $this->nb_bur,
            'progress' => $this->progress ?? null,
        ];
    }
}
