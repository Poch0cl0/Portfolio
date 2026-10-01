import { Hero } from "@/components/sections/hero";
import { Capabilities } from "@/components/sections/capabilities";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { ChatAssistantSection } from "@/components/sections/chat-assistant-section";
import { StackPreview } from "@/components/sections/stack-preview";
import { CTA } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <FeaturedProjects />
      <ChatAssistantSection />
      <StackPreview />
      <CTA />
    </>
  );
}
