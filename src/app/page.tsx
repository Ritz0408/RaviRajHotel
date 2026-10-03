import SmoothScroll from "@/components/providers/SmoothScroll";
import Nav from "@/components/nav/Nav";
import Cursor from "@/components/ui/Cursor";
import Hero from "@/components/hero/Hero";
import Story from "@/components/sections/Story";
import Experience from "@/components/sections/Experience";
import Brotherhood from "@/components/sections/Brotherhood";
import Dining from "@/components/sections/Dining";
import Marquee from "@/components/sections/Marquee";
import Locations from "@/components/sections/Locations";
import Gallery from "@/components/sections/Gallery";
import Culture from "@/components/sections/Culture";
import Testimonials from "@/components/sections/Testimonials";
import Visit from "@/components/sections/Visit";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Story />
        <Experience />
        <Brotherhood />
        <Dining />
        <Marquee />
        <Locations />
        <Gallery />
        <Culture />
        <Testimonials />
        <Visit />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
