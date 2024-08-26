<?php

namespace App\Http\Controllers;

use App\Services\ChartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ChartController extends Controller
{
    private ChartService $chartService;

    public function __construct(chartService $chartService)
    {
        $this->chartService = $chartService;
    }

    public function index(): Response
    {
        $programs= $this->chartService->getProgramsByUserId();
        $selectList = [];
        foreach ($programs as $key => $value) {
            $selectList[] = [
                'value' => $value->uuid,
                'label' => $value->name
            ];
        }
        return Inertia::render('Chart/Index', [
            'programUuidList' => $selectList
        ]);
    }
}
