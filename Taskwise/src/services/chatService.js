import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  limit 
} from "firebase/firestore";
import { db } from "../firebase";

export const chatService = {
  /**
   * Create a new chat session
   * @param {string} userId - The current user's ID
   * @param {string} firstMessage - The initial user message to title/preview the chat
   * @returns {Promise<string>} - The new chat ID
   */
  createChat: async (userId, firstMessage) => {
    try {
      const chatsRef = collection(db, "users", userId, "chats");
      // Use the first ~30 chars as a title, or "New Chat"
      const title = firstMessage.length > 30 
        ? firstMessage.substring(0, 30) + "..." 
        : firstMessage;

      const docRef = await addDoc(chatsRef, {
        userId,
        title,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        preview: firstMessage,
        messages: [] 
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating chat:", error);
      throw error;
    }
  },

  /**
   * Save messages to an existing chat
   * @param {string} userId
   * @param {string} chatId
   * @param {Array} newMessages - Array of {role, content} objects to append
   */
  saveMessages: async (userId, chatId, newMessages) => {
    try {
      const chatRef = doc(db, "users", userId, "chats", chatId);
      // We need to fetch existing messages first to append, or use arrayUnion if we structured it that way.
      // However, for correct chronological order and simplicity with large arrays limit, 
      // let's fetch-then-update or keep a local copy. 
      // A better approach for robust apps is a subcollection 'messages', but specific to 
      // the request "persist AI chat history", updating the document array is cost-effective for small chats.
      
      // Let's assume passed newMessages are just the new ones.
      // Ideally, we should use arrayUnion but it doesn't support complex objects perfectly if not unique. 
      // We will perform a merge update for simplicity here.
      
      // Note: In a real production app, consider subcollections for unlimited messages.
      // For this implementation, we will update the 'messages' field with the full history provided by the client
      // OR push the new ones. Let's start by just updating 'updatedAt' and 'preview'.
      
      const lastMessage = newMessages[newMessages.length - 1];
      
      let preview = "New activity...";
      if (lastMessage.role === 'assistant') {
          if (typeof lastMessage.content === 'string') {
              preview = lastMessage.content.substring(0, 50) + "...";
          } else if (lastMessage.type === 'plan' || Array.isArray(lastMessage.content)) {
              preview = "📅 Generated a plan...";
          } else {
              preview = "Sent a message...";
          }
      }

      await updateDoc(chatRef, {
        messages: newMessages, // Saving the FULL state is easiest for sync
        updatedAt: serverTimestamp(),
        preview
      });
    } catch (error) {
      console.error("Error saving messages:", error);
      throw error;
    }
  },

  /**
   * Fetch all chats for a user
   * @param {string} userId 
   * @returns {Promise<Array>}
   */
  getUserChats: async (userId) => {
    try {
      const chatsRef = collection(db, "users", userId, "chats");
      const q = query(chatsRef, orderBy("updatedAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert timestamp to date object for UI if needed, or serialize string
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
    } catch (error) {
      console.error("Error fetching chats:", error);
      return [];
    }
  },

  /**
   * Delete a chat session
   */
  deleteChat: async (userId, chatId) => {
    try {
      await deleteDoc(doc(db, "users", userId, "chats", chatId));
    } catch (error) {
      console.error("Error deleting chat:", error);
      throw error;
    }
  }
};
