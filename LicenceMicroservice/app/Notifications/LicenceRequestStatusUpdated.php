<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\LicenceRequest;

class LicenceRequestStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    protected $licenceRequest;
    protected $licenceId;

    /**
     * Create a new notification instance.
     */
    public function __construct(LicenceRequest $licenceRequest, $licenceId = null)
    {
        $this->licenceRequest = $licenceRequest;
        $this->licenceId = $licenceId;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $message = new MailMessage;
        
        if ($this->licenceRequest->status === 'validated') {
            $message->subject('Votre demande de licence a été validée')
                   ->greeting('Bonjour,')
                   ->line('Nous sommes heureux de vous informer que votre demande de licence a été validée.')
                   ->line('Type de licence : ' . $this->licenceRequest->type)
                   ->line('Prix : ' . $this->licenceRequest->price . ' DT')
                   ->line('Durée : ' . $this->licenceRequest->duration_months . ' mois')
                   ->action('Passer au paiement', 'http://localhost:3000/licence/' . $this->licenceId)
                   ->line('Merci de votre confiance !');
        } else if ($this->licenceRequest->status === 'rejected') {
            $message->subject('Votre demande de licence a été rejetée')
                   ->greeting('Bonjour,')
                   ->line('Nous regrettons de vous informer que votre demande de licence a été rejetée.')
                   ->line('Raison : ' . ($this->licenceRequest->rejection_reason ?? 'Non spécifiée'))
                   ->action('Contacter le support', url('/contact'))
                   ->line('N\'hésitez pas à nous contacter pour plus d\'informations.');
        }

        return $message;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
