import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBWv-Vf_c9bmZRVUc-G_jrF60f3-SN-XdA",
  authDomain: "kavexa-ops.firebaseapp.com",
  projectId: "kavexa-ops",
  storageBucket: "kavexa-ops.firebasestorage.app",
  messagingSenderId: "196784445155",
  appId: "1:196784445155:web:772049e0fa578afc1a97d6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Connecting to Firestore on project:", firebaseConfig.projectId);
  try {
    const docRef = doc(db, 'workspaces', 'kavexa_main');
    console.log("Fetching doc workspaces/kavexa_main...");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      console.log("Doc exists! Data keys:", Object.keys(snap.data()));
      console.log("Projects count:", snap.data().projects?.length || 0);
      console.log("Tasks count:", snap.data().tasks?.length || 0);
    } else {
      console.log("Doc workspaces/kavexa_main does NOT exist in Firestore yet!");
    }
  } catch (err) {
    console.error("Firestore error:", err);
  }
}

run();
