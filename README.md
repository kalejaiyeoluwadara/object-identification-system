# Object Identification System

A React Native mobile application that uses AI-powered object detection to identify and describe objects through your device's camera.

## 🚀 Features

- **Real-time Camera Capture**: Take photos using your device's front or back camera
- **AI Object Detection**: Automatically identify objects in captured images
- **Detailed Descriptions**: Get comprehensive information about detected objects
- **Cross-platform**: Works on both iOS and Android devices
- **Modern UI**: Built with NativeWind (Tailwind CSS for React Native)

## 📱 Screenshots

The app consists of three main screens:

- **Camera Screen**: Capture photos with camera controls
- **Result Screen**: View AI analysis results and object descriptions
- **Loading States**: Smooth user experience with progress indicators

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS)
- **Camera**: Expo Camera
- **AI Integration**: Gemini Vision API
- **Language**: TypeScript
- **Code Quality**: ESLint & Prettier

## 📋 Prerequisites

- Node.js (v18 or higher)
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## 🚀 Getting Started

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd object-identification-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   bun start
   ```

### Running the App

- **iOS**: Press `i` in the terminal or scan the QR code with Expo Go app
- **Android**: Press `a` in the terminal or scan the QR code with Expo Go app
- **Web**: Press `w` in the terminal

## 🔧 Configuration

### API Setup

The app uses a Gemini Vision API endpoint for object detection. Update the API endpoint in `src/utils/objectDetection.ts` if needed:

```typescript
const API_ENDPOINT = "https://gemini-api-46ez.onrender.com/vision/identify";
```

### Permissions

The app requires the following permissions:

- Camera access for photo capture
- Media library access for saving photos

## 📁 Project Structure

```
src/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout
│   ├── camera.tsx         # Camera capture screen
│   ├── index.tsx          # Entry point (redirects to camera)
│   └── result.tsx         # Results display screen
├── components/             # Reusable UI components
│   ├── AppText.tsx        # Text component
│   ├── Button.tsx         # Button variants
│   └── LoadingSpinner.tsx # Loading indicator
└── utils/                  # Utility functions
    ├── cn.ts              # Tailwind class merging
    ├── objectDetection.ts # AI API integration
    └── types.ts           # TypeScript type definitions
```

## 🎯 How It Works

1. **Photo Capture**: User takes a photo using the camera interface
2. **Image Processing**: Photo is processed and sent to the AI API
3. **Object Detection**: AI analyzes the image and identifies objects
4. **Results Display**: Detailed information about detected objects is shown
5. **User Interaction**: Users can retake photos or view results

## 🚀 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint for code quality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Styled with [NativeWind](https://www.nativewind.dev/)
- AI powered by [Gemini Vision API](https://ai.google.dev/gemini-api)

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/your-username/object-identification-system/issues) page
2. Create a new issue with detailed information
3. Include device information and error logs

---

**Made with ❤️ using React Native and Expo**
