# Zynetic Frontend

This is the frontend for the Zynetic application, built with React and Vite.

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd Zynetic/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the environment:

   - Update the `vite.config.js` file if needed to set the correct `base` and `proxy` settings for your backend.
   - Ensure the backend URL in the `proxy` configuration matches your backend deployment.

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Build for production:

   ```bash
   npm run build
   ```

6. Preview the production build:

   ```bash
   npm run preview
   ```

7. Deploy to GitHub Pages:

   ```bash
   npm run deploy
   ```

## Features

- User authentication (signup, login)
- Product management (view, add, edit, delete)
- Product rating system
- Admin and user roles

## Deployment

The frontend is configured to deploy to GitHub Pages. Ensure the `homepage` field in `package.json` is set to your repository's GitHub Pages URL.

## Environment Variables

- Ensure the backend API URL is correctly set in the `vite.config.js` file under the `proxy` configuration.

## Troubleshooting

- If the development server fails to start, ensure that Node.js and npm are installed and up-to-date.
- If the proxy to the backend does not work, verify the backend URL and ensure the backend server is running.

## License

This project is licensed under the MIT License.
