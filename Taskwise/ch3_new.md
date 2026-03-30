# CHAPTER THREE: SYSTEM ANALYSIS AND DESIGN

## 3.1 Introduction
This chapter meticulously delineates the system analysis and architectural design phases of the TaskWise application. In the software engineering lifecycle, this phase bridges the conceptual requirements with the technical blueprints required for development. This chapter encompasses a critical evaluation of the existing paradigms of task management, proposes an intelligent AI-driven alternative, and breaks down the functional and non-functional requirements. Furthermore, it formulates the application’s underlying architecture, mapping out user interactions, database schemas, and the algorithmic logic that powers the natural language processing features of the platform.

## 3.2 Analysis of Existing System
The traditional approaches to personal productivity and task management can be broadly categorized into manual paper-based tracking and conventional digital to-do lists. 

### 3.2.1 Limitations of the Existing Paradigm
* **High Cognitive Load:** Existing digital solutions (e.g., standard native note apps or basic task trackers) require users to manually navigate multiple form fields (title, date, time, priority, category) forcing a context switch that interrupts their workflow.
* **Lack of Contextual Intelligence:** Traditional systems are strictly passive. They store and retrieve data but fail to analyze user habits, prioritize tasks dynamically, or extract actionable structured data from unstructured human thoughts.
* **Static Categorization:** Users are forced into rigid folder capabilities. If a user needs a recurring task, they must manually configure complex cron-like UI settings rather than simply stating their intent.
* **Absence of Actionable Insights:** Conventional systems lack the capability to review a user's completion history to provide encouraging or corrective productivity insights, leaving the user without meaningful feedback on their performance.

## 3.3 Proposed System
In response to the deficiencies of conventional task managers, the proposed system, **TaskWise**, is an intelligent, real-time, context-aware web application designed to augment human productivity through artificial intelligence.

### 3.3.1 Core Objectives and Scope
1. **Natural Language Processing (NLP):** To integrate an advanced AI module (powered by Google Vertex AI / Gemini 2.5 Flash) capable of parsing unstructured, conversational input (e.g., *"Remind me to submit the software report every Friday at 5 PM"*) and autonomously converting it into fully structured task data.
2. **Real-Time Synchronization:** To deploy a responsive dashboard that synchronizes state instantaneously across sessions without manual page reloading, utilizing WebSocket-like listeners via Firebase.
3. **Advanced Analytics & Habit Tracking:** To algorithmically compute user streaks, focus times, and completion rates to visualize productivity dynamically.
4. **Resilient Offline Capabilities:** To implement heuristic fallback algorithms that ensure tasks can still be generated and prioritized even when the primary AI cloud service is temporarily unreachable.

## 3.4 System Requirements
A comprehensive requirement engineering process was conducted, resulting in the following critical specifications.

### 3.4.1 Functional Requirements
The system MUST provide the capabilities outlined below:
* **FR-01 (Authentication Integration):** The system must allow users to authenticate securely utilizing external OAuth providers (Google Sign-In) and manage active sessions consistently.
* **FR-02 (AI Command Parsing):** The system must accept natural text inputs and leverage generative AI to return valid JSON describing the task's `title`, `priority`, `startDate`, `startTime`, and `recurrence` pattern.
* **FR-03 (Task Lifecycle Management):** An authenticated user must be permitted to Create, Read, Update (including toggling completion status), and Delete (CRUD) tasks. 
* **FR-04 (Automated Recurrence Engine):** The system must compute and extrapolate the next iteration of a recurring task (Daily, Weekly, Monthly) automatically upon completion of the current instance.
* **FR-05 (Dynamic Dashboard Visualization):** Real-time analytics highlighting task completion milestones, current daily focus configurations, and upcoming scheduled events must be rendered programmatically.
* **FR-06 (Contextual AI Assistant):** Users must have access to an interactive sidebar assistant for free-form scheduling advice and direct plan generation.

### 3.4.2 Non-Functional Requirements
* **NFR-01 (Security Constraints):** All database read/write queries must be strictly isolated at the systemic level using rule-based middleware, ensuring a user (`request.auth.uid`) can never access or mutate another user's documents.
* **NFR-02 (Performance & Latency):** Leveraging `react-loading-skeleton`, the user interface must render perceived layouts within 200ms of navigation to prevent Cumulative Layout Shift (CLS) and ensure a seamless User Experience (UX).
* **NFR-03 (Scalability):** The backend infrastructure architecture must gracefully auto-scale. The adoption of a Serverless database (Firestore) precludes the need for manual load balancing of database instances.
* **NFR-04 (Maintainability):** The frontend source code must adhere strictly to functional encapsulation separated into Context APIs for state injection, eliminating "prop-drilling" and enhancing component reusability.

## 3.5 System Architecture
The application embodies a **Serverless Client-Server MVC Paradigm**. Rather than relying on a traditional monolithic server (e.g., a clustered Express/Node.js or Django environment), the system shifts controller logic onto the intelligent client and delegates storage modeling to Google Firebase.

### 3.5.1 The Client-Side (View & Controller Interface)
Developed utilizing React.js 19 and Vite. The frontend adopts an advanced composition matrix:
* **The View Layer:** Composed utilizing Tailwind CSS and Framer Motion. Components are modularized into granular folders (e.g., `components/dashboard`, `components/common`). 
* **State Managers:** React Contexts (`TaskContext`, `AuthContext`) sit inherently above the View layer, serving as the application Controllers. They maintain continuous synchronization loops tracking document mutations in real-time.

### 3.5.2 The Backend-as-a-Service (Model & Middleware)
The backend leverages Google Cloud via Firebase. 
* **Firestore:** Acts as the data Model mapping entities to collections and documents.
* **Data Gateways (`firestore.rules`):** Acts as the Middleware Layer validating schema rules and authentication states implicitly before data traversal reaches the database kernel.

## 3.6 System Design Models

### 3.6.1 Use Case Diagram Description
The holistic interaction model centers around two primary actors: the **User** and the **AI Processing Engine**.
* **Actor: User** -> Can execute use cases such as: "Authenticate via Google", "Create Task Manually", "Trigger AI Prompt", "View Analytics", "Toggle Task State".
* **Actor: AI Engine** -> Integrates with "Trigger AI Prompt" to perform underlying use cases: "Extract Parameters", "Format JSON", or "Failover to Local Heuristics".

### 3.6.2 Modular Class & Sequence Interactions
1. **The NLP AI Sequence Workflow:**
   * *Step 1:* The User inputs a command string via the UI (`AIAssistantSidebar.jsx`).
   * *Step 2:* The React view dispatches the query to `aiService.parseTaskCommand(command)`.
   * *Step 3:* The application constructs a heavily guarded prompt defining strictly typed output schemas.
   * *Step 4:* An HTTP request wrapped in the Vertex AI SDK invokes the `gemini-2.5-flash` model.
   * *Step 5:* The AI endpoint returns structured `application/json` data.
   * *Step 6:* The `TaskContext` consumes the sanitized object, executing a `setDoc` trigger appending the task to the cloud persistence layer.

## 3.7 Database Design
The proposed architecture adopts a flexible, horizontally scalable NoSQL database structure (Cloud Firestore). Below is the comprehensive architectural layout mapping the primary collections.

### Table 3.1: Users Collection (`/users/{userId}`)
| Field Name | Data Type | Description | Key Alignment |
| :--- | :--- | :--- | :--- |
| `userId` | String | Unique identifier generated by Firebase Auth | Document ID (PK Equivalent) |
| `email` | String | User's authenticated email address | Attribute |
| `displayName` | String | Extracted profile nomenclature | Attribute |
| `photoURL` | String | Authenticated avatar URI string | Attribute |
| `createdAt` | Timestamp | Temporal marker denoting account genesis | Attribute |

*(Note: Contains a sub-collection for `chats` establishing a 1:M relationship mapping historical interactions unique to the user's localized domain).*

### Table 3.2: Tasks Collection (`/tasks/{taskId}`)
| Field Name | Data Type | Description | Key Alignment |
| :--- | :--- | :--- | :--- |
| `taskId` | String | System generated distinct alphanumeric ID | Document ID (PK Equivalent) |
| `userId` | String | User ownership declaration | Reference (FK Equivalent) |
| `title` | String | The explicit naming convention of the task | Attribute |
| `dueDate` | String (ISO) | ISO formatted temporal deadline | Attribute |
| `priority` | String | Categorical hierarchy ("High", "Medium", "Low") | Attribute |
| `recurrence` | Map/Object | Dictates repetition logic (`type`, `interval`) | Embedded Model |
| `completed` | Boolean | Binary pivot dictating success/fail status | Attribute |

## 3.8 System Logic and Core Algorithms
The intelligence of TaskWise is fortified by advanced procedural algorithms handling offline degradation and recursive task creation.

* **Fail-Safe Iterative NLP Parsing (`parseTaskCommandFallback`):**
  If a network fault inhibits communication with Vertex AI, the system triggers a manual heuristic lexical analyzer. It parses the raw string utilizing native JavaScript `toLowerCase().includes()` chaining. Identifying substrings like *"urgent"* assigns maximal priority, whilst variables matching *"tomorrow"* invoke the native `Date` object mutating `T+1` day offsets ensuring system reliability during degraded network performance.
* **Temporal Recurrence Algorithm:**
  Managed within the `calculateNextDueDate()` subroutine. Whenever an actively recurring task is validated as completed, the algorithm intercepts the state change. It evaluates the string parameter of `recurrence.type` and cross-examines it against a `switch` operator, incrementing the native temporal entity by localized parameters before initializing a brand-new task clone containing the updated execution date.

## 3.9 Development Tools
Ensuring optimum performance dictated the selection of modern, industry-standard deployment and operational frameworks:
1. **Core Language:** JavaScript specifically superset configurations running ES6+ alongside modern JSX rendering semantics.
2. **Build Optimizer:** Vite (v7) – Providing Lightning-fast Hot Module Replacements fundamentally outpacing legacy configurators like Webpack.
3. **Application Library:** React.js (v19) – For granular Virtual DOM manipulations.
4. **Style Configuration:** Tailwind CSS executing atomic, utility-first CSS rendering highly customized dark-mode paradigms inherently mapped into `tailwind.config.js`.
5. **AI API Integrations:** `@google/generative-ai` library interacting with `vertexAIBackend` definitions natively supported under Firebase's unified ecosystems.