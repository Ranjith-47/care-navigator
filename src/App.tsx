import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Guidelines from "./pages/Guidelines";
import TNGuidelinesPage from "./pages/TNGuidelines";
import HospitalLocator from "./pages/HospitalLocator";
import EmergencyHotlines from "./pages/EmergencyHotlines";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/guidelines" element={<Guidelines />} />

          {/* Newly added pages */}
          <Route path="/tn-guidelines" element={<TNGuidelinesPage />} />
          <Route path="/hospital-locator" element={<HospitalLocator />} />
          <Route path="/emergency-hotlines" element={<EmergencyHotlines />} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
