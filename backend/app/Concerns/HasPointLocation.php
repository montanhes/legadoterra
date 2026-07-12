<?php

namespace App\Concerns;

use Illuminate\Support\Facades\DB;

trait HasPointLocation
{
    protected static function bootHasPointLocation(): void
    {
        static::saving(function (self $model) {
            if ($model->isDirty(['lat', 'lng'])) {
                $model->location = DB::raw(sprintf(
                    "ST_PointFromText('POINT(%F %F)', 4326)",
                    (float) $model->lng,
                    (float) $model->lat,
                ));
            }
        });
    }
}
