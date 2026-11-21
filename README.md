# Swans Travel Driver Academy

React + TypeScript + Vite training portal scaffold. The course seed is based on the supplied 26-slide Swans Travel Coach Driver Training Course. This is company induction/refresher material, not approved Driver CPC training.

## Run locally
1. Run `npm install`, then `npm run dev`.
2. Copy `.env.example` to `.env.local` and add the web app configuration from the dedicated Firebase project.

## Firebase setup
Create a new Firebase project with project ID `swans-driver-academy`. Enable Email/Password Authentication, Firestore and Storage. Register a Web App and copy its config into `.env.local`. Publish `firestore.rules` from the Firebase console. Do not reuse credentials or projects from Swans Ops Command Centre or Swans Accident Management.

## First admin account
Create the first account in Firebase Authentication, then create `users/{uid}` in Firestore with `{ name, email, role: "admin", depot, active: true }`. Only management should create accounts. Disable public self-registration in the application.

## Included
- Six original course modules and their lesson content
- Scenario-based interactions and knowledge checks
- Local preview progress when Firebase is not configured
- Firebase email/password sign-in
- Management view scaffold for driver records and course assignments
- Firestore rules starter

## Before operational use
Review security rules, add manager provisioning workflow, test role-based access, configure Storage rules, validate all training against current Swans procedures and fleet, and complete user acceptance testing. Practical assessment and manager sign-off remain separate from online quiz completion.
