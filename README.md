# WebsiteManager Application

## 📖 Description
**WebsiteManagerApplication** est une plateforme SaaS modulaire permettant aux entreprises de **créer, gérer et personnaliser leur site web** via une interface centralisée et sécurisée.  
Le projet repose sur une architecture microservices, garantissant **scalabilité, sécurité et maintenabilité**.

---

## 🚀 Fonctionnalités principales
- Gestion multi-entreprises et multi-utilisateurs avec rôles (superadmin, modérateur, etc.).  
- Gestion des **licences et paiements** (intégration Stripe).  
- Administration des contenus web (actualités, FAQ, carrousels, événements, services…).  
- Notifications temps réel via **WebSocket**.  
- **Chatbot IA** intégré pour assister les utilisateurs.  
- Archivage et restauration des données.  

---

## 🛠️ Stack Technique

### Frontend
- **React.js** (Backoffice et Client)  

### Backend
- **NestJS + MongoDB** : gestion des utilisateurs, entreprises, contenus, formulaires…  
- **Laravel + MySQL** : microservice de gestion des licences et paiements.  

### Communication
- **REST API**, **JWT**, **WebSocket**  

---

## ⚙️ Prérequis
- Docker & Docker Compose  
- Node.js >= 18.x  
- npm >= 9.x  
- PHP >= 8.x (pour le microservice Licence)  
- MySQL >= 8.x  
- MongoDB >= 5.x  

---

## 📦 Installation

1. Cloner le dépôt :  
   ```bash
   git clone https://github.com/chadhahannachi/PFE_websitemanagerApplication.git
   cd PFE_websitemanagerApplication
   ```

2. Copier les fichiers d’environnement :  
   ```bash
   cp .env.example .env
   ```
   Adapter les variables pour le microservice Laravel.

3. Lancer les services avec Docker :  
   ```bash
   docker-compose up --build
   ```

4. Accéder aux interfaces :  
   - **Backoffice (admin)** : [http://localhost:3000](http://localhost:3000)  
   - **Client (site généré)** : [http://localhost:3001](http://localhost:3001)  
   - **API principale (NestJS)** : [http://localhost:5000/api-docs](http://localhost:5000/api-docs)  

---

## 👤 Guide Utilisateur
- Se connecter via l’interface de login.  
- Naviguer selon votre rôle :  
  - **Superadmin Abshore**  
  - **Superadmin Entreprise**  
  - **Modérateur**  

---

## 📡 APIs principales

### Backend (NestJS)
- **Authentification** : `POST /auth/login`, `POST /auth/register`, `GET /auth/user/:id`  
- **Entreprises** : création, mise à jour, suppression, gestion des membres.  
- **Contenus** : FAQ, Partenaire, Événement, Service, etc.  
- **Formulaires** : création, réponses et gestion.  
- **Préférences** : personnalisation du design.  
- **Slides** : gestion de carrousels.  
- **Chatbot IA** : `POST /chatbot/message`  
- **Fichiers & Médias** : upload et accès.  

### Microservice Licence (Laravel + Stripe)
- **Licences** : création, modification, suppression.  
- **Demandes de licence** : gestion des validations.  
- **Paiements** : intégration avec **Stripe**.  
- **Webhooks** : traitement des notifications Stripe.  

---

## 🛠️ Dépannage
- **Port déjà utilisé** : modifier `docker-compose.yml`.  
- **Erreur DB** : vérifier les variables d’environnement (MySQL/MongoDB).  
- **Problème d’authentification** : contrôler la validité du token JWT.  
- **Paiement non validé** : vérifier la configuration Stripe et les logs Laravel.  

---

## 📌 Maintenance
- Mise à jour du projet :  
  ```bash
  git pull
  docker-compose up --build
  ```
- Sauvegardes des bases : via scripts ou outils externes.  

---

## 👥 Auteur
- **Hannachi Chadha** – *Développeuse Fullstack*  
