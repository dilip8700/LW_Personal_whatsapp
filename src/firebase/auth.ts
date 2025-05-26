import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, ADMIN_EMAIL } from './config';
import { User, UserRole } from '../types';

// Register a new user
export const registerUser = async (name: string, email: string, password: string): Promise<void> => {
  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Determine if this is the admin account
    const role = email === ADMIN_EMAIL ? UserRole.ADMIN : UserRole.STUDENT;
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      role,
      // Only the admin is automatically approved
      status: role === UserRole.ADMIN ? 'approved' : 'pending',
      groupIds: [],
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Sign in
export const signIn = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Get the user document from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as Omit<User, 'id'>;
      
      // Check if the user is approved (or is admin)
      if (userData.role === UserRole.ADMIN || userData.status === 'approved') {
        return {
          id: firebaseUser.uid,
          ...userData
        };
      } else {
        // Sign out if the user is not approved
        await firebaseSignOut(auth);
        throw new Error('Your account is pending approval by an administrator.');
      }
    } else {
      throw new Error('User data not found.');
    }
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get current user with Firestore data
export const getCurrentUser = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as Omit<User, 'id'>;
      return {
        id: firebaseUser.uid,
        ...userData
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};