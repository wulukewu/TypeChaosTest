import TypingTest from "./components/TypingTest";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const App = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TooltipProvider>
        <Toaster />
        <main className="container mx-auto px-4 py-8">
          <TypingTest />
        </main>
      </TooltipProvider>
    </div>
  );
};

export default App;
