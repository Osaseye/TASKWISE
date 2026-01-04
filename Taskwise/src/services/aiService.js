// Together AI Configuration
const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";
const TOGETHER_MODEL = "mistralai/Mixtral-8x7B-Instruct-v0.1";

/**
 * Helper to call Together AI API
 */
async function callTogetherAI(prompt, systemContext = "") {
  const apiKey = import.meta.env.VITE_TOGETHER_API_KEY;
  
  if (!apiKey) {
    console.warn("VITE_TOGETHER_API_KEY is missing.");
    return null;
  }

  try {
    const response = await fetch(TOGETHER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: TOGETHER_MODEL,
        messages: [
          { role: "system", content: systemContext },
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Together AI API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.choices[0]?.message?.content?.trim();
  } catch (error) {
    console.error("Together AI API call failed:", error);
    return null;
  }
}

/**
 * AI Service for processing natural language commands and generating insights.
 * Uses Together AI (Mixtral-8x7B) with In-Context Learning.
 */
export const aiService = {
  /**
   * Parse a natural language command to create a task
   */
  parseTaskCommand: async (command) => {
    const systemContext = `
You are a smart task assistant. Your job is to extract structured task details from natural language commands.
Return ONLY a valid JSON object. Do not include any explanations or markdown formatting.

Examples:
Input: "Remind me to submit report tomorrow at 5pm priority high"
Output: {"title": "Submit report", "priority": "High", "dueDate": "2026-01-05T17:00:00.000Z", "recurrence": null, "category": "Work"}

Input: "Gym every morning"
Output: {"title": "Gym", "priority": "Medium", "dueDate": "2026-01-04T08:00:00.000Z", "recurrence": {"type": "daily", "interval": 1}, "category": "Health"}

Current Date: ${new Date().toISOString()}
`;

    const response = await callTogetherAI(command, systemContext);

    if (response) {
      try {
        // Clean up potential markdown code blocks if the model adds them
        const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse Together AI response as JSON", e);
      }
    }

    // Fallback Logic
    return aiService.parseTaskCommandFallback(command);
  },


  parseTaskCommandFallback: async (command) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const lowerCmd = command.toLowerCase();
    const task = {
      title: command,
      priority: 'medium',
      dueDate: null,
      recurrence: null,
      category: 'Personal'
    };

    // Priority
    if (lowerCmd.includes('urgent') || lowerCmd.includes('important') || lowerCmd.includes('high')) task.priority = 'High';
    else if (lowerCmd.includes('low')) task.priority = 'Low';

    // Recurrence
    if (lowerCmd.includes('every day') || lowerCmd.includes('daily')) task.recurrence = { type: 'daily', interval: 1 };
    else if (lowerCmd.includes('every week') || lowerCmd.includes('weekly')) task.recurrence = { type: 'weekly', interval: 1 };
    else if (lowerCmd.includes('every month') || lowerCmd.includes('monthly')) task.recurrence = { type: 'monthly', interval: 1 };

    // Date
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
    if (tasks.length > 0) {
      const tasksSummary = tasks.slice(0, 20).map(t => 
        `- ${t.title} (${t.completed ? 'Completed' : 'Pending'}, Priority: ${t.priority})`
      ).join('\n');

      const systemContext = `
You are a productivity expert. Analyze the following tasks and provide 3 short, encouraging productivity insights or tips.
Return ONLY a valid JSON array of strings.

Tasks:
${tasksSummary}
`;
      
      const response = await callTogetherAI("Generate insights", systemContext);
      
      if (response) {
        try {
          const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
          return JSON.parse(jsonStr);
        } catch (e) {
          console.error("Failed to parse Together AI insights", e);
        }
      }
    }

    return [
      "You're doing great! Keep up the momentum.",
      "Try to tackle high priority tasks first thing in the morning.",
      "Remember to take breaks between deep work sessions."
    ];
  },

  /**
   * Chat with the AI Assistant
   */
  chat: async (message, history = []) => {
    // Construct context from history
    const conversationHistory = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
    
    const systemContext = `
You are TaskWise AI, a helpful and friendly productivity assistant.
You help users plan their day, manage tasks, and study schedules.
Keep your answers concise and encouraging.

Conversation History:
${conversationHistory}
`;

    const response = await callTogetherAI(message, systemContext);
    
    if (response) {
      return response;
    }

    return aiService.chatFallback(message);
  },

  chatFallback: (message) => {
    const lower = message.toLowerCase();
    if (lower.includes('plan') || lower.includes('schedule')) return "I can help you plan! Try saying 'Plan my study schedule for tomorrow'. (Offline Mode)";
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return "Hello! I'm your TaskWise assistant. How can I help you be productive today? (Offline Mode)";
    if (lower.includes('help')) return "I can help you create tasks, manage your schedule, and provide productivity tips. (Offline Mode)";
    return "I'm having trouble connecting to the cloud, but I'm still here! Try adding a task manually or check your internet connection.";
  }
};
