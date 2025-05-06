# Weather Dashboard Frontend

A modern Vue.js application for checking weather conditions and forecasts.

## Features

- **Current Weather Display**: View real-time weather conditions for any location
- **Weather Forecasts**: 5-day weather forecasts with hourly data
- **Geolocation Support**: Get weather for your current location
- **Location Saving**: Save your favorite locations for quick access
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Works great on mobile, tablet, and desktop

## Tech Stack

- **Vue.js 3**: Frontend framework with Composition API
- **TypeScript**: Type-safe JavaScript
- **Vuex**: State management
- **Vue Router**: Client-side routing
- **SCSS**: Styling with variables and nesting
- **Axios**: HTTP client for API requests
- **Font Awesome**: Icon library

## Prerequisites

- Node.js 14.x or higher
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/weather-dashboard.git
cd weather-dashboard
```

2. Install the dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following content:

```
VUE_APP_API_URL=http://localhost:3000
VUE_APP_TITLE="Weather Dashboard"
```

## Development

Start the development server:

```bash
npm run serve
# or
yarn serve
```

The application will be available at http://localhost:8080.

## Building for Production

Build the application for production:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.
## Project Structure

```
public/              # Static assets
src/
  ├── api/           # API clients and services
  ├── assets/        # Assets like images, fonts, etc.
  ├── components/    # Reusable Vue components
  ├── router/        # Vue Router configuration
  ├── services/      # Business logic services
  ├── store/         # Vuex store modules
  ├── types/         # TypeScript type definitions
  ├── views/         # Page components
  ├── App.vue        # Root component
  └── main.ts        # Application entry point
```

## Key Components

- **App.vue**: Root component that handles routing and global styles
- **HomeView.vue**: Main view for displaying weather information
- **LoginView.vue**: User authentication screen
- **SearchBar.vue**: Search for locations and toggle theme
- **WeatherDetails.vue**: Display current weather conditions
- **HourlyForecast.vue**: Shows hourly weather predictions
- **DailyForecast.vue**: Shows 5-day forecast

## State Management

The application uses Vuex for state management with three main modules:

1. **auth**: Handles user authentication
2. **weather**: Manages weather data and location saving
3. **theme**: Controls the application theme

## API Integration

The frontend communicates with the backend API to:

- Authenticate users
- Fetch weather data
- Save and manage locations
