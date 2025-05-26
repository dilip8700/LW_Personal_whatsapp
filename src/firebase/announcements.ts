import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  query, 
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { Announcement } from '../types';

// Create a new announcement
export const createAnnouncement = async (
  groupId: string,
  message: string,
  postedBy: string
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'announcements'), {
      groupId,
      message,
      postedBy,
      timestamp: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

// Get announcements for a specific group
export const getGroupAnnouncements = async (groupId: string): Promise<Announcement[]> => {
  try {
    const q = query(
      collection(db, 'announcements'),
      where('groupId', '==', groupId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const announcements: Announcement[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      announcements.push({
        id: doc.id,
        groupId: data.groupId,
        message: data.message,
        postedBy: data.postedBy,
        timestamp: data.timestamp.toDate()
      });
    });
    
    return announcements;
  } catch (error) {
    console.error('Error getting group announcements:', error);
    throw error;
  }
};

// Get all announcements for multiple groups
export const getAnnouncementsForGroups = async (groupIds: string[]): Promise<Announcement[]> => {
  if (groupIds.length === 0) return [];
  
  try {
    const q = query(
      collection(db, 'announcements'),
      where('groupId', 'in', groupIds),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const announcements: Announcement[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      announcements.push({
        id: doc.id,
        groupId: data.groupId,
        message: data.message,
        postedBy: data.postedBy,
        timestamp: data.timestamp.toDate()
      });
    });
    
    return announcements;
  } catch (error) {
    console.error('Error getting announcements for groups:', error);
    throw error;
  }
};