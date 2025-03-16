# ImageToOCR Utility

Welcome to the ImageToOCR Utility project. This project is built with Next.js and TypeScript and leverages the power of the Google Generative AI API to extract text from images. The utility provides a simple interface where users can upload an image and receive the extracted text.

## Features

- **OCR Extraction:** Uses a Google Generative AI model ("gemini-1.5-flash") to accurately extract text from images.
- **Simple UI:** A clean and responsive interface built with Tailwind CSS and daisyUI.
- **Next.js Framework:** Optimized for server-side rendering and a great development experience.
- **Modern Tools:** Utilizes TypeScript, ESLint for code quality, and Next.js' latest features.

## Project Structure

- **src/app:** Contains the main application components, including layout, global styles, and page setup.
- **src/app/ui:** Houses the UI components such as the Navbar and ImageInput for file uploads.
- **src/gemini:** Contains server-side logic to interact with the Google Generative AI API for OCR.
- **Configuration Files:** Includes configuration files for ESLint, TypeScript, Next.js, and PostCSS.

## Getting Started

1. **Install dependencies:**
  Run `npm install` or `yarn` in the project directory.

2. **Setup Environment Variables:**
  Create a `.env.local` file at the root of the project and set your API key:
  ```
  KEY=your_google_api_key
  ```

3. **Run the Development Server:**
  Start the Next.js dev server with:
  ```
  npm run dev
  ```
  or
  ```
  yarn dev
  ```
  The application will be available at [http://localhost:3000](http://localhost:3000).

4. **Build and Start:**
  To create a production build, run:
  ```
  npm run build
  npm run start
  ```

## Usage

- Navigate to the main page.
- Upload an image using the provided file input.
- The OCR utility processes the image and displays the extracted text on the screen.

## Technologies Used

- **Next.js & React:** Frontend framework and component library.
- **TypeScript:** For type-safe coding.
- **Tailwind CSS & daisyUI:** Tailor-made styling and component library.
- **Google Generative AI API:** For OCR functionality.
- **ESLint:** Ensures code quality and consistency.
