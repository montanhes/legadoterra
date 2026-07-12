<?php

namespace App\Http\Controllers;

use App\Http\Requests\Report\StoreReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\DonorProfile;

class ReportController extends Controller
{
    public function store(StoreReportRequest $request, DonorProfile $donorProfile): ReportResource
    {
        $report = $donorProfile->reports()->create([
            'reporter_id' => $request->user()->id,
            'reason' => $request->validated('reason'),
        ]);

        return ReportResource::make($report);
    }
}
