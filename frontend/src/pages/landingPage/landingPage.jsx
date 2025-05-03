import Navbar from "../../components/navbar/navbar";
import Hero from "../../components/hero/hero";
import HowItWorks from "../../components/howItWorks/howItWorks";
import Footer from "../../components/footer/footer";
export default function LandingPage() {
  return (
    <div className="layout">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Footer />
    </div>
  );
}
