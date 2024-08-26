<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ChartService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class ChartApiConrtoller extends Controller
{
    private ChartService $chartService;

    public function __construct(ChartService $chartService)
    {
        $this->chartService = $chartService;
    }

    /**
     * @param string $programUuid
     * @return Collection Project List
     */
    public function getProgramProgress(string $programUuid) : array
    {
        $program = $this->chartService->getProgramByUuid($programUuid);
        $pieChatData = $this->chartService->shapeProjectData($program);
        $barChatData = $this->chartService->getTaskCountGroubByYearAndMonth($programUuid);
        return [$pieChatData, $barChatData];
    }
}
