"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Globe,
  Star,
  MessageSquare,
  Calendar,
  Award,
  Lightbulb,
  BarChart3,
  Heart,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = (role) => {
    router.push(`/register?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-pink-50">
      {/* ========== NAVBAR ========== */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">MC</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MentorConnect
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-purple-600 transition"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-purple-600 transition"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-purple-600 transition"
              >
                Success Stories
              </a>
              <a
                href="#faq"
                className="text-gray-700 hover:text-purple-600 transition"
              >
                FAQs
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                Sign In
              </Button>
              <Button
                onClick={() => handleGetStarted("mentee")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button - FIXED */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="hidden md:block pb-4 space-y-3 border-t border-purple-100 pt-4">
              <a
                href="#features"
                className="block text-gray-700 hover:text-purple-600"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block text-gray-700 hover:text-purple-600"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="block text-gray-700 hover:text-purple-600"
              >
                Success Stories
              </a>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/login")}
                >
                  Sign In
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-purple-100 rounded-full">
                  <span className="text-purple-700 font-semibold text-sm">
                    🎓 Connect with Top University Mentors
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Your{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    College Journey
                  </span>
                  <br />
                  Starts Here
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Get personalized guidance from verified students at Harvard,
                  Stanford, MIT, and more. Real mentors. Real experience. Real
                  results.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => handleGetStarted("mentee")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 text-lg"
                >
                  Start as Mentee <ArrowRight className="ml-2" size={20} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleGetStarted("mentor")}
                  className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 text-lg"
                >
                  Become a Mentor
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-purple-200">
                <div>
                  <div className="text-3xl font-bold text-purple-600">12+</div>
                  <p className="text-sm text-gray-600">Top Universities</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <p className="text-sm text-gray-600">Active Mentors</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">1K+</div>
                  <p className="text-sm text-gray-600">Sessions Completed</p>
                </div>
              </div>
            </div>

            {/* Right Image - UPDATED */}
            <div className="relative h-96 md:h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 rounded-3xl opacity-20 blur-3xl"></div>
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/Front.jpeg"
                  alt="MentorConnect Team - Diverse Community"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section
        id="features"
        className="py-20 md:py-32 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose MentorConnect?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for a successful college journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                  <Star size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Expert Guidance</h3>
                <p className="text-gray-600">
                  Learn from verified students who have successfully navigated
                  admissions at top universities including Harvard, Stanford,
                  and Princeton.
                </p>
                <div className="mt-6 flex items-center gap-2 text-purple-600 font-semibold">
                  <CheckCircle size={20} /> Verified mentors
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                  <Heart size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Personalized Support</h3>
                <p className="text-gray-600">
                  Your mentors were in your shoes just a few years ago. They
                  understand your challenges and will support you like an elder
                  sibling.
                </p>
                <div className="mt-6 flex items-center gap-2 text-purple-600 font-semibold">
                  <CheckCircle size={20} /> 1-on-1 sessions
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                  <Zap size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Committed Mentors</h3>
                <p className="text-gray-600">
                  Our mentors go the extra mile - from essay reviews to test
                  prep to internship guidance and building passion projects.
                </p>
                <div className="mt-6 flex items-center gap-2 text-purple-600 font-semibold">
                  <CheckCircle size={20} /> Full support
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS SECTION ========== */}
      <section id="how-it-works" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get matched with your ideal mentor in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Create Your Profile</h3>
              <p className="text-gray-600 mb-6">
                Tell us about your academic goals, target universities, and
                areas where you need guidance.
              </p>
              <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto"></div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Browse & Connect</h3>
              <p className="text-gray-600 mb-6">
                Explore mentor profiles, check their expertise, ratings, and
                availability. Book a session that works for you.
              </p>
              <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto"></div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Start Learning</h3>
              <p className="text-gray-600 mb-6">
                Connect via video call, get personalized guidance, and work
                towards your college goals with support.
              </p>
              <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS SECTION ========== */}
      <section
        id="testimonials"
        className="py-20 md:py-32 bg-gradient-to-r from-purple-50 to-pink-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from mentees who transformed their college journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "MentorConnect helped me get into Stanford! My mentor reviewed
                  all my essays and gave me invaluable insights about what top
                  universities look for."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    AK
                  </div>
                  <div>
                    <p className="font-bold">Aisha Khan</p>
                    <p className="text-sm text-gray-600">
                      Admitted to Stanford
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "The confidence my mentor gave me was unmatched. Not just
                  about academics but also about believing in myself during the
                  entire process."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    RJ
                  </div>
                  <div>
                    <p className="font-bold">Raj Joshi</p>
                    <p className="text-sm text-gray-600">Admitted to MIT</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Finding the right mentor through MentorConnect changed
                  everything. They helped me with resume building and I landed
                  my dream internship!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    SA
                  </div>
                  <div>
                    <p className="font-bold">Sarah Anderson</p>
                    <p className="text-sm text-gray-600">Interned at Google</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section id="faq" className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">?</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">
                      How much does MentorConnect cost?
                    </h4>
                    <p className="text-gray-600">
                      MentorConnect is free for mentees to browse and book
                      sessions. Some premium features may have costs, but basic
                      mentorship access is completely free.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Item 2 */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">?</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">
                      How are mentors verified?
                    </h4>
                    <p className="text-gray-600">
                      All mentors go through a verification process where they
                      submit their university credentials and are manually
                      approved by our admin team before they can accept
                      sessions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Item 3 */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">?</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">
                      Can I change mentors if I'm not satisfied?
                    </h4>
                    <p className="text-gray-600">
                      Absolutely! You can book sessions with multiple mentors to
                      find the best fit. We encourage exploring to find a mentor
                      whose style resonates with you.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Item 4 */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">?</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">
                      What topics can mentors help with?
                    </h4>
                    <p className="text-gray-600">
                      Mentors can help with college admissions, essay reviews,
                      exam prep (SAT/ACT), essay writing, building passion
                      projects, and career guidance. Check individual mentor
                      profiles for their specialties.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your College Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students getting personalized guidance from
            verified mentors at top universities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => handleGetStarted("mentee")}
              className="bg-white text-purple-600 hover:bg-purple-50 px-8 text-lg font-semibold"
            >
              Start as a Mentee <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button
              size="lg"
              onClick={() => handleGetStarted("mentor")}
              className="border-2 border-white text-white hover:bg-white/20 px-8 text-lg font-semibold"
            >
              Become a Mentor
            </Button>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"></div>
                <span className="font-bold text-lg">MentorConnect</span>
              </div>
              <p className="text-gray-400">
                Connecting students with mentors for a better college journey.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="/search" className="hover:text-white transition">
                    Find Mentors
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400">
              © 2025 MentorConnect. All rights reserved. | Made with ❤️ for
              students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
