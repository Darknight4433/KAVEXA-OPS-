# Firebase Setup Guide for Interns

## 🔥 Step-by-Step Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `kavexa-ops` (or your preferred name)
4. Disable Google Analytics (optional for development)
5. Click "Create Project"

---

### Step 2: Register Web App

1. In Firebase project overview, click the **Web icon** (`</>`)
2. Enter app nickname: `KAVEXA OPS Dashboard`
3. **Check** "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **Copy the Firebase configuration object** - you'll need this!

Example config:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "kavexa-ops.firebaseapp.com",
  projectId: "kavexa-ops",
  storageBucket: "kavexa-ops.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

---

### Step 3: Enable Authentication

1. In Firebase Console sidebar, click **"Authentication"**
2. Click **"Get Started"**
3. Go to **"Sign-in method"** tab
4. Click on **"Google"** provider
5. **Enable** the toggle switch
6. Select a **support email** from dropdown
7. Click **"Save"**

✅ Google Authentication is now enabled!

---

### Step 4: Create Firestore Database

1. In Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
   - ⚠️ **Important**: Test mode allows all reads/writes for 30 days
   - You'll need to update security rules before production!
4. Select a **Cloud Firestore location** (choose closest to you)
   - Example: `us-central1` or `asia-south1`
5. Click **"Enable"**

✅ Firestore Database is now created!

---

### Step 5: Set Up Firestore Security Rules

1. In Firestore Database, go to **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Workspace documents - require authentication
    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null;
    }
    
    // User documents - users can only access their own
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to list users (for team features)
    match /users/{userId} {
      allow list: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

---

### Step 6: Create Initial Firestore Document

1. In Firestore Database, click **"Start collection"**
2. Collection ID: `workspaces`
3. Click "Next"
4. Document ID: `kavexa_main` (or auto-generate)
5. Add initial fields:

```
Field             Type        Value
-------------------------------------------
projects          array       [] (empty array)
tasks             array       [] (empty array)
members           array       [] (empty array)
schedules         array       [] (empty array)
subjects          array       [] (empty array)
studyTasks        array       [] (empty array)
ideas             array       [] (empty array)
notifications     array       [] (empty array)
activityLogs      array       [] (empty array)
documents         array       [] (empty array)
diagrams          array       [] (empty array)
research          array       [] (empty array)
resources         array       [] (empty array)
files             array       [] (empty array)
notices           array       [] (empty array)
lastUpdated       timestamp   (auto-generated)
```

6. Click **"Save"**

✅ Initial workspace document is created!

---

### Step 7: Add Firebase Config to Your App

1. Open your project in VS Code
2. Create a file: `src/services/firebase.ts`
3. Add the Firebase configuration:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace with YOUR Firebase config from Step 2
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
```

---

### Step 8: Install Firebase SDK

In your project terminal, run:

```bash
npm install firebase
```

---

### Step 9: Authorized Domains for Authentication

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. You should see:
   - `localhost` (for development)
   - `your-project-id.firebaseapp.com` (automatically added)
3. When deploying, **add your production domain** here
   - Example: `kavexa-ops.vercel.app`

---

### Step 10: Test the Connection

Create a test file `src/services/testFirebase.ts`:

```typescript
import { db, auth } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function testFirebaseConnection() {
  console.log('Testing Firebase connection...');
  
  // Test Firestore
  try {
    const workspacesRef = collection(db, 'workspaces');
    const snapshot = await getDocs(workspacesRef);
    console.log('✅ Firestore connected! Documents:', snapshot.size);
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
  }
  
  // Test Auth
  try {
    console.log('Auth instance:', auth);
    console.log('✅ Firebase Auth initialized!');
  } catch (error) {
    console.error('❌ Auth initialization failed:', error);
  }
}
```

Call this function in your `App.tsx` to verify everything works:

```typescript
import { testFirebaseConnection } from './services/testFirebase';

useEffect(() => {
  testFirebaseConnection();
}, []);
```

---

## 🔐 Environment Variables (Optional but Recommended)

Instead of hardcoding Firebase config, use environment variables:

1. Create `.env` file in project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. Update `firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

3. Add `.env` to `.gitignore`:

```
.env
.env.local
```

---

## 🧪 Testing Checklist

### Authentication Test:
- [ ] Can sign in with Google
- [ ] User data saves to `users/{userId}` collection
- [ ] User stays signed in after page refresh
- [ ] Sign out works correctly

### Firestore Test:
- [ ] Can read from `workspaces/kavexa_main`
- [ ] Can write new data (create project)
- [ ] Real-time listener updates on data change
- [ ] Security rules block unauthenticated access

---

## 🚨 Common Issues & Solutions

### Issue 1: "Firebase: Error (auth/unauthorized-domain)"
**Solution:** Add your domain to Authorized domains in Firebase Console
- Go to Authentication → Settings → Authorized domains
- Add `localhost` or your deployment domain

### Issue 2: "Missing or insufficient permissions"
**Solution:** Check Firestore security rules
- Make sure rules allow authenticated reads/writes
- Verify user is signed in (`request.auth != null`)

### Issue 3: "Firebase App named '[DEFAULT]' already exists"
**Solution:** Firebase is initialized multiple times
- Only call `initializeApp()` once
- Use `getApp()` to get existing instance

### Issue 4: CORS errors in browser console
**Solution:** Check Firebase project configuration
- Ensure Firestore location is set
- Verify API key is correct
- Check browser console for specific error details

---

## 📊 Monitoring & Debugging

### Firebase Console Debugging:

1. **Authentication** tab:
   - See list of signed-in users
   - Check sign-in methods status

2. **Firestore Database** tab:
   - View all documents and collections
   - Manually add/edit/delete data
   - Monitor real-time updates

3. **Usage** tab:
   - Track API calls
   - Monitor quota usage
   - Check for errors

### Browser Console:

Enable Firestore debug logging:

```typescript
import { enableIndexedDbPersistence } from 'firebase/firestore';

// Enable offline persistence and logging
enableIndexedDbPersistence(db, { 
  forceOwnership: true 
}).catch((err) => {
  console.error('Persistence error:', err);
});
```

---

## 📱 Additional Firebase Features (Optional)

### Firebase Storage (for file uploads):

1. In Firebase Console, go to **Storage**
2. Click **"Get Started"**
3. Choose **"Start in test mode"**
4. Click **"Done"**

Install storage:
```bash
npm install firebase
```

Use in code:
```typescript
import { getStorage } from 'firebase/storage';
export const storage = getStorage(app);
```

### Firebase Cloud Functions (for backend logic):

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize Functions: `firebase init functions`
3. Deploy: `firebase deploy --only functions`

---

## 🎯 Next Steps After Setup

1. ✅ Verify all Firebase services are working
2. ✅ Create authentication flow (Login page)
3. ✅ Implement Firestore CRUD operations
4. ✅ Set up real-time listeners
5. ✅ Build out UI components
6. ✅ Test with multiple users
7. ✅ Update security rules for production
8. ✅ Deploy to hosting platform

---

## 📞 Getting Help

If stuck, check:
- Firebase Documentation: https://firebase.google.com/docs
- Firebase Console logs and errors
- Browser DevTools console
- Network tab for API calls

---

**Firebase is now ready! Start building your dashboard! 🚀**
