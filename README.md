# 🚀 Orders Management Panel

A React-based web application for managing customers and orders. This project demonstrates **React, TypeScript, TanStack Query, and Material UI** while integrating with a backend service.

---

## 📌 **Technologies Used**

### **Frontend**

-   **[Vite](https://vitejs.dev/)** – Fast and optimized development server and build tool.
-   **[React](https://react.dev/)** – Component-based UI library for building interactive applications.
-   **[TypeScript](https://www.typescriptlang.org/)** – Ensures type safety and maintainable code.
-   **[React Router](https://reactrouter.com/)** – Handles client-side routing for navigating between pages.
-   **[TanStack Query](https://tanstack.com/query/v4/)** – For efficient data fetching, caching, and state synchronization.
-   **[Material UI](https://mui.com/)** – Provides accessible, responsive, and customizable UI components.
-   **[Axios](https://axios-http.com/)** – Simplifies HTTP requests and API interactions.

### **Tooling & Configuration**

-   **ESLint & Prettier** – Enforces code quality and formatting consistency.
-   **GitHub Actions** – Automates CI/CD to validate builds on push and pull requests.

---

## 🚀 **Getting Started**

### **1️⃣ Prerequisites**

-   Install **[Node.js](https://nodejs.org/)** (Recommended: v18+)
-   Install **[Git](https://git-scm.com/)**

### **2️⃣ Clone the Repository**

```sh
git clone https://github.com/CircleHP/o-systems.git
cd o-systems
```

### **3️⃣ Install Dependencies**

```sh
npm install
```

### **4️⃣ Start Development Server**

```sh
npm run dev
```

-   The app will be available at: **`http://localhost:5173/`**

### **5️⃣ Build for Production**

```sh
npm run build
```

### **6️⃣ Run Linter**

```sh
npm run lint
```

---

## 📜 **Available Commands**

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Starts the Vite dev server     |
| `npm run build`   | Builds the app for production  |
| `npm run preview` | Serves the built app locally   |
| `npm run lint`    | Lints the codebase with ESLint |
| `npm run format`  | Formats code using Prettier    |

---

## 🤖 **GitHub Actions: CI/CD Workflow**

This project includes **GitHub Actions** for automated build validation.

### **📌 Workflow File: `.github/workflows/build.yml`**

### **✅ What it Does:**

-   Runs **on push & pull requests** to `main` and `develop` branches.
-   **Installs dependencies** using `npm ci`.
-   **Builds the project** using `npm run build`.
-   **Fails the workflow** if the build is unsuccessful.

### **📜 How to Check Workflow Status?**

Go to your repo’s **Actions tab** → Check for `Build Check` workflow results.

---

## 📌 **Project Structure**

```
📦 orders-management-panel
├── 📂 src                # Main application code
│   ├── 📂 components     # Reusable UI components
│   ├── 📂 pages          # Application pages (Customers, Orders)
│   ├── 📂 services       # API handlers (Axios-based)
│   ├── 📂 contexts       # Context Providers (Theme, State)
│   ├── 📂 utils          # Helper functions (date formatting, etc.)
│   ├── 📂 routes         # Application routes
│   ├── main.tsx         # Entry point
│   ├── App.tsx          # Root component
├── 📂 public            # Static assets (favicon, index.html)
├── 📂 .github           # GitHub Actions workflows
├── 📜 package.json      # Project dependencies & scripts
├── 📜 tsconfig.json     # TypeScript configuration
├── 📜 vite.config.ts    # Vite configuration
└── 📜 README.md         # Project documentation
```
