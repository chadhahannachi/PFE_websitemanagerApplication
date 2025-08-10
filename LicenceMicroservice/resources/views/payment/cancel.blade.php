@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card border-0 shadow-sm" style="background-color: white; border-radius: 20px; ">
                <div class="card-body p-5">
                    <h1 class="h4 mb-4 text-left font-weight-bold" style="font-weight: 700;">Paiement Annulé</h1>
                    <hr class="my-4">
                    <p class="text-left mb-4" style="font-size: 0.8rem; color: #6c757d;">
                        Le paiement a été annulé. Vous pouvez réessayer le paiement quand vous le souhaitez.
                    </p>

                    <div class="text-left mt-4">
                        <a href="http://localhost:3001" class="btn btn-primary px-4" style="background-color: #6c757d; border-color: #6c757d; font-weight: 600; height: 50px; width: 200px; border-radius: 10px;">
                            Retour à l'accueil
                        </a>
                        <!-- <a href="javascript:history.back()" class="btn btn-secondary px-4 ms-2" style="background-color: #f8f9fa; border-color: #ced4da; color: #495057; font-weight: 600; height: 50px; width: 200px; border-radius: 10px;">
                            Réessayer le paiement
                        </a> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .btn-primary:hover {
        background-color: #5a6268 !important;
        border-color: #5a6268 !important;
    }
    .btn-secondary:hover {
        background-color: #e2e6ea !important;
        border-color: #dae0e5 !important;
    }
    .card {
        background-color: #f5f5f5;
    }
</style>
@endsection 