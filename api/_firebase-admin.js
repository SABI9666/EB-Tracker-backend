const admin = require('firebase-admin');

// This prevents re-initializing the app on every hot-reload
if (!admin.apps.length) {
  try {
    // Check if the Base64 encoded key is available
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64) {
      // Decode the Base64 string to get the JSON object
      const serviceAccountJson = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64, 'base64').toString('utf8');
      const serviceAccount = JSON.parse(serviceAccountJson);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET // You still need this one
      });

    } else {
      // Fallback to the old method if the new variable isn't set
      console.log('Using separate Firebase environment variables.');
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

module.exports = admin;