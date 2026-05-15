import Hero from '../components/landing/Hero'
import StatsBand from '../components/landing/StatsBand'
import HowItWorks from '../components/landing/HowItWorks'
import FeatureShowcase from '../components/landing/FeatureShowcase'
import PrivacySection from '../components/landing/PrivacySection'
import FinalCTA from '../components/landing/FinalCTA'
import Footer from '../components/layout/Footer'

export default function Landing() {
  return (
    <main id="main-content">
      <Hero />
      <StatsBand />
      <HowItWorks />
      <FeatureShowcase />
      <PrivacySection />
      <FinalCTA />
      <Footer />
    </main>
  )
}
