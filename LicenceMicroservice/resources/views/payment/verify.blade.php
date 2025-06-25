@extends('layouts.app') 

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card border-0 shadow-sm" style="background-color: white; border-radius: 20px; ">
                <div class="card-body p-5">
                    <h1 class="h4 mb-4 text-left font-weight-bold" style="font-weight: 700;">Vérification du paiement</h1>
                    <hr class="my-4">
                    <p class="text-left mb-4" style="font-size: 0.8rem;">
                        Un code de vérification a été envoyé à votre adresse email. Veuillez entrer ce code pour finaliser votre paiement.
                    </p>

                    


                    <form id="verification-form" method="POST" action="{{ route('payment.confirm-verification') }}" class="mt-4">
                        @csrf
                        <input type="hidden" name="licence_id" value="{{ $licence->id }}">

                        <div class="form-group mb-4">
                            <input type="text" 
                                   class="form-control text-left @error('verification_code') is-invalid @enderror" 
                                   id="verification_code" 
                                   name="verification_code" 
                                   required 
                                   maxlength="6"
                                   pattern="[A-Za-z0-9]{6}"
                                   placeholder="Code de vérification"
                                   style="font-size: 0.8rem;  padding: 0.8em;">
                            @error('verification_code')
                                <span class="invalid-feedback d-block text-left" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>

                        <div class="form-group text-left">
                            <button type="submit" class="btn btn-primary px-4" style="background-color: #f59e0b; border-color: #f59e0b; font-weight: 600; height: 50px; width: 200px; border-radius: 10px;">
                                Vérifier le paiement
                            </button>
                        </div>
                    </form>
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

@push('scripts')
<script>
document.getElementById('verification-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const response = await fetch(this.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({
                licence_id: this.querySelector('[name="licence_id"]').value,
                verification_code: this.querySelector('[name="verification_code"]').value
            })
        });

        const data = await response.json();

        if (data.status === 'success') {
            window.location.href = '{{ route("payment.success") }}';
        } else {
            alert(data.message || 'Une erreur est survenue');
        }
    } catch (error) {
        alert('Une erreur est survenue lors de la vérification');
    }
});
</script>
@endpush
@endsection