import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDNQt6WeJH58q_DtGUFFgFtNFWW7h174G4",
  authDomain: "webappsocial-50f9e.firebaseapp.com",
  projectId: "webappsocial-50f9e",
  storageBucket: "webappsocial-50f9e.firebasestorage.app",
  messagingSenderId: "265051454057",
  appId: "1:265051454057:web:68e594d026a10d8c8400f8",
  measurementId: "G-RBS7WEXZFG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app);
export const googleAuth = new GoogleAuthProvider()
googleAuth.setCustomParameters({ prompt: 'select_account' })
export const db = getFirestore(app)
