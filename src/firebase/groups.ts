import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from './config';
import { Group } from '../types';

// Create a new group
export const createGroup = async (groupName: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'groups'), {
      groupName,
      memberIds: [],
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

// Get all groups
export const getAllGroups = async (): Promise<Group[]> => {
  try {
    const groupsSnapshot = await getDocs(collection(db, 'groups'));
    const groups: Group[] = [];
    
    groupsSnapshot.forEach((doc) => {
      groups.push({
        id: doc.id,
        ...doc.data() as Omit<Group, 'id'>
      });
    });
    
    return groups;
  } catch (error) {
    console.error('Error getting groups:', error);
    throw error;
  }
};

// Get a specific group
export const getGroup = async (groupId: string): Promise<Group | null> => {
  try {
    const groupDoc = await getDoc(doc(db, 'groups', groupId));
    
    if (groupDoc.exists()) {
      return {
        id: groupDoc.id,
        ...groupDoc.data() as Omit<Group, 'id'>
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting group:', error);
    throw error;
  }
};

// Get groups for a specific user
export const getUserGroups = async (userId: string): Promise<Group[]> => {
  try {
    const q = query(
      collection(db, 'groups'),
      where('memberIds', 'array-contains', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const groups: Group[] = [];
    
    querySnapshot.forEach((doc) => {
      groups.push({
        id: doc.id,
        ...doc.data() as Omit<Group, 'id'>
      });
    });
    
    return groups;
  } catch (error) {
    console.error('Error getting user groups:', error);
    throw error;
  }
};

// Update a group
export const updateGroup = async (
  groupId: string,
  updates: Partial<Omit<Group, 'id'>>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'groups', groupId), updates);
  } catch (error) {
    console.error('Error updating group:', error);
    throw error;
  }
};

// Delete a group
export const deleteGroup = async (groupId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'groups', groupId));
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
};