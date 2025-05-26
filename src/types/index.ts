// User types
export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student'
}

export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  groupIds: string[];
  createdAt: string;
}

// Group types
export interface Group {
  id: string;
  groupName: string;
  memberIds: string[];
  createdAt: string;
}

// Announcement types
export interface Announcement {
  id: string;
  groupId: string;
  message: string;
  postedBy: string;
  timestamp: Date;
}

// Auth context types
export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}