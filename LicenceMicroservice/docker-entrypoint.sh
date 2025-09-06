#!/bin/sh

# Attendre que MySQL soit prêt
while ! mysqladmin ping -h mysql -u root -proot --skip-ssl --silent; do
    echo "En attente de MySQL..."
    sleep 1
    done

echo "MySQL est prêt"

# Exécuter les migrations
php artisan migrate --force

# Démarrer le serveur
php artisan serve --host=0.0.0.0 --port=8000
