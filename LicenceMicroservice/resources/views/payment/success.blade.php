@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card border-0 shadow-sm" style="background-color: white; border-radius: 20px; ">
                <div class="card-body p-5">
                    <h1 class="h4 mb-4 text-left font-weight-bold" style="font-weight: 700;">Paiement réussi</h1>
                    <hr class="my-4">
                    <p class="text-left mb-4" style="font-size: 0.8rem;">
                        Félicitations ! Votre paiement a été traité avec succès et votre licence est maintenant active.
                    </p>

                    <div class="text-left mt-4">
                        <a href="http://localhost:3001" class="btn btn-primary px-4" style="background-color: #f59e0b; border-color: #f59e0b; font-weight: 600; height: 50px; width: 200px; border-radius: 10px;">
                            Retour à l'accueil
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .btn-primary:hover {
        background-color: #014268 !important;
        border-color: #014268 !important;
    }
    .card {
        background-color: #f5f5f5;
    }
</style>
@endsection