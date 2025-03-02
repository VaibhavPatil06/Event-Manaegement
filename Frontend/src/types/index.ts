export interface User {
  id: string;
  email: string;
  fullName: string; // ✅ Ensure this exists
  role: string; // ✅ Ensure this exists
}


export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface EventsState {
  id:string;
  title: string;
  date: string;
  description: string;
  location: string;
  image: null | string | File; 
  update:boolean
}

export interface RootState {
  auth: AuthState;
  events: EventsState;
}