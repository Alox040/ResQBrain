# DoctorGo Documentation

## 01 - Introduction

DoctorGo is a comprehensive mobile healthcare application built with React Native and Expo. It provides a platform for users to book medical appointments, consult with healthcare professionals, access marketplace features, and manage their healthcare needs.

## 02 - Installation Guide

### Prerequisites

- Node.js (LTS version)
- NPM / Bun
- Expo CLI
- Xcode (iOS Simulator or physical device)
- Android Studio and SDK (Android Emulator or physical device)

### Setup Steps

1. Download the source code
2. Install dependencies:

   ```bash
   npm install

   # bun install
   ```

3. Prebuild the project:

   ```bash
   npm run prebuild

   # bun run prebuild
   ```

4. Run on iOS or Android:

   ```bash
   npm run ios

   # bun run ios
   ```

   ```bash
   npm run android

   # bun run android
   ```

### Linting and Formatting

1. Run linter

   ```bash
   npm run lint

   # bun run lint
   ```

2. Run formatter

   ```bash
   npm run prettier

   # bun run prettier
   ```

## 03 - Dependencies

Key dependencies used in the project:

- **Expo SDK**: 53.0.9
- **Expo Router**: 5.0.7
- **React Native**: 0.79.2
- **UI Components**:
  - Nativewind
  - Tabler Icons React Native
  - React Native Calendar Picker
  - React Native Modal
  - React Native Element Dropdown
  - React Native Bouncy Checkbox
  - React Native Reanimated
  - Pinar Carousel
- **Form Handling**: @hookform/resolvers
- **Validation**: Zod
- **Storage**: @react-native-async-storage/async-storage
- **Localization**: expo-localization, i18n-js

## 04 - Screens

- Onboarding
- Language Selection
- Authentication
  - Login
  - Sign Up
  - Forgot Password
  - User Details
- Dashboard
- Discover
- Activity
- Settings
  - Profile
  - Address
  - Contact
  - Dependants
  - Emergency
  - Health Records
  - Security
- Appointment Booking
  - Search
  - Appointment
- Marketplace
  - Search
  - Overview
  - Product Details
  - Cart
- Membership
  - Details
  - Overview
- Wallet
  - Payment Methods
- More Screens
  - FAQ
  - Help
  - Terms & Conditions

### Authentication Flow

- Login Options (/auth/login-options)
- Login (/auth/login)
- Sign Up Options (/auth/sign-up-options)
- Sign Up (/auth/sign-up)
- Forgot Password (/auth/forgot-password)

### Main App Flow

- Home Dashboard
- Appointment Booking
- Marketplace
- User Profile
- Wallet
- Membership

## 05 - Folder Structure

```
/app                    # App routes and screens
  /(protected)          # Protected routes
  /auth                 # Authentication screens
/assets
  /fonts               # Custom fonts
  /images              # Image assets
/components            # Reusable UI components
/data                  # Static data and constants
/i18n                  # Internationalization setup
/locales               # Translation files
/store                 # State management
/types                 # TypeScript type definitions
/utils                 # Utility functions
```

## 06 - Font Configuration

The project uses the Rubik font family. Font files are located in `/assets/fonts/` and include:

- Rubik-Light.ttf
- Rubik-Regular.ttf
- Rubik-Medium.ttf
- Rubik-SemiBold.ttf
- Rubik-Bold.ttf
- Rubik-ExtraBold.ttf

Fonts are loaded using expo-font in the app initialization. You may get more fonts from Google Fonts or other sources.

## 07 - Image Assets

Image assets are organized in the `/assets/images/` directory:

- App icons and splash screens
- Doctor profile images
- Category and feature icons
- Carousel and highlight images
- Empty state and illustration images

## 08 - Production Checklist

- [ ] Update app version in app.json and package.json
- [ ] Verify all environment variables
- [ ] Test all main user flows
- [ ] Check performance on both iOS and Android
- [ ] Verify localization for all supported languages
- [ ] Test offline functionality
- [ ] Review app permissions
- [ ] Update app store screenshots and metadata
- [ ] Perform security audit
- [ ] Test deep linking
- [ ] Verify analytics implementation
- [ ] Check crash reporting setup
- [ ] Review accessibility features

## 09 - Credits

### Image Assets Attribution

- Avatar - https://uifaces.co
- App Logo - https://thenounproject.com/icon/health-6969375
- Other Logo used - https://logoipsum.com/category/logogram
- Image assets
  - https://pixels.market/illustrations/funkyways
  - https://www.svgrepo.com/collection/soco-st-various-illustration-vectors

### Font Attribution

- Font - https://fonts.google.com/specimen/Rubik
