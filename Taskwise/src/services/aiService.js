import { ai } from "../firebase";
import { getGenerativeModel } from "firebase/ai";

// Initialize the model
const MODEL_NAME = "gemini-2.5-flash";

// Model for structured JSON output
const jsonModel = getGenerativeModel(ai, { 
  model: MODEL_NAME,
  generationConfig: {
    responseMimeType: "application/json"
  }
});

// Model for chat (text output)
const chatModel = getGenerativeModel(ai, { 
  model: MODEL_NAME,
});

export const aiService = {
  /**
   * Parse a natural language command to create a task
   */
  parseTaskCommand: async (command) => {
    try {
      const prompt = `
      You are a smart task assistant. Extract structured task details from the following command.
      Return ONLY a valid JSON object.

      Command: "${command}"
      
      Current Date: ${new Date().toISOString()}

      Output Schema:
      {
        "title": "string",
        "priority": "High" | "Medium" | "Low",
        "startDate": "YYYY-MM-DD",
        "startTime": "HH:MM" (24h format) or null,
        "recurrence": { 
          "type": "daily" | "weekly" | "monthly" | "yearly", 
          "interval": number,
          "endDate": "YYYY-MM-DD" or null
        } or null,
        "category": "Work" | "Personal" | "Health" | "Finance" | "Education"
      }

      Rules:
      - If no time is mentioned, set "startTime" to "09:00".
      - "Until [date]" sets the "recurrence.endDate".
      - "Every 2 days" -> interval: 2.
      `;

      const result = await jsonModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error("Vertex AI Parse Error:", error);
      return aiService.parseTaskCommandFallback(command);
    }
  },

  parseTaskCommandFallback: async (command) => {
    // Fallback logic for when AI fails or is offline
    await new Promise(resolve => setTimeout(resolve, 500));
    const lowerCmd = command.toLowerCase();
    const task = {
      title: command,
      priority: 'Medium',
      dueDate: null,
      recurrence: null,
      category: 'Personal'
    };

    // Simple keyword extraction
    if (lowerCmd.includes('urgent') || lowerCmd.includes('high')) task.priority = 'High';
    else if (lowerCmd.includes('low')) task.priority = 'Low';

    if (lowerCmd.includes('daily')) task.recurrence = { type: 'daily', interval: 1 };
    else if (lowerCmd.includes('weekly')) task.recurrence = { type: 'weekly', interval: 1 };

    const today = new Date();
    if (lowerCmd.includes('tomorrow')) {
      const d = new Date(today); d.setDate(d.getDate() + 1);
      task.dueDate = d.toISOString();
    } else if (lowerCmd.includes('today')) {
      task.dueDate = today.toISOString();
    }

    return task;
  },

  /**
   * Generate insights based on completed tasks
   */
  generateInsights: async (tasks) => {
    if (!tasks || tasks.length === 0) {
      return [
        "You're doing great! Keep up the momentum.",
        "Try to tackle high priority tasks first thing in the morning.",
        "Remember to take breaks between deep work sessions."
      ];
    }

    try {
      const tasksSummary = tasks.slice(0, 20).map(t => 
        `- ${t.title} (${t.completed ? 'Completed' : 'Pending'}, Priority: ${t.priority})`
      ).join('\n');

      const prompt = `
      You are a productivity expert. Analyze the following tasks and provide 3 short, encouraging productivity insights or tips.
      Return ONLY a valid JSON array of strings.

      Tasks:
      ${tasksSummary}
      `;

      const result = await jsonModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error("Vertex AI Insights Error:", error);
      return [
        "Focus on your high priority tasks seamlessly.",
        "Consistency is key to long-term success.",
        "Review your completed tasks to celebrate progress."
      ];
    }
  },

  /**
   * Chat with the AI Assistant
   */
  chat: async (message, history = []) => {
    try {
      // Convert history to Gemini format
      // Note: Gemini expects 'user' and 'model' roles.
      const chatHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const chatSession = chatModel.startChat({
        history: chatHistory,
        generationConfig: {
          maxOutputTokens: 1000,
        },
        systemInstruction: {
          role: "system",
          parts: [{
            text: `
        You are TaskWise AI, a productivity assistant created by Segun.

        Guidelines:
        1. **No Repetition**: Do NOT introduce yourself ("I'm TaskWise...") unless explicitly asked "Who are you?".
        2. **Conciseness**: Be brief and direct. Avoid fluff.
        3. **Formatting**: Use Markdown (bullet points, bold text) to structure your responses.
        4. **Capabilities**: You HAVE a GUI. You can generate interactive plans, tasks, and schedules. If a user asks for a plan, you generate it (the system handles the UI). Do NOT say you "don't have a GUI".
        5. **Spelling**: Ensure perfect spelling.

        Current Date: ${new Date().toDateString()}
        `
          }]
        }
      });

      const result = await chatSession.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Vertex AI Chat Error:", error);
      return aiService.chatFallback(message);
    }
  },

  chatFallback: (message) => {
    const lower = message.toLowerCase();
    if (lower.includes('plan')) return "I can help you plan! (Offline Mode)";
    return "I'm having trouble connecting to the AI service. Please check your connection.";
  },

  /**
   * Generate a structured plan (list of tasks) from a user request
   */
  generatePlan: async (request) => {
    try {
      const prompt = `
      You are a scheduler API. Create a detailed plan based on the request.
      Return ONLY a valid JSON array of task objects.

      Request: "${request}"

      Output Schema (Array of):
      {
        "day": "string" (e.g., "Day 1", "Monday"),
        "title": "string",
        "time": "HH:MM" (24h) or "Anytime",
        "duration": number (minutes),
        "priority": "High" | "Medium" | "Low",
        "category": "string"
      }
      `;

      const result = await jsonModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error("Vertex AI Plan Error:", error);
      return null;
    }
  },

  /**
   * Generate a specific insight for a single task based on similar tasks
   */
  generateTaskSpecificInsight: async (currentTask, historicalTasks) => {
    try {
      const historySummary = historicalTasks
        .filter(t => t.id !== currentTask.id) // Exclude current
        .slice(0, 15)
        .map(t => `- ${t.title} (${t.completed ? 'Done' : 'Pending'}, Cat: ${t.category || 'General'})`)
        .join('\n');

      const prompt = `
      You are a productivity coach. Provide 1 short, actionable, and personalized insight for this specific task.
      Consider the user's task history to see if they often procrastinate on similar tasks or complete them quickly.
      
      Current Task:
      Title: "${currentTask.title}"
      Category: "${currentTask.category}"
      Priority: "${currentTask.priority}"

      User History (Recent 15 tasks):
      ${historySummary}

      Return ONLY a JSON object: { "insight": "string" }
      Keep the insight under 20 words.
      `;

      const result = await jsonModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text).insight;
    } catch (error) {
      console.error("Task Insight Error:", error);
      return "Break this task into smaller sub-tasks to maintain momentum.";
    }
  }
};
