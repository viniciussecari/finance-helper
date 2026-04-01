# GEMINI.md - Project: finance-helper

## Project Overview

**`finance-helper`** is a client-side web application for personal finance management, built with Nuxt.js 4. It provides a dashboard to visualize income, expenses, and savings, helping users track their financial health.

The application is designed to be simple and work entirely in the browser, with all data persisted locally using `localStorage`.

### Key Technologies

*   **Framework:** Nuxt.js 4
*   **UI Framework:** Nuxt UI (built on top of Tailwind CSS and Headless UI)
*   **Charting:** Chart.js, integrated via `vue-chartjs`
*   **Language:** TypeScript
*   **Linting/Formatting:** ESLint

## Building and Running

### Prerequisites

*   Node.js (version recommended by Nuxt 4, likely 18+ or 20+)
*   npm (or a compatible package manager)

### Development

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

### Production

*   **Build the application for server deployment:**
    ```bash
    npm run build
    ```

*   **Generate a static, pre-rendered site (for static hosting):**
    ```bash
    npm run generate
    ```

*   **Preview the production build locally:**
    ```bash
    npm run preview
    ```

## Development Conventions

### Architecture

*   **Client-Side Data:** This is a key architectural choice. The application does **not** have a backend database. All user data (expenses, income, etc.) is stored in the browser's `localStorage`. This is managed within the composable files (e.g., `app/composables/useExpenses.ts`).
*   **Composable-based State:** Application state and business logic are encapsulated in Nuxt 3 composables (e.g., `useExpenses`, `useMonthlyIncome`). These use `useState` to create and manage reactive state that is shared across components.
*   **Component Structure:** The UI is built with Vue 3 components located in `app/components/`. Pages that represent different views of the application are in `app/pages/`.
*   **Styling:** Styling is primarily done using Tailwind CSS utility classes, following the conventions of Nuxt UI. Custom global styles can be found in `app/assets/css/main.css`.

### Key Files and Directories

*   `package.json`: Defines project scripts (`dev`, `build`) and dependencies.
*   `nuxt.config.js`: The main configuration file for the Nuxt.js project, where modules and plugins are configured.
*   `app/`: The main application directory.
    *   `pages/`: Contains the application's routes and views. `index.vue` is the main dashboard page.
    *   `components/`: Reusable Vue components (e.g., `MetricCard.vue`, `DonutChart.vue`).
    *   `composables/`: Contains the core logic and state management (e.g., `useExpenses.ts`). This is the "brain" of the application.
    *   `layouts/`: Defines the main layout structure (`default.vue`).
*   `public/`: For static assets that don't need to be processed by the build system.
