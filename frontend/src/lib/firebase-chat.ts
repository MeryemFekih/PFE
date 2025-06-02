import { db, storage } from './firebase';
import {
  doc, setDoc, getDoc, collection, addDoc,
  serverTimestamp, onSnapshot, query, orderBy,
  where, getDocs, writeBatch,
  collectionGroup
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export type Message = {
  id?: string;
  senderId: number;
  recipientId: number;
  type: 'text' | 'file' | 'link';
  content: string;
  fileName?: string;
  mimeType?: string;
  read: boolean;
  createdAt: any;
  timestamp?: any;
  readAt?: any;
};

/* Generate conversation ID from user IDs */
function conversationId(u1: number, u2: number): string {
  return u1 < u2 ? `${u1}_${u2}` : `${u2}_${u1}`;
}

/* Create or fetch conversation */
export async function getOrCreateConversation(u1: number, u2: number): Promise<string> {
  const id = conversationId(u1, u2);
  const docRef = doc(db, 'conversations', id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    console.log('Creating new conversation:', id);
    await setDoc(docRef, {
      participants: [u1, u2],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null
    });
  } else {
    console.log('Found existing conversation:', id);
  }
  return id;
}
/* Send message with proper read status */
export async function sendMessage(
  convoId: string,
  senderId: number,
  recipientId: number,
  payload: {
    type: 'text' | 'file' | 'link';
    content: string | Blob;
    fileName?: string;
    mimeType?: string;
  }
): Promise<void> {
  let content = payload.content;

  // Upload file if type is file
  if (payload.type === 'file' && payload.content instanceof Blob) {
    const storageRef = ref(storage, `conversations/${convoId}/${Date.now()}_${payload.fileName || 'file'}`);
    await uploadBytes(storageRef, payload.content);
    content = await getDownloadURL(storageRef);
  }

  const msg: any = {
    senderId,
    recipientId,
    type: payload.type,
    content: content as string,
    read: false,
    createdAt: serverTimestamp(),
    timestamp: serverTimestamp()
  };

  // ✅ Only include these fields if they're defined
  if (payload.fileName) msg.fileName = payload.fileName;
  if (payload.mimeType) msg.mimeType = payload.mimeType;

  // Save message
  await addDoc(collection(db, 'conversations', convoId, 'messages'), msg);

  // Update conversation metadata
  await setDoc(doc(db, 'conversations', convoId), {
    lastMessage: msg,
    updatedAt: serverTimestamp()
  }, { merge: true });
}


/* Real-time message listener */
export function listenToMessages(
  convoId: string, 
  callback: (messages: Message[]) => void
): () => void {
  const q = query(
    collection(db, 'conversations', convoId, 'messages'),
    orderBy('createdAt')
  );

  return onSnapshot(q, (snap) => {
    const messages = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Message));
    callback(messages);
  });
}

/* Mark messages as read with timestamp */
export async function markMessagesAsRead(
  convoId: string, 
  userId: number
): Promise<number> {
  const q = query(
    collection(db, 'conversations', convoId, 'messages'),
    orderBy('createdAt')
  );

  const snap = await getDocs(q);
  const unread = snap.docs.filter(doc => {
    const data = doc.data();
    return data.recipientId === userId && !data.read;
  });

  if (unread.length === 0) return 0;

  const batch = writeBatch(db);
  const readAt = serverTimestamp();

  unread.forEach(doc => {
    batch.update(doc.ref, {
      read: true,
      readAt
    });
  });

  await batch.commit();
  return unread.length;
}

/* Listen for unread messages across all conversations */
export function listenForUnreadMessages(
  userId: number,
  callback: (unreadCounts: Record<string, number>) => void
): () => void {
  const messagesRef = collectionGroup(db, 'messages');
  const q = query(
    messagesRef,
    where('recipientId', '==', userId),
    where('read', '==', false)
  );

  return onSnapshot(q, (snap) => {
    const counts: Record<string, number> = {};

    snap.forEach(doc => {
      const convoId = doc.ref.parent.parent?.id;
      if (convoId) {
        counts[convoId] = (counts[convoId] || 0) + 1;
      }
    });

    callback(counts);
  });
}

/* Get conversation participants */
export async function getConversationParticipants(
  convoId: string
): Promise<number[]> {
  const docRef = doc(db, 'conversations', convoId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data()?.participants || [];
  }
  return [];
}

/* Helper to get the other participant in a conversation */
export function getOtherParticipant(
  participants: number[],
  currentUserId: number
): number | null {
  return participants.find(id => id !== currentUserId) || null;
}