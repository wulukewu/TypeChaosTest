import TypingTest from "./components/TypingTest";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const App = () => {
  return (
    <div className="min-h-screen bg-background">
      <TooltipProvider>
        <Toaster />
        <TypingTest />
      </TooltipProvider>
    </div>
  );
};

export default App;
