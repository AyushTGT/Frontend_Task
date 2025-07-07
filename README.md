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

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the Repository**
    ```sh
    git clone https://github.com/AyushTGT/user-task-management-frontend.git
    cd user-task-management-frontend
    ```

2. **Install Dependencies**
    ```sh
    npm install
    ```

3. **Environment Setup**
    Create a `.env` file in the root directory and add the respective variables.

4. **Run the Application**
    ```sh
    npm start
    ```
    - The app will open at [http://localhost:3000](http://localhost:3000).

5. **Build for Production**
    ```sh
    npm run build
    npm run preview     # Preview production build
    ```

---

## 🚀 Pusher Setup

### Step 1: Create Pusher Account
1. Go to [Pusher.com](https://pusher.com) and create a free account
2. Create a new Channels app
3. Select your cluster (e.g., `ap2` for Asia Pacific)

### Step 2: Get Your Credentials
Navigate to your app's "App Keys" section and copy:
- **App ID**
- **Key** (Public Key)
- **Secret** (Private Key)
- **Cluster**

### Step 3: Configure Environment Variables
```env
REACT_APP_PUSHER_KEY=your_app_key_here
REACT_APP_PUSHER_CLUSTER=ap2
REACT_APP_PUSHER_APP_ID=your_app_id_here
```

### Step 4: Backend Configuration
Make sure your backend is also configured with the same Pusher credentials:
```javascript
// Backend pusher configuration
const pusher = new Pusher({
  appId: "your_app_id",
  key: "your_app_key",
  secret: "your_app_secret",
  cluster: "ap2",
  useTLS: true
});
```

### Step 5: Test Connection
```sh
npm start              # Start the app
# Check browser console for Pusher connection logs
```

---

## Project Structure

```
public/
├── favicon.ico                     # App favicon
├── index.html                      # Main HTML template
├── logo192.png                     # PWA logo (192x192)
├── logo512.png                     # PWA logo (512x512)
├── manifest.json                   # PWA manifest file
├── robots.txt                      # SEO robots configuration
└── service-worker.js               # PWA service worker

src/
├── apis/
│   ├── taskapis.jsx                # Task-related API calls
│   └── userapis.jsx                # User-related API calls
├── components/
│   ├── Dashboard.css               # Dashboard styling
│   ├── Dashboard.jsx               # Main dashboard component
│   ├── ForgotPassword.jsx          # Forgot password form
│   ├── header.css                  # Header styling
│   ├── Header.jsx                  # Main header component
│   ├── HeaderDashboard.jsx         # Dashboard header variant
│   ├── Login.jsx                   # Login page component
│   ├── Loginform.jsx               # Login form component
│   ├── register.css                # Registration styling
│   ├── Register.jsx                # Registration page
│   ├── Registration.jsx            # Registration form
│   ├── ResetEmail.jsx              # Email reset component
│   ├── ResetPassForm.jsx           # Password reset form
│   ├── ResetPassword.jsx           # Password reset page
│   ├── Sidebar.jsx                 # Navigation sidebar
│   ├── Terms.jsx                   # Terms and conditions
│   ├── UserPofile.jsx              # User profile page
│   ├── UserProfiledetail.jsx       # Profile details component
│   └── verifiedEmail.jsx           # Email verification page
├── componentsTask/
│   ├── Kanban/
│   │   ├── Kanban.css              # Kanban board styling
│   │   ├── KanbanBoard.jsx         # Main kanban board
│   │   ├── KanbanCard.jsx          # Individual task card
│   │   ├── KanbanColumn.jsx        # Kanban column component
│   │   ├── KanbanItem.jsx          # Kanban item wrapper
│   │   └── KanbanListing.jsx       # Kanban list view
│   ├── AllTasks.jsx                # All tasks overview
│   ├── Dashboard.css               # Task dashboard styling
│   ├── Dashboard.jsx               # Task dashboard
│   ├── Header.jsx                  # Task section header
│   ├── Home.jsx                    # Task home page
│   ├── MetricCard.css              # Metrics card styling
│   ├── MetricCards.jsx             # Dashboard metrics
│   ├── Notification.jsx            # Notification component
│   ├── Sidebar.css                 # Task sidebar styling
│   ├── Sidebar.jsx                 # Task navigation sidebar
│   └── Tasklisting.jsx             # Task list component
├── modals/
│   ├── AddTaskModal.jsx            # Task creation modal
│   ├── ErrorModal.jsx              # Error message modal
│   ├── SuccessModal.jsx            # Success message modal
│   ├── TaskDetailModal.jsx         # Task details modal
│   ├── UserModal.jsx               # User details modal
│   └── UserModalAdd.jsx            # Add user modal
├── redux/
│   ├── action.js                   # Redux action creators
│   ├── profileActions.js           # Profile-specific actions
│   ├── profileReducer.js           # Profile state reducer
│   ├── reducer.js                  # Main app reducer
│   └── store.js                    # Redux store configuration
├── App.css                         # Global app styling
├── App.js                          # Main app component
├── App.test.js                     # App component tests
├── index.css                       # Global CSS styles
├── index.js                        # React app entry point
├── reportWebVitals.js              # Performance monitoring
└── setupTests.js                   # Test configuration
```

---

## 🐳 Docker Setup

### Development with Docker

1. **Create Dockerfile**
    ```dockerfile
    # Use Node.js official image
    FROM node:18-alpine
    
    # Set working directory
    WORKDIR /app
    
    # Copy package files
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy source code
    COPY . .
    
    # Expose port
    EXPOSE 3000
    
    # Start the application
    CMD ["npm", "start"]
    ```

2. **Create docker-compose.yml**
    ```yaml
    version: '3.8'
    services:
      frontend:
        build: .
        ports:
          - "3000:3000"
        environment:
          - REACT_APP_API_URL=http://localhost:8000
          - REACT_APP_PUSHER_KEY=${PUSHER_KEY}
          - REACT_APP_PUSHER_CLUSTER=${PUSHER_CLUSTER}
        volumes:
          - .:/app
          - /app/node_modules
        depends_on:
          - backend
    
      backend:
        image: ayushtgt/backend:latest
        ports:
          - "8000:8000"
        environment:
          - NODE_ENV=development
        volumes:
          - backend_data:/app/data
    
    volumes:
      backend_data:
    ```

3. **Build and Run**
    ```sh
    # Build the image
    docker build -t ayushtgt/frontend .
    
    # Run with docker-compose
    docker-compose up -d
    
    # View logs
    docker-compose logs -f frontend
    
    # Stop services
    docker-compose down
    ```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Clone your fork**
    ```sh
    git clone https://github.com/your-username/user-task-management-frontend.git
    cd user-task-management-frontend
    ```

3. **Create a feature branch**
    ```sh
    git checkout -b feature/your-feature-name
    ```

4. **Make your changes**
5. **Test your changes**
    ```sh
    npm test
    npm run lint
    npm run format      # Auto-format code
    ```

6. **Commit your changes**
    ```sh
    git add .
    git commit -m "feat: add your feature description"
    ```

7. **Push to your fork**
    ```sh
    git push origin feature/your-feature-name
    ```

8. **Create a Pull Request**

### Development Setup
```sh
npm install            # Install dependencies
npm start              # Start development server
npm test               # Run tests in watch mode
npm run lint           # Check code quality
```

---

### Areas for Contribution

- 🐛 **Bug Fixes**: Check the [Issues](https://github.com/AyushTGT/user-task-management-frontend/issues) tab
- ✨ **New Features**: Propose new features via issues first
- 📚 **Documentation**: Improve README, add code comments
- 🧪 **Testing**: Add unit tests, integration tests
- 🎨 **UI/UX**: Enhance user interface and experience
- ⚡ **Performance**: Optimize loading times, reduce bundle size
- 🔧 **DevOps**: Improve build process, Docker setup

### Need Help?

- 📧 **Email**: Contact us at ayushtomar.iis@gmail.com

---

## 👨‍💻 Author

**AyushTGT**
- GitHub: [@AyushTGT](https://github.com/AyushTGT)
- Email: ayushtomar.iis@gmail.com
