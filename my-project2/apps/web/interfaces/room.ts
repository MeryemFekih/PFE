export interface Participant {
    id: string;
    firstName: string;
    lastName: string;
  }
  
  export interface Room {
    id: string;
    name: string;
    ownerId: string;
    participants: Participant[];
  }
  