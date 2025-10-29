# eeditor - Equation Editor

`eeditor` is a web-based mathematical equation editor built with Next.js, React, and TypeScript. It provides a user-friendly interface for creating and editing mathematical formulas, which are rendered using the KaTeX library.

This project is containerized using Docker.

## Key Features

*   **Equation Blocks:** Users can create multiple equation blocks, each containing a separate mathematical formula.
*   **Custom Keyboard:** A custom on-screen keyboard is provided for easy input of LaTeX commands and mathematical symbols. This is especially useful on mobile devices.
*   **Customizable Keys:** Users can add their own custom keys to the keyboard for frequently used symbols or expressions. These custom keys are saved in the browser's cookies.
*   **Native Keyboard Support:** The editor also supports input from the user's native keyboard.
*   **Rich Text Editing:** The editor supports cursor navigation, including word-wise movement, and undo/redo functionality.
*   **Export:** The created equations can be downloaded as a text file containing the LaTeX source code.
*   **Theming:** The application uses `next-themes` for theme management.
*   **Styling:** The UI is styled with Tailwind CSS.

## Getting Started

This project is designed to be run with Docker.

1.  **Build and run the container:**

    ```bash
    docker-compose up -d --build
    ```

2.  **Access the application:**

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The project is structured as a standard Next.js application within a Docker container.

*   `nextjs-project/`: This directory contains the Next.js application.
*   `nextjs-project/app/page.tsx`: The main application logic resides in this file, which manages the editor's state.
*   `nextjs-project/components/`: This directory contains reusable UI components like the math block renderer and the custom keyboard.
*   `nextjs-project/hooks/`: This directory contains custom hooks for handling specific functionalities.
*   `nextjs-project/lib/`: This directory contains utility functions for features like file saving and cookie management.
*   `Dockerfile`: Defines the Docker image for the Next.js application.
*   `docker-compose.yml`: Defines the services, networks, and volumes for the Docker application.
