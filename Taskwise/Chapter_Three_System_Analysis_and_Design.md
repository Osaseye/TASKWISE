# CHAPTER THREE: SYSTEM ANALYSIS AND DESIGN

## 3.1 Introduction
This chapter details the analysis and design phase of the TaskWise software project. It covers the assessment of the existing methods for task management, presents the proposed AI-integrated solution, and provides an in-depth exploration of the system requirements. The chapter further elaborates on the architectural design, database modeling, algorithm specifications, and the various development tools carefully selected for the successful realization of the project.

## 3.2 Analysis of Existing System
The traditional approach to task management relies heavily on manual ledgers, physical diaries, and disparate digital tools that lack integrated intelligence. While basic digital to-do lists offer rudimentary tracking capabilities, they generally lack automated task prioritization, deadline prediction, and contextual insights. Furthermore, users often spend excessive time manually entering task metadata (such as dates, times, and priority levels) into fragmented category structures. These limitations culminate in cognitive overload, making it difficult for users to maintain a streamlined organizational strategy and optimize their deep work sessions. 

## 3.3 Proposed System
The proposed system, TaskWise, is an intelligent, real-time, and highly responsive web-based task management application. Its primary purpose is to integrate natural language processing with robust task lifecycle tracking to augment personal productivity. 

**Target Users:** Students, professionals, and individuals seeking an organized, streamlined workflow with automated scheduling capabilities.

**Core Objectives:**
1. To provide a centralized dashboard for monitoring daily tasks and long-term habits.
2. To integrate Google Vertex AI for translating unstructured, natural language user inputs into scheduled tasks.
3. To facilitate task categorization, synchronization, and automated recurrence capabilities (daily, weekly, monthly).
4. To track completion rates and generate intelligent productivity insights.

**Key Improvements Over Existing Methods:**
* **Natural Language Task Creation:** Replaces manual form-filling with an intelligent parser (`parseTaskCommand`) capable of understanding intent and extracting structural attributes like time, recurrence, and priorities.
* **Predictive Insights:** Uses AI to review completed tasks and generate real-time productivity advice.
* **Serverless Scale:** Utilizes Firebase Cloud Infrastructure (Firestore) to offer seamless synchronization without localized database downtime.

## 3.4 System Requirements

### 3.4.1 Functional Requirements
Based on the software structure, the system encompasses the following functional requirements:
1. **User Authentication:** The system must allow users to register, log in, manage their profile, and securely recover their passwords using an integrated authentication service (Firebase Authentication) supporting both traditional credentials and OAuth (Google Sign-In).
2. **Task Creation and Management:** Users must be able to create standard and recurring tasks, categorizing them and defining respective priority levels (High, Medium, Low).
3. **AI Task Parsing:** The application must parse free-text commands and autonomously extract variables such as due date, repeat intervals, and task context.
4. **Dashboard and Analytics:** The system must display a dynamic dashboard rendering real-time statistics (e.g., completion rate, focus time, streak computation).
5. **Interactive UI Routing:** The system must restrict unauthenticated users from accessing protected domains (Dashboard, Profile, Settings) via protected route components.
6. **Chat Assistant:** The system must supply an AI chat window permitting conversational context regarding the user's workflow.

### 3.4.2 Non-Functional Requirements
1. **Security:** The system validates structural permissions and secure queries explicitly via `firestore.rules`. Access is restricted verifying authentication states and utilizing UID checks (`request.auth.uid == userId`) to isolate user domains. 
2. **Performance Optimization:** Through the use of `react-loading-skeleton` and concurrent React hooks, the application provides perceived latency reduction. Real-time Firebase listeners (`onSnapshot`) optimize continuous refetching. 
3. **Usability:** The user interface adheres to a modern, dark-themed responsive configuration utilizing Tailwind CSS and Framer Motion for highly fluid, stateless animations rendering smoothly across mobile and desktop environments.
4. **Scalability:** Employing a Backend-as-a-Service (BaaS) paradigm bypasses traditional monolithic limitations, enabling the database schemas and authentication pooling to scale uniformly under horizontal loads.
5. **Maintainability:** The frontend conforms to a componentized framework isolating pages, UI elements (e.g., Modals, Breadcrumbs), services, and specific React contexts (`TaskContext`, `AuthContext`), promoting codebase longevity and debugging ease.

## 3.5 System Architecture
The application employs a **Serverless Client-Server Architecture** adopting aspects of the Model-View-Controller (MVC) pattern predominantly on the client side.

* **Frontend Architecture (View & Controller):** Built fundamentally on React 19 and Vite. The State Management relies on React Context APIs (`AuthContext`, `TaskContext`, etc.) serving as contextual control agents passing state downstream to presentation components (Views). Application routing is executed via `react-router-dom`. 
* **Backend Structure (Model & Backend Services):** The backend is abstracted to Google Firebase interacting natively with the client using Firebase SDKs. It eliminates the traditional Node.js/Express middleware layer, opting for a secure zero-trust pipeline handled via Firestore rules.
* **AI Architecture Flow:** When an AI request fires, `aiService.js` structures a dynamic prompt based on localized data, queries the Google Vertex AI/Gemini endpoint (in application/json mime type for structured tasks), and parses the data directly back into the component state.
* **Database Structure:** Real-time NoSQL document-oriented data model utilizing Firebase Firestore. 

## 3.6 System Design Models

### 3.6.1 Use Case Diagram (Descriptive)
* **Actors:** Authenticated User, AI Engine.
* **Interactions:** The User interacts with the UI to "Add Task", "Complete Task", or "Ask AI". The System processes CRUD queries against the Firestore database. The AI Engine actor intercepts "Natural Language Requests", processes them, and returns "JSON Task Properties". 

### 3.6.2 Class Diagram Concept
* `User`: Attributes include `uid`, `email`, `displayName`, `photoURL`, `lastLogin`.
* `Task`: Attributes include `taskId`, `title`, `description`, `dueDate`, `recurrence`, `priority`, `category`, `completed`, `userId`. Provides methods like `calculateNextDueDate()`.
* `Notification`: Attributes include `notificationId`, `type`, `message`, `userId`.
* `AIService`: Methods including `parseTaskCommand(command)`, `generatePlan(request)`, `chat(message)`, `generateInsights(tasks)`.

### 3.6.3 Sequence Diagram (AI Task Creation Workflow)
1. User provides a string (e.g., "Remind me to submit project every Tuesday").
2. Client Component sends string to `aiService.parseTaskCommand()`.
3. `aiService` encapsulates the strings with strict prompt guidelines and sends a request to Vertex AI API.
4. Vertex AI computes and responds with a standardized JSON object.
5. Client decodes JSON and dispatches to `TaskContext.addTask()`.
6. Firebase SDK commits the new document to Firestore.
7. Firestore emits an `onSnapshot` trigger refecting the UI in real-time.

### 3.6.4 Activity Diagram
1. User accesses the application URL.
2. System verifies Auth Token. If invalid, routes to `/login`.
3. Post-authentication, `TaskContext` binds a real-time Firestore listener.
4. Dashboard successfully renders populated tasks and streak calculations.
5. User interaction seamlessly updates data models.

## 3.7 Database Design
The application utilizes a scalable NoSQL database architecture (Google Firestore) comprising distinct root collections:

1. **`users` Collection:**
   * **Key:** `userId` (Document ID)
   * **Fields:** Registration variables, metadata, preferences.
   * **Subcollection:** `chats` (Stores user conversations with the AI module; relationship 1:M constraint).
2. **`tasks` Collection:**
   * **Key:** `taskId` (Document ID)
   * **Fields:** `title` (String), `description` (String), `startDate` (Timestamp), `startTime` (String), `priority` (String), `category` (String), `dueDate` (String/Date), `recurrence` (Map: `type`, `interval`, `endDate`), `completed` (Boolean), `createdAt` (Timestamp), `completedAt` (Timestamp).
   * **Foreign Key Structure:** `userId` points precisely to the `users` collection to guarantee localized retrieval.
3. **`notifications` Collection:**
   * **Key:** `notificationId` (Document ID)
   * **Fields:** `title`, `message`, `type`, `read`, `createdAt`.
   * **Foreign Key Structure:** `userId`.

**Normalization Level:** Being a NoSQL structure, data leans inherently towards denormalization for faster read throughput, though explicit referencing (`userId`) retains logical entity separation consistent with fundamental relational logic.

## 3.8 System Flow and Algorithms
**Recurrence Calculation Algorithm:** 
Housed within the `TaskContext`, whenever a recurring task is processed, `calculateNextDueDate(currentDateStr, recurrence)` extracts the recurrence `type` (daily, weekly, monthly) and algorithmically computes the forward temporal increment utilizing standard computational date mutations.

**NLP Parsing Pipeline Fallback Logic:**
The system contains an intelligent fail-safe (`parseTaskCommandFallback`) within `aiService.js`. If the remote Vertex AI server times out, the flow applies basic NLP heuristics to extract keywords (e.g., if input `.includes('urgent')`, priority switches to "High"; if `.includes('tomorrow')`, due dates adjust using `new Date() + 1` iterations).

## 3.9 Development Tools
* **Programming Languages:** JavaScript (ES6+), JSX.
* **Core Frameworks & Libraries:** React.js 19.2, Vite 7.2.
* **UI & Styling:** Tailwind CSS 3.4, Framer Motion (animations), Recharts (data visualization), Lucide-React (iconography).
* **Database & BaaS:** Firebase 12.7 (Firestore, Auth, Analytics).
* **AI & Machine Learning Engine:** `@google/generative-ai` (Gemini 2.5 Flash / Google Vertex AI).
* **Hosting and Continuous Integration:** Vercel.