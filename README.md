# TypeChaosTest

A modern typing test application built with React and Vite. Test your typing speed and accuracy with a beautiful, responsive interface.

## Live Demo

Try it out: [TypeChaosTest](https://wulukewu.github.io/TypeChaosTest)

## Features

- Real-time typing speed measurement (WPM)
- Accuracy tracking
- Beautiful, responsive UI with Tailwind CSS
- Keyboard visualization
- Instant feedback on typing performance
- Dark/Light mode support

## Tech Stack

- React 18
- Vite 4
- TypeScript
- Tailwind CSS
- Radix UI Components
- Framer Motion for animations

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/wulukewu/TypeChaosTest.git
cd TypeChaosTest
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Development

### Project Structure

```
TypeChaosTest/
├── client/              # Frontend source code
│   ├── src/            # React components and logic
│   │   ├── components/ # Reusable UI components
│   │   ├── constants/  # Application constants
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   ├── pages/      # Page components
│   │   └── types/      # TypeScript type definitions
│   └── index.html      # HTML entry point
├── public/             # Static assets
└── dist/              # Production build output
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
