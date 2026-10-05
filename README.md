# NutriTrack AI 🇮🇳
> **Understand your food. Track your nutrition. Build better habits.**

A production-grade, full-stack nutrition and meal tracking platform engineered specifically for everyday Indian diets, college students, young professionals, and fitness enthusiasts.

---

## 🌟 Key Highlights & Engineering Features

- **Authentic Indian Food Intelligence:** Built-in catalog of 120+ authentic Indian preparations (Idli, Dosa, Poha, Upma, Dal Tadka, Paneer Bhurji, Hyderabadi Biryani, Sambar, Rasam, Chapatis, Masala Chai, etc.) with real portion presets (katoris, bowls, pieces, plates) and macronutrient values, integrated with USDA FoodData Central.
- **Real-Time Live Dashboard:** Powered by **Socket.IO**. When a meal is added, updated, or deleted on any device, the entire dashboard—including daily calories, remaining energy, protein/carb/fat progress dials, recent timeline meals, and analytics charts—updates instantaneously without a page refresh.
- **Gemini-Powered AI Nutrition Insights:** Uses **Google Gemini 3.8 Flash** via `@google/genai` to analyze the user's actual food history, identify macronutrient deficits (e.g. typical Indian protein shortages), evaluate carbohydrate density, and provide actionable Indian food suggestions (paneer, soya chunks, sprouts, boiled eggs, curd).
- **Personalized Metabolic Profiling:** Calculates Base Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using the clinical **Mifflin-St Jeor formula** based on age, gender, height, weight, activity level, and weight goal (maintain, lose, gain).
- **Interactive Visual Analytics:** 6 dynamic data visualizations built with **Recharts**, including 7-day calorie trends vs target, daily protein curves, macronutrient percentage splits, meal window distributions (Breakfast, Lunch, Snack, Dinner), and most frequently logged staples.
- **Calendar-Based Food History:** Full historical playback of any selected date, with real-time editing, deletion, and retroactive meal logging.
- **Habit & Streak Engine:** Automated streak tracking algorithm calculating consecutive days logged.
- **Production Security:** Real JWT authentication, salted bcrypt password hashing, input validation, and protected routes.

---

## 🏗️ Architecture & Real-Time Data Flow

```text
User Action (e.g. Logs "Hyderabadi Chicken Biryani — 650 kcal")
   │
   ▼
React Frontend (Axios with Bearer JWT)
   │
   ▼
REST API (Express router + Auth Middleware)
   │
   ▼
Express Controller (Input Validation & Macro Calculations)
   │
   ▼
MongoDB / Mongoose Persistence Layer (.data/db.json fallback)
   │
   ▼
Socket.IO Event Emission (room `user_${userId}`)
   │  ├── 'foodAdded'
   │  └── 'nutritionUpdated'
   ▼
Connected React Clients (SocketContext / NutritionContext)
   │
   ▼
Dashboard, Timeline & Charts Update Immediately (0 Refresh)
```

---

## 💻 Tech Stack

### Frontend
- **React 19** (Functional components, Custom Hooks, Context API)
- **Vite 8**
- **Tailwind CSS 4** (Modern clean health-tech SaaS aesthetic)
- **React Router 7**
- **Recharts** (Interactive Area, Bar, and Pie Charts)
- **Socket.IO Client** (Real-time live synchronization)
- **Axios** (JWT interceptors)
- **Lucide React** (Modern minimal icons)

### Backend
- **Node.js** & **Express.js** (Modular RESTful API)
- **Socket.IO** (Bi-directional real-time event broadcasting)
- **MongoDB** & **Mongoose** (Document schemas with indexing)
- **JSONWebToken (JWT)** & **bcryptjs** (Stateless authentication & password hashing)
- **Google GenAI SDK (`@google/genai`)** (Gemini 3.8 Flash server-side integration)
- **USDA FoodData Central API** (External nutritional reference)

---

## 📂 Project Structure

```text
├── server/
│   ├── config/
│   │   └── db.ts                # Database persistence & Mongoose configuration
│   ├── models/
│   │   ├── User.ts              # Mongoose User document schema
│   │   └── FoodEntry.ts         # Mongoose FoodEntry document schema
│   ├── controllers/
│   │   ├── authController.ts    # Register, Login, 1-Click Demo Login
│   │   ├── userController.ts    # User profile & target overrides
│   │   ├── foodController.ts    # Food CRUD & catalog search
│   │   ├── analyticsController.ts # 7-Day & daily analytical computations
│   │   └── aiController.ts      # Gemini AI insights orchestrator
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── foodRoutes.ts
│   │   ├── analyticsRoutes.ts
│   │   └── aiRoutes.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts    # JWT token verification
│   │   └── errorHandler.ts      # Centralized error handler
│   ├── services/
│   │   ├── foodApiService.ts    # 120+ Indian items & USDA lookup
│   │   ├── geminiService.ts     # Gemini 3.8 Flash clinical dietary analysis
│   │   ├── streakService.ts     # Consecutive logging streak engine
│   │   └── seedData.ts          # Realistic 7-day demo meals for Ravi
│   ├── utils/
│   │   └── nutritionCalculator.ts # Mifflin-St Jeor BMR/TDEE & daily aggregation
│   └── socket/
│       └── socketHandler.ts     # Socket.IO room management & dispatch
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Brand header, streak counter, quick actions
│   │   ├── Sidebar.tsx          # Desktop navigation
│   │   ├── MobileNav.tsx        # Mobile bottom navigation bar
│   │   ├── MacroProgressCard.tsx# Circular calorie dial & macro progress bars
│   │   ├── MealTimelineCard.tsx # Breakfast, Lunch, Snack, Dinner timeline
│   │   ├── AddMealModal.tsx     # Serving size & food logger modal
│   │   ├── QuickAddModal.tsx    # Fast manual calorie/macro entry
│   │   ├── AiInsightsCard.tsx   # Gemini AI nutrition recommendations
│   │   └── SmartEmptyState.tsx  # "Your plate is waiting" empty state
│   ├── context/
│   │   ├── AuthContext.tsx      # User authentication & profile state
│   │   ├── SocketContext.tsx    # Socket.IO client connection
│   │   └── NutritionContext.tsx # Real-time food logs & active day data
│   ├── pages/
│   │   ├── LandingPage.tsx      # Hero, features, live preview, 1-click demo
│   │   ├── LoginPage.tsx        # Sign-in form
│   │   ├── RegisterPage.tsx     # Onboarding with physical metrics & goals
│   │   ├── DashboardPage.tsx    # Main nutrition command center
│   │   ├── FoodTrackerPage.tsx  # Date-switchable daily meal tracker
│   │   ├── FoodSearchPage.tsx   # Catalog browser (Indian vs Global)
│   │   ├── AnalyticsPage.tsx    # 6 Recharts analytics visualizations
│   │   ├── FoodHistoryPage.tsx  # Calendar-based retrospective logs
│   │   ├── ProfilePage.tsx      # BMI calculator & target updates
│   │   └── SettingsPage.tsx     # Custom macro target overrides
│   ├── services/
│   │   └── api.ts               # Axios instance with interceptors
│   ├── App.tsx                  # Router & layout tree
│   └── main.tsx
├── server.ts                    # Full-stack server entry (Express + Socket.IO + Vite)
├── .env.example                 # Environment configuration template
└── package.json
```

---

## 🗄️ Database Schemas

### User
```typescript
{
  name: String,
  email: { type: String, unique: true, index: true },
  password: String (bcrypt hash),
  age: Number,
  gender: 'male' | 'female' | 'other',
  height: Number (cm),
  weight: Number (kg),
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
  goal: 'maintain' | 'gain' | 'lose',
  calorieGoal: Number,
  proteinGoal: Number,
  carbGoal: Number,
  fatGoal: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### FoodEntry
```typescript
{
  userId: { type: String, index: true },
  foodName: String,
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner',
  servingSize: String,
  servingMultiplier: Number,
  calories: Number,
  protein: Number,
  carbohydrates: Number,
  fats: Number,
  fiber: Number,
  date: { type: String, index: true }, // 'YYYY-MM-DD'
  notes: String,
  source: 'indian_db' | 'usda' | 'quick_add' | 'custom',
  category: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user with physical metrics | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `POST` | `/api/auth/demo-login` | 1-Click demo login as "Ravi" | No |
| `GET` | `/api/users/profile` | Retrieve user profile & active streak | Yes |
| `PUT` | `/api/users/profile` | Update profile info & auto-recalculate goals | Yes |
| `PUT` | `/api/users/goals` | Manually override caloric & macro targets | Yes |
| `GET` | `/api/foods` | Fetch food entries (filter by date, mealType, search) | Yes |
| `POST` | `/api/foods` | Log meal from catalog; triggers Socket.IO event | Yes |
| `POST` | `/api/foods/quick-add` | Quick manual entry of calories & macros | Yes |
| `GET` | `/api/foods/:id` | Get single food entry | Yes |
| `PUT` | `/api/foods/:id` | Edit logged food; triggers Socket.IO update | Yes |
| `DELETE` | `/api/foods/:id` | Delete logged food; triggers Socket.IO event | Yes |
| `GET` | `/api/foods/search` | Search Indian catalog & USDA database | Yes |
| `GET` | `/api/analytics/daily` | Get daily summary & percentage vs goals | Yes |
| `GET` | `/api/analytics/weekly` | Get 7-day trends, averages, macro breakdown | Yes |
| `GET` | `/api/insights` | Run Gemini AI nutrition evaluation | Yes |

---

## ⚡ Real-Time Socket.IO Events

- **Client Joins:** `join_user_room(userId)`
- **`foodAdded`:** Broadcast when a new food or quick add entry is created.
- **`foodUpdated`:** Broadcast when an existing food entry is edited.
- **`foodDeleted`:** Broadcast when an entry is removed.
- **`nutritionUpdated`:** Delivers recalculated day totals to all connected tabs.
- **`goalUpdated`:** Emitted when user adjusts their target calories or macros.

---

## 🤖 Gemini AI Integration

NutriTrack AI integrates **Gemini 3.8 Flash** server-side (`server/services/geminiService.ts`). The model is provided with:
1. The user's goal (e.g. maintain weight, gain weight, lose weight) and daily calorie/macro targets.
2. The user's actual food entries for the day (e.g. "Idli with Sambar, Rice + Dal + Chicken Curry").
3. Current gap percentages (e.g. -28% protein gap).

Gemini outputs structured clinical feedback identifying dietary strengths, deficits, and Indian food alternatives (paneer bhurji, moong sprouts, eggs, soya, curd), accompanied by a clinical medical disclaimer.

---

## 🚀 Setup & Local Execution

### 1. Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure you have:
```env
GEMINI_API_KEY="your-gemini-api-key"
JWT_SECRET="your-jwt-secret"
PORT=3000
MONGODB_URI="mongodb+srv://..." # Optional: defaults to built-in document store if not specified
USDA_API_KEY="DEMO_KEY"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 🌐 Production Deployment

- **Frontend Deployment (Vercel):** Build via `npm run build`, output directory `dist`.
- **Backend Deployment (Render / Railway):** Set start command to `tsx server.ts` or compile via `tsc` and run `node dist/server.js`.
- **Database (MongoDB Atlas):** Create a free MongoDB Atlas cluster and set `MONGODB_URI` in your production environment variables.

---

## 📄 License
Apache-2.0. Built for real health and dietary empowerment.
