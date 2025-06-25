@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card border-0 shadow-sm" style="background-color: white; border-radius: 20px; ">
                <div class="card-body p-5">
                    <h1 class="h4 mb-4 text-left font-weight-bold" style="font-weight: 700;">Paiement Échoué</h1>
                    <hr class="my-4">
                    <p class="text-left mb-4" style="font-size: 0.8rem; color: #dc3545;">
                        Une erreur est survenue lors du paiement. Veuillez réessayer ou contacter le support.
                        <br>{{ session('error') }}
                    </p>

                    <div class="text-left mt-4">
                        <a href="http://localhost:3000/hometh" class="btn btn-primary px-4" style="background-color: #dc3545; border-color: #dc3545; font-weight: 600; height: 50px; width: 200px; border-radius: 10px;">
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
        background-color: #a71d2a !important;
        border-color: #a71d2a !important;
    }
    .card {
        background-color: #f5f5f5;
    }
</style>
@endsection
