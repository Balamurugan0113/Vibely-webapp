# Implementation Plan: Music Streaming Web App

## 1. Project Setup & Architecture
- **Framework**: React (initialized via Vite for fast development).
- **Styling**: Vanilla CSS. We will implement a modern, dark-themed UI featuring a black and light blue color palette, glassmorphism hover effects, and a dynamic gradient carousel.
- **Backend/Database**: Supabase.
- **State Management**: React Context API for the global audio player state, current song, and song queue.
- **Routing**: React Router DOM for navigating between pages.

## 2. Supabase Database Schema
We will create a `songs` table in your Supabase project with the following structure.
```sql
CREATE TABLE songs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  cover_url TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
*(We will execute this SQL on Supabase SQL editor during the setup phase).*

## 3. UI/UX Design System
- **Colors**: Deep black background (`#0a0a0a`), dark grey glass panels (`rgba(255, 255, 255, 0.05)`), and neon light blue accents (`#00e5ff`) for active states, buttons, and progress bars.
- **Components**:
  - **Glassmorphism**: Backdrop blur filters (`backdrop-filter: blur(10px)`) with semi-transparent borders for cards and modals.
  - **Gradient Carousel**: A smooth, auto-sliding carousel on the landing page highlighting featured/new songs using a CSS-animated gradient background.

## 4. Features & Pages

### User Side
1. **Landing Page (Home)**:
   - Gradient carousel displaying featured songs.
   - Grid list of all songs fetched from Supabase.
2. **Search Page**:
   - A search bar that filters songs by title, artist, or album in real-time.
3. **Library & History**:
   - **Library**: A page to show saved/liked songs (state can be persisted in `localStorage` to keep it simple and beginner-friendly without complex auth).
   - **History**: Displays a list of recently listened songs, updated automatically when a song is played (also stored in `localStorage`).
4. **Profile Page**:
   - A simple placeholder profile page with user settings or stats (e.g., number of songs listened to).
5. **Global Audio Player**:
   - Fixed at the bottom of the screen.
   - Controls: Play/Pause, Next, Previous, Volume Slider, and Seek/Progress Bar.
   - Uses standard HTML5 `<audio>` element tied to React state.

### Admin Side (Hidden Route)
- **Admin Dashboard (`/admin`)**:
  - **Add Song Form**: Inputs for Title, Artist, Album, Cover Image URL, and Cloudinary Audio URL.
  - **Manage Songs**: A table/list of existing songs fetched from Supabase with "Edit" and "Delete" actions.
  - CRUD operations will communicate directly with Supabase via the Supabase JS client.

## 5. Development Phases
1. **Phase 1: Initialization**: Setup Vite + React, configure Supabase client, and create CSS variables for the theme.
2. **Phase 2: Database Setup**: Add some sample data to Supabase using the provided Cloudinary links.
3. **Phase 3: Core UI & Routing**: Build the layout (Sidebar, Main Content Area, Bottom Player) and setup React Router.
4. **Phase 4: Admin Side**: Build the Add/Edit/Delete song functionality so we can easily populate the database.
5. **Phase 5: User Pages**: Implement Home, Search, Library, History, and Profile pages.
6. **Phase 6: Audio Player**: Connect the UI to a global audio player state to play songs fetched from Supabase.
7. **Phase 7: Polish & Responsiveness**: Add glassmorphism hover effects, animations, and ensure the app works beautifully on mobile and desktop.

Please review this plan. If it looks good, I will proceed with Phase 1!
