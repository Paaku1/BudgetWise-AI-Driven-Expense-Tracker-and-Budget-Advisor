# BudgetWise: AI-Driven Expense Tracker & Budget Advisor

BudgetWise is a full-stack web application designed to help users manage their personal finances effectively. It provides a modern, intuitive interface for tracking expenses, setting budgets, and visualizing financial habits. The application leverages a powerful Spring AI backend to offer intelligent insights, personalized advice, and an interactive chatbot experience.

---

## ✨ Features

- **Secure Authentication**: JWT-based registration and login system.
- **Comprehensive Dashboard**: At-a-glance view of monthly income, expenses, and money left to spend.
- **Transaction Management**: Full CRUD (Create, Read, Update, Delete) functionality for income, expense, and savings transactions.
- **Budget Tracking**: Set and monitor monthly budgets for different spending categories with visual progress bars.
- **Savings Goals**: Create and track progress towards financial goals.
- **Advanced Financial Analysis**:
    - Interactive charts (Pie, Bar, Line) to visualize spending habits.
    - Monthly heatmaps to identify high-spending days.
    - Detailed breakdown of expenses, income, and savings by category and month.
- **AI-Powered Assistant**:
    - An integrated chatbot (powered by Spring AI & Ollama) that answers financial questions based on the user's personal data.
    - Proactive AI-generated tips and suggestions for better financial management.
- **Community Forum**: A dedicated space for users to share tips, ask questions, and interact with each other.
- **Data Portability**: Import transactions from Excel and export transaction data to PDF or Excel.

---

## 🛠️ Tech Stack

-   **Backend**:
    -   Java 17+
    -   Spring Boot 3
    -   Spring Security & JWT
    -   JPA / Hibernate
    -   PostgreSQL
    -   Spring AI (with Ollama)
    -   Maven
-   **Frontend**:
    -   Angular 17+
    -   TypeScript
    -   SCSS
    -   Chart.js (ng2-charts)
    -   ApexCharts

---

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

-   [Java Development Kit (JDK) 17 or newer](https://www.oracle.com/java/technologies/downloads/)
-   [Apache Maven](https://maven.apache.org/download.cgi)
-   [Node.js and npm](https://nodejs.org/en/download/)
-   [PostgreSQL](https://www.postgresql.org/download/)
-   [Ollama](https://ollama.com/) (for the AI features)
    -   After installing Ollama, pull a model: `ollama pull llama2`

### Backend Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Paaku1/BudgetWise-AI-Driven-Expense-Tracker-and-Budget-Advisor
    ```
2.  **Navigate to the backend directory:**
    ```sh
    cd BudgetWise-AI-Driven-Expense-Tracker-and-Budget-Advisor/Backend
    ```
3.  **Configure the database:**
    -   Open `src/main/resources/application.properties`.
    -   Update the `spring.datasource.url`, `spring.datasource.username`, and `spring.datasource.password` properties with your local PostgreSQL credentials.
4.  **Run the application:**
    ```sh
    mvn spring-boot:run
    ```
    The backend will start on `http://localhost:5000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd BudgetWise-AI-Driven-Expense-Tracker-and-Budget-Advisor/app
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Run the application:**
    ```sh
    ng serve
    ```
    The frontend will be available at `http://localhost:4200`.

---

## 📄 API Endpoints

The backend exposes a RESTful API for the frontend to consume. Key endpoints include:

-   `POST /register`: User registration.
-   `POST /login`: User authentication.
-   `GET /transactions/{userId}`: Fetch all transactions for a user.
-   `POST /transactions/{userId}`: Add a new transaction.
-   `GET /api/analysis/expense-summary/{userId}`: Get a summary of monthly expenses.
-   `POST /api/ai/chat/{userId}`: Interact with the AI chatbot.
-   `GET /api/forum/posts`: Fetch all forum posts.
-   `POST /api/forum/posts`: Create a new forum post.

... and many more for budgets, savings goals, and detailed analysis.

---

Congratulations on building such a feature-rich application!