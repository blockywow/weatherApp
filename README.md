# Moon Phase App

A React Native app built with Expo that displays the moon phase for a selected date using the U.S. Naval Observatory API.

## Features
- Displays the moon phase and date.
- Navigate to the previous or next day.
- Return to today's date.
- Loading indicator and error handling.

## How It Works
1. Fetches moon phase data from the [U.S. Naval Observatory API](https://aa.usno.navy.mil/api/rstt/oneday).
2. Converts the API response from JSON into JavaScript data.
3. Extracts the moon phase and formats the date for display.
4. Uses React state to update the screen when the selected date changes.

## Technologies
- React Native and Expo
- TypeScript
- React Hooks (`useState` and `useEffect`)
- Fetch API and JSON

## Run the App
Start the Expo development server with `npx expo start`, then open the app using Expo Go.
