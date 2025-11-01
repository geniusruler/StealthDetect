![stealthdetectlogo](https://github.com/user-attachments/assets/cddd9c3c-e0d2-4ce0-8536-dcf0c4b94602)

# StealthDetect

StealthDetect is a mobile app that helps detect stalkerware/spyware by analyzing network traffic captured via a VPN profile. It uses an Expo React Native frontend so you can scan your device with Expo Go.

## Prerequisites
- Node.js (LTS recommended) and npm
- Expo CLI (optional): npx can be used without a global install
- An iOS or Android device with the Expo Go app:
  - Expo Go for iOS: https://apps.apple.com/app/expo-go/id982107779
  - Expo Go for Android: https://play.google.com/store/apps/details?id=host.exp.exponent

## Getting started

1. Clone the repository:
   ```bash
   git clone https://github.com/geniusruler/StealthDetect.git
   ```

2. Change into the project and frontend directory, then install dependencies:
   ```bash
   cd StealthDetect
   cd frontend
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Open Expo Go on your mobile device and scan the QR code shown in the terminal or browser to run the app.

## Changelog
- Modified package.json to include React 19.1.0 overrides (Due to discrepancies between web and mobile React versions):
    ```
    "overrides": { 
        "react": "19.1.0",
        "react-dom": "19.1.0"
      },
    ```


## Contributing
Contributions and bug reports are welcome. Open an issue or submit a pull request.

## License
See the repository LICENSE (if provided).
