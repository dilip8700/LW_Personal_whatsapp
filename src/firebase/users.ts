import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  query, 
  where,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from './config';
import { User, UserStatus } from '../types';

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users: User[] = [];
    
    usersSnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data() as Omit<User, 'id'>
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

// Get pending users
export const getPendingUsers = async (): Promise<User[]> => {
  try {
    const q = query(
      collection(db, 'users'),
      where('status', '==', 'pending')
    );
    
    const querySnapshot = await getDocs(q);
    const pendingUsers: User[] = [];
    
    querySnapshot.forEach((doc) => {
      pendingUsers.push({
        id: doc.id,
        ...doc.data() as Omit<User, 'id'>
      });
    });
    
    return pendingUsers;
  } catch (error) {
    console.error('Error getting pending users:', error);
    throw error;
  }
};

// Update user status (approve or reject)
export const updateUserStatus = async (
  userId: string, 
  status: UserStatus
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), { status });
  } catch (error) {
    console.error(`Error updating user status:`, error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  updates: { name?: string; email?: string }
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), updates);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Add user to group
export const addUserToGroup = async (
  userId: string,
  groupId: string
): Promise<void> => {
  try {
    // Add group to user's groupIds
    await updateDoc(doc(db, 'users', userId), {
      groupIds: arrayUnion(groupId)
    });
    
    // Add user to group's memberIds
    await updateDoc(doc(db, 'groups', groupId), {
      memberIds: arrayUnion(userId)
    });
  } catch (error) {
    console.error('Error adding user to group:', error);
    throw error;
  }
};

// Remove user from group
export const removeUserFromGroup = async (
  userId: string,
  groupId: string
): Promise<void> => {
  try {
    // Remove group from user's groupIds
    await updateDoc(doc(db, 'users', userId), {
      groupIds: arrayRemove(groupId)
    });
    
    // Remove user from group's memberIds
    await updateDoc(doc(db, 'groups', groupId), {
      memberIds: arrayRemove(userId)
    });
  } catch (error) {
    console.error('Error removing user from group:', error);
    throw error;
  }
};