<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        //
        '/checkout', // Exempter la route /checkout
        '/stripe/webhook', // Exempter la route webhook si nécessaire
        '/payment/success',
        '/payment/cancel',
        '/payment/error',
        '/verify-payment',
        '/payment/verify',
        '/payment/confirm-verification'
    ];
}
