# PawMind Mobile App - Comprehensive Exploration Report

## Project Overview
**Application**: PawMind - An AI Pet Companion App  
**Platform**: React Native (Expo)  
**Entry Point**: `/Users/chenzy/Desktop/minipros/harnessLearning/apps/mobile/index.ts`  
**Tech Stack**: Expo 54, React 19.1.0, React Native 0.81.5, TypeScript 5.9.2  
**Package Manager**: npm (private monorepo)

---

## 1. Entry Point & Initialization

### Main Entry File: `index.ts`
```typescript
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```
- Uses Expo's `registerRootComponent` to register the root App component
- Handles both Expo Go and native build environments
- Sets up AppRegistry with app name 'main'

### Root App Component: `App.tsx`
```typescript
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigation } from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <RootNavigation />
    </SafeAreaProvider>
  );
}
```

**Key Setup:**
- Wraps everything in `SafeAreaProvider` for notch/safe area handling
- Sets dark status bar style
- Initializes root navigation system

---

## 2. Navigation Architecture

### Root Navigation (`src/navigation/index.tsx`)
**Pattern**: Conditional stack based on authentication state

```
RootNavigation
├── Auth State Check (with loading spinner)
├── If Logged In → MainStack
└── If Not Logged In → AuthStack
```

**Authentication Flow:**
- Uses `useAuthStore` to manage auth state
- Calls `checkAuth()` on mount to restore session from secure storage
- Shows loading spinner while checking

### Authentication Stack (`auth-stack.tsx`)
- **Login Screen**: Email + Password login
- **Register Screen**: Email + Password + Nickname registration
- Uses `createNativeStackNavigator`
- Headers hidden for cleaner UX

### Main Stack (`main-stack.tsx`)
```
MainStack
├── MainTabs (default route)
│   ├── Home
│   ├── Chat (AI Companion)
│   ├── Health (Health Management)
│   ├── Growth (Growth Records)
│   └── Profile (User Profile)
└── AddPet (modal-style route)
```

### Main Tabs Navigation (`main-tabs.tsx`)
- **Bottom Tab Navigation** with 5 tabs
- Uses emoji icons with smooth animations
- Tab styling with active/inactive states
- Chinese labels for all tabs

**Tabs:**
1. **首页 (Home)** - 🏠 Main dashboard
2. **AI陪伴 (Chat)** - 💬 AI conversation
3. **健康 (Health)** - 📊 Health tracking
4. **成长册 (Growth)** - 📸 Photo/memory records
5. **我的 (Profile)** - 👤 User account & pets

---

## 3. Authentication System

### Auth Store (`src/stores/auth.store.ts`)
**State Management**: Zustand
```typescript
interface AuthState {
  isLoggedIn: boolean;
  userId: number | null;
  loading: boolean;
  error: string | null;
  login(email, password);
  register(email, password, nickname);
  logout();
  checkAuth();
}
```

### Auth Service (`src/services/auth.ts`)
**Key Features:**
- Platform-aware storage:
  - Web: `localStorage`
  - Native: `expo-secure-store` (secure)
- JWT-based authentication (accessToken + refreshToken)
- Stores tokens after login/register
- Clears tokens on logout

**API Endpoints:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- Token-based authorization header: `Authorization: Bearer {accessToken}`

---

## 4. Core Data Models & Services

### Pet Management (`src/services/pet.ts`)
```typescript
interface PetInfo {
  id: number;
  name: string;
  species: string; // 'cat' | 'dog' | 'other'
  breed: string;
  birthday: string;
  gender: string;
  weight: number;
  avatar: string | null;
  personalityTags: string[];
  status: string;
  createdAt: string;
}
```

**API Endpoints:**
- `GET /pets` - Fetch all pets
- `GET /pets/{id}` - Fetch single pet
- `POST /pets` - Create new pet
- `PUT /pets/{id}` - Update pet
- `DELETE /pets/{id}` - Archive pet

### Health Tracking (`src/services/health.ts`)
```typescript
interface HealthLogInfo {
  id: number;
  petId: number;
  date: string;
  weight: number | null;
  appetiteLevel: 'low' | 'normal' | 'high' | null;
  activityLevel: 'low' | 'normal' | 'high' | null;
  waterIntake: number | null;
  symptoms: string | null;
  notes: string | null;
  isAlert: boolean;
  alertType: string | null;
  severity: 'observe' | 'caution' | 'urgent' | null;
  createdAt: string;
}
```

**API Endpoints:**
- `POST /pets/{petId}/health-logs` - Create health log
- `GET /pets/{petId}/health-logs` - Get all logs
- `GET /pets/{petId}/health-logs/trends?days=7` - Get 7-day trends
- `GET /pets/{petId}/health-logs/alerts` - Get active alerts
- `PUT /health-logs/{logId}/resolve` - Resolve alert

### Chat/Conversation (`src/services/chat.ts`)
```typescript
interface MessageInfo {
  id: number;
  role: 'user' | 'ai';
  content: string;
  emotionTag: string | null;
  createdAt: string;
}

interface ConversationInfo {
  id: number;
  petId: number;
  createdAt: string;
}
```

**API Endpoints:**
- `POST /pets/{petId}/conversations` - Create conversation
- `GET /pets/{petId}/conversations` - Get conversations
- `POST /conversations/{conversationId}/messages` - Send message
- `GET /conversations/{conversationId}/messages` - Get messages

### Growth Records (`src/services/growth.ts`)
```typescript
interface GrowthRecordInfo {
  id: number;
  petId: number;
  contentType: string; // 'text' | 'photo' | etc.
  mediaUrl: string | null;
  description: string | null;
  tags: string[];
  createdAt: string;
}
```

**API Endpoints:**
- `GET /pets/{petId}/growth-records` - Get all records
- `POST /pets/{petId}/growth-records` - Create record
- `DELETE /growth-records/{id}` - Delete record

### Pet Store (`src/stores/pet.store.ts`)
**State Management**: Zustand
```typescript
interface PetState {
  pets: PetInfo[];
  currentPet: PetInfo | null;
  loading: boolean;
  fetchPets(): Promise<void>;
  selectPet(pet: PetInfo): void;
  addPet(data: CreatePetData): Promise<void>;
}
```

---

## 5. Screen Architecture

### Home Screen (`src/screens/home/home-screen.tsx`)
**Purpose**: Dashboard & quick access

**Key Features:**
- Welcome message with pet name
- Status Card with emotion indicator
- Quick action buttons (Chat, Health, Growth)
- Tips section with caring tips
- Daily challenges
- Smooth entrance animations with Animated API
- Pet switcher dropdown
- Empty state when no pets

**Animations:**
- Fade-in entrance animation
- Scale spring animation
- Breathing/pulse animation on elements

### Authentication Screens

#### Login Screen (`src/screens/auth/login-screen.tsx`)
- Email and password inputs
- Form validation
- Error message display
- Loading state
- Link to register
- Animations on entrance

#### Register Screen (`src/screens/auth/register-screen.tsx`)
- Nickname, email, password fields
- Password validation (min 6 chars)
- Error handling
- Link back to login
- Smooth animations

### Add Pet Screen (`src/screens/profile/add-pet-screen.tsx`)
**Pattern**: Multi-step form wizard

**Steps:**
1. **Step 1**: Pet name + Species selection (cat/dog/other)
2. **Step 2**: Breed + Birthday + Gender selection
3. **Step 3**: Weight input + Submit

**Features:**
- Step progress indicator with visual feedback
- Chip-based selections (emoji icons)
- Smooth transitions between steps
- Validation before proceeding
- Success alert with navigation back

### Profile Screen (`src/screens/profile/profile-screen.tsx`)
**Features:**
- Pet list/collection view
- Current pet highlight
- Add new pet button
- Logout button
- Pet info display (name, breed, weight)
- Empty state with CTA

### Chat Screen (`src/screens/chat/chat-screen.tsx`)
**Features:**
- Message list with FlatList (auto-scroll)
- User message bubbles (right-aligned, primary color)
- AI message bubbles (left-aligned, surface color)
- Emotion tags on AI messages
- Quick topic suggestions
- Text input with send button
- Empty state with suggested topics
- Disabled send button when input empty
- Error handling with fallback message

**Quick Topics:**
- 今天乖不乖 (Were you good today?)
- 想我吗 (Do you miss me?)
- 有没有捣乱 (Did you cause trouble?)
- 今天吃什么了 (What did you eat today?)

### Health Screen (`src/screens/health/health-screen.tsx`)
**Features:**
- Active alerts display with severity colors
- Health log form with inputs:
  - Weight (kg)
  - Appetite level (low/normal/high)
  - Activity level (low/normal/high)
- 7-day trend history display
- Alert severity colors and labels:
  - 观察 (Observe) - Blue
  - 注意 (Caution) - Yellow
  - 立即就医 (Urgent) - Red
- Empty state when no data

### Growth Screen (`src/screens/growth/growth-screen.tsx`)
**Features:**
- Timeline view of growth records
- Add record button
- Modal for creating new record
- Text input for descriptions
- Character count (max 500)
- Tag display support
- Date formatting (Month/Day)
- Empty state with CTA
- Delete support (API ready)

---

## 6. Design System

### Color Palette (`src/constants/theme.ts`)
**Primary Colors:**
- Primary: `#FF6B6B` (Red/Pink)
- Secondary: `#4ECDC4` (Teal)
- Accent1: `#FFD166` (Yellow)
- Accent2: `#06D6A0` (Green)
- Accent3: `#118AB2` (Blue)

**Status Colors:**
- Success: `#06D6A0`
- Warning: `#FFD166`
- Error: `#EF476F`
- Info: `#118AB2`

**Alert Colors:**
- Observe: `#118AB2` (Blue)
- Caution: `#FFD166` (Yellow)
- Urgent: `#EF476F` (Red)

### Typography
- **Tiny**: 10px, light gray
- **Small**: 12px, light gray
- **Regular**: 14px, text color
- **Medium**: 16px, text color, 500 weight
- **Large**: 18px, text color, 600 weight
- **Title**: 22px, text color, 700 weight
- **Heading**: 28px, text color, 800 weight

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px
- xxxl: 64px

### Border Radius
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- xxl: 32px
- round: 9999px (fully rounded)

### Shadows
- **sm**: Subtle (2px offset, 0.1 opacity, 4px blur)
- **md**: Medium (4px offset, 0.15 opacity, 8px blur)
- **lg**: Large (8px offset, 0.2 opacity, 16px blur)

### Component: StatusCard (`src/components/ui/status-card.tsx`)
**Purpose**: Pet status display widget

**Features:**
- Emotion indicators (happy, calm, anxious, excited, sleepy, playful)
- Status stats (diet, activity, sleep, mood)
- Animated entrance and pulse effects
- Responsive layout with icon containers
- Badge system for emotions

---

## 7. API Integration

### API Client (`src/services/api.ts`)
**Base URL Configuration:**
```typescript
Development: 'http://192.168.3.145:3000/api'
Production: 'https://api.pawmind.app/api'
```

**Features:**
- Automatic token injection from secure storage
- JSON request/response handling
- Error handling with message extraction
- Platform-aware storage (web vs native)
- Support for: GET, POST, PUT, DELETE

**Error Handling:**
- Catches HTTP errors and extracts error message
- Fallback: `请求失败: {status}` (Request failed: {status})

---

## 8. Dependencies

### Core Framework
- `expo` ~54.0.33
- `react` 19.1.0
- `react-native` 0.81.5
- `@expo/metro-runtime` ^55.0.9

### Navigation
- `@react-navigation/native` ^7.2.2
- `@react-navigation/native-stack` ^7.14.10
- `@react-navigation/bottom-tabs` ^7.15.9
- `react-native-screens` ~4.16.0
- `react-native-safe-area-context` ~5.6.0

### State Management
- `zustand` ^5.0.12

### Storage & Security
- `@react-native-async-storage/async-storage` 2.2.0
- `expo-secure-store` ~15.0.8

### Utilities
- `expo-image-picker` ~17.0.10
- `expo-status-bar` ~3.0.9
- `react-native-web` ^0.21.0
- `react-dom` 19.1.0

### Dev Dependencies
- `typescript` ~5.9.2
- `@types/react` ~19.1.0

---

## 9. Configuration Files

### `package.json`
- **main entry**: index.ts
- **scripts**:
  - `npm start` → expo start
  - `npm run android` → expo start --android
  - `npm run ios` → expo start --ios
  - `npm run web` → expo start --web

### `app.json` (Expo Config)
```json
{
  "expo": {
    "name": "mobile",
    "slug": "mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "newArchEnabled": true,
    "package": "com.pawmind.mobile",
    "plugins": ["expo-secure-store"]
  }
}
```

**Key Settings:**
- Portrait orientation only
- New Architecture enabled
- Custom package: com.pawmind.mobile
- Arbitrary loads allowed (for dev API)
- Cleartext traffic enabled (for dev)
- Predictive back gesture disabled

### `tsconfig.json`
- Extends Expo's tsconfig.base
- Strict mode enabled
- Extends "expo/tsconfig.base"

---

## 10. Project Structure

```
apps/mobile/
├── index.ts                 # Entry point
├── App.tsx                  # Root component
├── app.json                 # Expo config
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── assets/                  # Images & icons
├── .expo/                   # Expo metadata (not committed)
└── src/
    ├── navigation/          # Navigation stacks
    │   ├── index.tsx        # Root navigation
    │   ├── auth-stack.tsx   # Auth flow
    │   ├── main-stack.tsx   # Main app flow
    │   └── main-tabs.tsx    # Bottom tabs
    ├── screens/             # Screen components
    │   ├── auth/            # Login/Register
    │   ├── home/            # Home/Dashboard
    │   ├── chat/            # Chat screen
    │   ├── health/          # Health tracking
    │   ├── growth/          # Growth records
    │   └── profile/         # Profile & pet list
    ├── stores/              # Zustand stores
    │   ├── auth.store.ts    # Auth state
    │   └── pet.store.ts     # Pet state
    ├── services/            # API services
    │   ├── api.ts           # HTTP client
    │   ├── auth.ts          # Auth endpoints
    │   ├── pet.ts           # Pet endpoints
    │   ├── health.ts        # Health endpoints
    │   ├── chat.ts          # Chat endpoints
    │   └── growth.ts        # Growth endpoints
    ├── components/          # Reusable components
    │   └── ui/
    │       └── status-card.tsx
    └── constants/           # Constants
        ├── theme.ts         # Design tokens
        └── api.ts           # API config
```

---

## 11. Error Handling & Status

### No Active Errors Detected
✅ No error logs found in the codebase
✅ Error handling is implemented in key flows:
- Network requests: Try/catch blocks
- User input: Validation before API calls
- State management: Error state in Zustand stores
- UI: Alert dialogs for user feedback

### Error UI Patterns
- Alert dialogs for failures
- Error message display in forms
- Disabled states on buttons during loading
- Loading spinners during auth check

---

## 12. State Management Flow

```
RootNavigation
    ↓
useAuthStore (checkAuth)
    ↓
Loads token from secure storage
    ↓
If token exists → MainStack
Else → AuthStack
    ↓
MainStack
    ↓
usePetStore (fetchPets on mount)
    ↓
Loads pet list from API
    ↓
Sets currentPet (first pet or null)
    ↓
All screens access via hooks
```

---

## 13. Recent Activity Notes

**Last Modified Files (from timestamps):**
- Apr 13 22:31 - app.json
- Apr 13 09:13 - api.ts, auth.ts
- Apr 13 00:05 - Multiple files (App.tsx, auth.store.ts, screens, services)
- Apr 12 10:44 - .expo/ metadata
- Apr 12 08:19 - .expo/ devices.json
- Apr 12 03:38 - Screens (home, screens), stores, services

**Likely Development Status**: Active - recent modifications across multiple systems

---

## 14. Key Technical Characteristics

### Strengths
1. ✅ Clean architecture with clear separation of concerns
2. ✅ Type-safe TypeScript throughout
3. ✅ Secure token storage with platform-aware implementation
4. ✅ Comprehensive state management with Zustand
5. ✅ Smooth animations using React Native Animated API
6. ✅ Responsive UI with flexbox layouts
7. ✅ Consistent design system with theme constants
8. ✅ Multi-screen navigation with bottom tabs
9. ✅ Proper error handling and loading states
10. ✅ Chinese localization throughout

### Areas for Enhancement
1. 🔄 Could add error boundary components
2. 🔄 Could implement retry logic for network failures
3. 🔄 Could add analytics/crash reporting
4. 🔄 Could implement offline support with AsyncStorage
5. 🔄 Could add image optimization for growth records

---

## 15. Development Recommendations

### To Run the App
```bash
cd apps/mobile
npm install
npm start              # Expo CLI menu
# Then choose: android, ios, or web
```

### To Test
- Use Expo Go app on real devices
- Use Android emulator or iOS simulator
- Use web version for quick iteration

### To Debug
- React Native Debugger
- Expo CLI console output
- Check `/Users/chenzy/Desktop/minipros/harnessLearning/apps/mobile/.expo/` for device info

### Key API Endpoints to Test
- `POST /auth/register`
- `POST /auth/login`
- `GET /pets`
- `POST /pets`
- `POST /pets/{petId}/health-logs`
- `POST /conversations`
- `POST /conversations/{convId}/messages`

