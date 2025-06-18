import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocs,
  arrayUnion,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface Room {
  id: string
  name: string
  objective: string
  visibility: "public" | "private"
  creatorId: string
  creatorName: string
  participantEmails: string[]
  joinedUsers: string[]
  limit?: number
  createdAt: any
  isActive: boolean
}

export interface Participant {
  id: string
  email: string
  name: string
  joinedAt: any
  isActive: boolean
}

// ✅ FIXED: Room creation using custom ID
export async function createRoom(roomData: Room): Promise<string> {
  try {
    const { id, ...rest } = roomData

    const cleanData: any = {
      ...rest,
      joinedUsers: [roomData.creatorId],
      isActive: true,
      createdAt: serverTimestamp(),
    }

    if (roomData.limit !== undefined && roomData.limit !== null) {
      cleanData.limit = roomData.limit
    }

    await setDoc(doc(db, "rooms", id), { id, ...cleanData })

    return id
  } catch (error) {
    console.error("Error creating room:", error)
    throw error
  }
}

// ✅ Check if room exists by ID
export async function checkRoomExists(roomId: string): Promise<Room | null> {
  try {
    const roomRef = doc(db, "rooms", roomId)
    const roomSnap = await getDoc(roomRef)
    return roomSnap.exists() ? (roomSnap.data() as Room) : null
  } catch (error) {
    console.error("Error checking room:", error)
    return null
  }
}

// ✅ Join a room (authorization + limit enforced)
export async function joinRoom(
  roomId: string,
  userId: string,
  userEmail: string,
  userName: string
): Promise<boolean> {
  try {
    const room = await checkRoomExists(roomId)
    if (!room) return false

    if (room.visibility === "private") {
      const isAuthorized =
        room.participantEmails.includes(userEmail) ||
        room.creatorId === userId ||
        room.joinedUsers.includes(userId)
      if (!isAuthorized) return false
    }

    if (room.limit && room.joinedUsers.length >= room.limit) {
      return false
    }

    // Add user to joinedUsers if not already present
    if (!room.joinedUsers.includes(userId)) {
      await updateDoc(doc(db, "rooms", roomId), {
        joinedUsers: arrayUnion(userId),
      })
    }

    // Check if participant already exists
    const q = query(
      collection(db, "rooms", roomId, "participants"),
      where("id", "==", userId)
    )
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      // Participant already exists → reactivate
      const docRef = snapshot.docs[0].ref
      await updateDoc(docRef, { isActive: true })
    } else {
      // Add new participant document
      await addDoc(collection(db, "rooms", roomId, "participants"), {
        id: userId,
        email: userEmail,
        name: userName,
        joinedAt: serverTimestamp(),
        isActive: true,
      })
    }

    return true
  } catch (error) {
    console.error("Error joining room:", error)
    return false
  }
}


// ✅ Get rooms joined by user
export async function getUserRooms(userId: string): Promise<Room[]> {
  try {
    const q = query(
      collection(db, "rooms"),
      where("joinedUsers", "array-contains", userId),
      orderBy("createdAt", "desc")
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data() as Room)
  } catch (error) {
    console.error("Error fetching user rooms:", error)
    return []
  }
}

// ✅ Get public rooms
export async function getPublicRooms(): Promise<Room[]> {
  try {
    const q = query(
      collection(db, "rooms"),
      where("visibility", "==", "public"),
      where("isActive", "==", true),
      orderBy("createdAt", "desc")
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data() as Room)
  } catch (error) {
    console.error("Error fetching public rooms:", error)
    return []
  }
}

// ✅ Subscribe to messages
export function subscribeToMessages(roomId: string, callback: (messages: any[]) => void) {
  const q = query(collection(db, "rooms", roomId, "messages"), orderBy("createdAt", "asc"))
  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(msgs)
  })
}

// ✅ Subscribe to participants
export function subscribeToParticipants(roomId: string, callback: (participants: Participant[]) => void) {
  const q = query(collection(db, "rooms", roomId, "participants"), where("isActive", "==", true))
  return onSnapshot(q, (snapshot) => {
    const participantsList = snapshot.docs.map((doc) => doc.data() as Participant)
    callback(participantsList)
  })
}

// ✅ Send a message to the room
export async function sendMessage(
  roomId: string,
  text: string,
  senderId: string,
  senderName: string
) {
  try {
    return await addDoc(collection(db, "rooms", roomId, "messages"), {
      text,
      senderId,
      senderName,
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

// ✅ Leave a room (mark participant inactive)
export async function leaveRoom(roomId: string, userId: string) {
  try {
    const participantsQuery = query(
      collection(db, "rooms", roomId, "participants"),
      where("id", "==", userId),
      where("isActive", "==", true)
    )
    const participantsSnapshot = await getDocs(participantsQuery)

    participantsSnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, { isActive: false })
    })
  } catch (error) {
    console.error("Error leaving room:", error)
  }
}
