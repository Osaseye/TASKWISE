# Firebase Configuration for TaskWise

This project uses Firebase Firestore. To ensure the application works correctly, you need to configure your Firebase Security Rules and Indexes.

## 1. Security Rules

The security rules are defined in `firestore.rules`. These rules ensure that users can only access their own data.

**To apply these rules:**

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project (`taskwise-1f741`).
3.  Navigate to **Firestore Database** > **Rules**.
4.  Copy the content of `firestore.rules` from this project and paste it into the editor.
5.  Click **Publish**.

Alternatively, if you have the Firebase CLI installed and authenticated:

```bash
firebase deploy --only firestore:rules
```

## 2. Indexes

The application requires a composite index for the `tasks` collection to support sorting by `createdAt` for specific users.

**To create the index:**

1.  Click on the link provided in the error console, or go to **Firestore Database** > **Indexes**.
2.  Create a new **Composite Index**:
    *   **Collection ID**: `tasks`
    *   **Fields**:
        *   `userId` (Ascending)
        *   `createdAt` (Descending)
    *   **Query Scope**: `Collection`

Alternatively, if you have the Firebase CLI installed:

```bash
firebase deploy --only firestore:indexes
```

## 3. Local Development

The `firebase.json` file has been created to link these configurations for local development or deployment via CLI.
