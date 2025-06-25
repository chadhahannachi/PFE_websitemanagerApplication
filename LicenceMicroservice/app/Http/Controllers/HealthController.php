<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function healthCheck()
    {
        try {
            // Vérifier la connexion à la base de données
            DB::connection()->getPdo();
            
            return response()->json([
                'status' => 'healthy',
                'database' => 'connected',
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'unhealthy',
                'error' => 'Database connection failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
