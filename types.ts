export enum Screen {
  Splash,
  Login,
  Signup,
  Dashboard,
}

export interface QueuePerson {
  id: string;
  firstName: string;
  lastName: string;
  status: 'In Queue' | 'Unavailable' | 'Waiting';
  sortKey: number; // Used for ordering the queue. Can be a decimal.
  displayRow: string; // The row number shown to the user (e.g., "5", "5.1").
  unavailableCount: number;
}

export interface Queue {
  id:string;
  name: string;
  isActive: boolean;
  people: QueuePerson[] | null;
  lastAssignedRow: number; // Tracks the last whole number assigned as a row.
}