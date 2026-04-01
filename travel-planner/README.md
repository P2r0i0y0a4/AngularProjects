# WanderPlan – Travel Itinerary Planner 🌍✈️

A full-featured Angular 21 travel planning application with a beautiful dark glassmorphism UI.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Angular CLI 21

### Installation

```bash
# Install Angular CLI globally
npm install -g @angular/cli@21

# Navigate to project folder
cd travel-itinerary-planner

# Install dependencies
npm install

# Start development server
npm start
```

Open `http://localhost:4200` in your browser.

---

## ✨ Angular 21 Features Used

| Feature | Usage |
|--------|-------|
| **Standalone Components** | Every component uses `standalone: true` - no NgModules |
| **Signals** | `signal()`, `computed()`, `effect()` for reactive state |
| **New Control Flow** | `@if`, `@for`, `@switch` instead of `*ngIf`, `*ngFor` |
| **Lazy Loading** | All pages loaded with `loadComponent()` |
| **View Transitions API** | `withViewTransitions()` for smooth page changes |
| **Functional Guards** | `CanActivateFn` for auth/guest guards |
| **`inject()` function** | DI without constructor injection |
| **Input Signals** | Signal-based component inputs |
| **provideAnimationsAsync** | Async animation loading |
| **Application Config** | `appConfig` with `bootstrapApplication()` |
| **Router with withViewTransitions** | Animated route changes |
| **Template Literals** | Modern template syntax throughout |

---

## 📱 Pages & Features

### 🔐 Authentication (Login & Sign Up)
- **Form Validation** with Angular Template-driven Forms
- Email, password, name validation
- Password strength indicator (4-level)
- Show/hide password toggle
- Demo account login
- Error messages with visual feedback
- Terms & conditions checkbox

### 🏠 Dashboard
- Personalized greeting
- Trip statistics (total trips, countries, upcoming, budget)
- Recent trips with status badges
- Quick action shortcuts
- Travel tips carousel
- Next trip countdown
- Explore destinations section

### 🗺️ Trip Planner
- Create trips with emoji cover, dates, budget, currency
- Day-by-day itinerary builder
- Activity types: transport, accommodation, food, attraction, leisure
- Add time, location, description, cost per activity
- Trip status: planning → upcoming → ongoing → completed

### 📅 Timeline View
- Visual vertical timeline
- Activities sorted by time
- Color-coded by activity type
- Activity summary stats

### 💰 Budget Breakdown
- Total vs. planned vs. actual spending
- Visual progress bars by category
- Donut chart (SVG-based) for distribution
- Add expenses with category, planned & actual amounts
- Over-budget alerts

### 🧳 Packing List
- Per-trip packing items
- Category filters: documents, clothing, toiletries, electronics, health
- Check/uncheck items
- Essential item flagging
- Progress tracker
- Quick-add templates: Beach, City, Adventure

### 🌤️ Weather
- Search any city
- Simulated weather data with condition icons
- 7-day forecast
- Travel suitability scores
- UV Index with advice
- Packing suggestions based on weather
- Quick-load popular cities

### ⚖️ Trip Compare
- Side-by-side comparison of any 2 trips
- Visual budget bars by category
- Trophy indicators for better metrics
- Rating comparison

### 🔭 Explore Destinations
- 9 curated world destinations
- Search by name/country
- Filter by continent and tags
- Destination detail modal
- Highlights, best time, avg cost

### 👤 Profile
- Edit name and bio
- Travel style preferences
- Achievement badges
- Travel statistics
- Recent trip list

---

## 🎨 Design System

- **Color Palette**: Deep navy (#0a0f1e) background with sky blue and emerald gradients
- **Typography**: Playfair Display (headings) + DM Sans (body)
- **Glassmorphism**: `backdrop-filter: blur()` cards with subtle borders
- **Animations**: Float, slide-up, fade-in, shimmer
- **Tailwind CSS**: Custom config with extended colors, shadows, animations

---

## 🏗️ Project Structure

```
src/
  app/
    pages/
      login/          # Login page with validation
      signup/         # Signup with password strength
      dashboard/      # Home overview
      trip-planner/   # Create & manage trips
      timeline/       # Day-by-day activity view
      budget/         # Budget tracking
      packing-list/   # Packing checklist
      weather/        # Weather forecasts
      trip-compare/   # Side-by-side comparison
      explore/        # Destination discovery
      profile/        # User account
    services/
      auth.service.ts # Auth with localStorage
      trip.service.ts # Trip CRUD with signals
    guards/
      auth.guard.ts   # Route protection
    app.routes.ts     # Lazy-loaded routes
    app.config.ts     # Application config
    app.component.ts  # Root with sidebar layout
  styles.css          # Global Tailwind + custom CSS
```

---

## 🔒 Auth Notes

Authentication uses localStorage for persistence (no backend required). For production, replace with a real API.

---

## 📦 Build for Production

```bash
ng build --configuration production
```

Output will be in `dist/travel-itinerary-planner/`.
