# React Router Setup for Rose Academy

This document describes the React Router implementation for the Rose Academy frontend application.

## Overview

The application uses React Router v7 for client-side routing with the following features:
- Protected routes for authenticated users
- Admin-only routes with role-based access control
- Lazy loading for better performance
- Breadcrumb navigation
- Custom navigation hooks

## File Structure

```
src/
├── App.jsx                    # Main app component with router setup
├── routes/
│   └── index.jsx             # Route configurations
├── components/common/
│   ├── PrivateRoute.jsx      # Route protection for authenticated users
│   ├── AdminRoute.jsx        # Route protection for admin users
│   ├── SuspenseWrapper.jsx   # Lazy loading wrapper
│   ├── Breadcrumb.jsx        # Navigation breadcrumbs
│   └── Loader.jsx            # Loading spinner
├── hooks/
│   ├── useAuth.js            # Authentication hook
│   ├── useNavigation.js      # Navigation utilities
│   └── useForm.js            # Form handling hook
└── utils/
    └── routeGuards.js        # Route protection utilities
```

## Route Structure

### Public Routes
- `/` - Home page
- `/courses` - Course listing
- `/courses/:id` - Course details
- `/auth/*` - Authentication pages (login, register, etc.)

### Protected Routes (Require Authentication)
- `/lessons/:id` - Lesson player
- `/profile` - User profile
- `/dashboard` - User dashboard
- `/subscriptions` - User subscriptions
- `/settings` - User settings

### Admin Routes (Require Admin Role)
- `/admin` - Admin dashboard
- `/admin/dashboard` - Admin dashboard
- `/admin/courses` - Course management
- `/admin/lessons` - Lesson management
- `/admin/users` - User management
- `/admin/subscriptions` - Subscription management

## Components

### PrivateRoute
Protects routes that require authentication. Redirects to login if user is not authenticated.

```jsx
<Route element={<PrivateRoute />}>
  <Route path="/profile" element={<ProfilePage />} />
</Route>
```

### AdminRoute
Protects routes that require admin privileges. Redirects to home if user is not admin.

```jsx
<Route element={<AdminRoute />}>
  <Route path="/admin/*" element={<AdminPage />} />
</Route>
```

### SuspenseWrapper
Wraps routes with Suspense for lazy loading with loading fallback.

```jsx
<SuspenseWrapper>
  <Routes>
    {/* Your routes */}
  </Routes>
</SuspenseWrapper>
```

## Hooks

### useNavigation
Provides navigation utilities throughout the app.

```jsx
const { goToHome, goToCourses, goToProfile, isCurrentPath } = useNavigation();
```

### useRouteGuard
Provides route protection utilities.

```jsx
const { requireAuth, requireAdmin, isAuthenticated } = useRouteGuard();
```

## Usage Examples

### Basic Navigation
```jsx
import { useNavigation } from '../hooks/useNavigation';

const MyComponent = () => {
  const { goToHome, goToCourses } = useNavigation();
  
  return (
    <button onClick={goToHome}>Go Home</button>
  );
};
```

### Route Protection
```jsx
import { useRouteGuard } from '../utils/routeGuards';

const MyComponent = () => {
  const { requireAuth } = useRouteGuard();
  
  const handleProtectedAction = () => {
    requireAuth(() => {
      // This will only run if user is authenticated
      console.log('User is authenticated');
    });
  };
};
```

### Breadcrumb Navigation
```jsx
import Breadcrumb from '../components/common/Breadcrumb';

const MyPage = () => {
  return (
    <div>
      <Breadcrumb />
      {/* Page content */}
    </div>
  );
};
```

## Route Configuration

Routes are defined in `src/routes/index.jsx` with lazy loading for better performance:

```jsx
const HomePage = lazy(() => import('../pages/HomePage'));

export const publicRoutes = [
  {
    path: '/',
    element: HomePage,
    title: 'Home'
  }
];
```

## Authentication Integration

The routing system integrates with the authentication context:

- `AuthProvider` wraps the entire app
- `useAuth` hook provides user state
- Route protection based on user authentication and role
- Automatic redirects for unauthorized access

## Performance Features

- **Lazy Loading**: Components are loaded only when needed
- **Suspense**: Loading states while components are being loaded
- **Code Splitting**: Automatic code splitting by route
- **Caching**: React Router handles component caching

## Best Practices

1. Always use the `useNavigation` hook for programmatic navigation
2. Use `useRouteGuard` for route protection in components
3. Wrap protected routes with appropriate route components
4. Use breadcrumbs for better user navigation
5. Implement proper loading states for lazy-loaded components 