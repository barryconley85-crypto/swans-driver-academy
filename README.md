# Swans Travel Driver Academy

React + TypeScript + Vite training portal scaffold. The course seed is based on the supplied 26-slide Swans Travel Coach Driver Training Course. This is company induction/refresher material, not approved Driver CPC training.

## Run locally
1. Run `npm install`, then `npm run dev`.
2. Copy `.env.example` to `.env.local` and add the web app configuration from the dedicated Firebase project.

## Firebase setup
Create a new Firebase project with project ID `swans-driver-academy`. Enable Email/Password Authentication, Firestore and Storage. Register a Web App and copy its config into `.env.local`. Publish `firestore.rules` from the Firebase console. Do not reuse credentials or projects from Swans Ops Command Centre or Swans Accident Management.

## Manager and driver account setup (Spark plan)
Use only the dedicated `swans-driver-academy` Firebase project. Keep public sign-up disabled; there is no client-side manager account creation and no Cloud Functions deployment.

Create the first manager in Firebase Authentication, then create `users/{uid}` in Firestore with `{ name, email, role: "admin", depot, active: true }`. For each driver, first import the driver register in the back office. In Firebase Console → Authentication → Users, manually add an Email/Password user using the driver's generated username as the email local part and `@drivers.academy.swansapps.co.uk` as the domain. Then create `users/{uid}` in Firestore (using the new Auth UID as the document ID) with `{ name, email, username, driverId, depot, role: "driver", active: true, mustChangePassword: true }`; use the exact driver's register ID and generated username. Set a temporary password and share it securely with that driver. At first sign-in, the driver must choose a new password. Once both records exist, the manager can select **Link existing login** in the driver register. Firestore rules only permit linking an account when its existing profile is an active driver profile with the same driver ID and username.

To reset a driver's password, use Firebase Console → Authentication → Users → select the user → Reset password, then share the reset instructions directly. The manager back office does not set or reveal passwords.

## Included
- Six original course modules and their lesson content
- Scenario-based interactions and knowledge checks
- Local preview progress when Firebase is not configured
- Firebase email/password sign-in
- Manager workflow to link pre-provisioned driver accounts, allocate training and review progress
- Firestore rules that block client-created user profiles and validate driver-account links

## Before operational use
Confirm the manager and driver profiles in Firebase Console are correct, configure Storage rules if Storage is used, validate all training against current Swans procedures and fleet, and complete user acceptance testing. Practical assessment and manager sign-off remain separate from online quiz completion.
