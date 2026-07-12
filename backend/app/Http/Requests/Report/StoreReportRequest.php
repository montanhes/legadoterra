<?php

namespace App\Http\Requests\Report;

use App\Enums\ReportReason;
use App\Models\DonorProfile;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', Rule::enum(ReportReason::class)],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            /** @var DonorProfile $donorProfile */
            $donorProfile = $this->route('donor_profile');

            if ($donorProfile->pet->tutor_id === $this->user()->id) {
                $validator->errors()->add('reason', 'Você não pode denunciar seu próprio pet.');
            }

            $alreadyReported = $donorProfile->reports()
                ->where('reporter_id', $this->user()->id)
                ->exists();

            if ($alreadyReported) {
                $validator->errors()->add('reason', 'Você já denunciou este perfil.');
            }
        });
    }
}
