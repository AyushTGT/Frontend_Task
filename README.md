# User & Task Management System (Frontend)

A robust and secure User & Task Management tool built in JavaScript using the ReactJS framework. This application allows efficient management of users and tasks, with real-time notifications via Pusher.

---

## Features

- **User Management:**  
  Create, update, delete, and filter users. Export user details as CSV.
- **Task Management:**  
  Assign, update, and track tasks for each user. Retrieve task metrics.
- **Real-Time Notifications:**  
  Live updates using [Pusher](https://pusher.com/).
- **Kanban Board:**  
  Dynamic shifting and visualization of task cards.
- **Charts & Metrics:**  
  Dashboard with metrics and graphs using [react-chartjs-2](https://github.com/reactchartjs/react-chartjs-2).
- **Authentication:**  
  Login, register, forget password, and reset password pages.
- **Modal & Error Handling:**  
  Modals for adding/editing details and showing errors.
- **State Management:**  
  Uses Redux and Redux Form.

---

## Pages

- **Login Page**
- **Register Page**
- **Forgot/Reset Password**
- **Dashboard:**  
  First landing page with metrics and graphs.
- **User Listing Page:**  
  List with filtering, add and delete user functionality.
- **Task Listing Page:**  
  List with filtering, add and delete task functionality.
- **Profile Header & SideBar:**  
  User profile and navigation through Sidebar.
- **Kanban Board:**  
  Drag-and-drop for dynamic task management.

---

## Dependencies

- `@ant-design/icons: ^6.0.0`
- `@dnd-kit/core: ^6.3.1`
- `@pusher/push-notifications-web: ^1.1.0`
- `chart.js: ^4.5.0`
- `pusher-js: ^8.4.0`
- `react: ^19.1.0`
- `react-chartjs-2: ^5.3.0`
- `react-dom: ^19.1.0`
- `react-redux: ^9.2.0`
- `react-router-dom: ^7.6.2`
- `redux: ^5.0.1`
- `redux-form: ^8.3.10`

---

## Getting Started

1. **Clone the Repository**
    ```sh
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2. **Install Dependencies**
    ```sh
    npm install
    ```

3. **Environment Setup**
    - Copy `.env.example` to `.env` (if available) and update environment variables as needed.

4. **Run the Application**
    ```sh
    npm start
    ```
    - The app will open at [http://localhost:3000](http://localhost:3000).

5. **Build for Production**
    ```sh
    npm run build
    ```
