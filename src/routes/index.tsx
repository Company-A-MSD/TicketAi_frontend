import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Ticket,
  Zap,
  Shield,
  BarChart3,
  Users,
  MessageSquare,
  ArrowRight,
  Star,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { get } from "http";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isAuthenticated, getDashboardRoute } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Ticket className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">TicketAI</span>
            </div>
            <nav className="hidden space-x-8 md:flex">
              <a
                href="#features"
                className="text-gray-700 transition-colors hover:text-blue-600"
              >
                Features
              </a>
              <a
                href="#benefits"
                className="text-gray-700 transition-colors hover:text-blue-600"
              >
                Benefits
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 transition-colors hover:text-blue-600"
              >
                Testimonials
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              {isAuthenticated() ? (
                <Link to={getDashboardRoute()}>
                  <Button variant="outline" className="hidden sm:inline-flex">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login">
                    <Button variant="outline" className="hidden sm:inline-flex">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto text-center max-w-7xl">
          <Badge className="mb-4 text-blue-800 bg-blue-100 border-blue-200">
            🚀 AI-Powered Ticket Management
          </Badge>
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl">
            Transform Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Customer Support
            </span>
          </h1>
          <p className="max-w-3xl mx-auto mb-8 text-xl text-gray-600">
            TicketAI revolutionizes customer support with intelligent
            automation, instant responses, and seamless ticket management
            powered by advanced AI.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="px-8 py-3 text-white bg-blue-600 hover:bg-blue-700"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8 bg-white/50">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to deliver exceptional customer support
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 transition-shadow border-0 hover:shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="ml-3 text-xl font-semibold text-gray-900">
                  Instant AI Responses
                </h3>
              </div>
              <p className="text-gray-600">
                Get intelligent, context-aware responses to customer queries in
                seconds with our advanced AI engine.
              </p>
            </Card>

            <Card className="p-6 transition-shadow border-0 hover:shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="ml-3 text-xl font-semibold text-gray-900">
                  Smart Routing
                </h3>
              </div>
              <p className="text-gray-600">
                Automatically route tickets to the right team members based on
                expertise and availability.
              </p>
            </Card>

            <Card className="p-6 transition-shadow border-0 hover:shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="ml-3 text-xl font-semibold text-gray-900">
                  Analytics & Insights
                </h3>
              </div>
              <p className="text-gray-600">
                Track performance metrics, response times, and customer
                satisfaction with detailed analytics.
              </p>
            </Card>

            <Card className="p-6 transition-shadow border-0 hover:shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="ml-3 text-xl font-semibold text-gray-900">
                  Team Collaboration
                </h3>
              </div>
              <p className="text-gray-600">
                Enable seamless collaboration between team members with shared
                workspaces and real-time updates.
              </p>
            </Card>

            <Card className="p-6 transition-shadow border-0 hover:shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="ml-3 text-xl font-semibold text-gray-900">
                  Multi-Channel Support
                </h3>
              </div>
              <p className="text-gray-600">
                Manage tickets from email, chat, social media, and phone calls
                in one unified platform.
              </p>
            </Card>

            <Card className="p-6 transition-shadow border-0 hover:shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="ml-3 text-xl font-semibold text-gray-900">
                  SLA Management
                </h3>
              </div>
              <p className="text-gray-600">
                Set and track service level agreements with automated
                escalations and deadline management.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                Why Choose TicketAI?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Reduce Response Time by 90%
                    </h3>
                    <p className="text-gray-600">
                      AI-powered responses ensure customers get help instantly,
                      any time of day.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Increase Agent Productivity
                    </h3>
                    <p className="text-gray-600">
                      Automate routine tasks and let your team focus on complex
                      issues.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Improve Customer Satisfaction
                    </h3>
                    <p className="text-gray-600">
                      Deliver consistent, accurate, and helpful responses every
                      time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="p-8 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="mb-2 text-3xl font-bold">90%</div>
                    <div className="text-sm opacity-90">Faster Response</div>
                  </div>
                  <div>
                    <div className="mb-2 text-3xl font-bold">95%</div>
                    <div className="text-sm opacity-90">
                      Customer Satisfaction
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-3xl font-bold">60%</div>
                    <div className="text-sm opacity-90">Cost Reduction</div>
                  </div>
                  <div>
                    <div className="mb-2 text-3xl font-bold">24/7</div>
                    <div className="text-sm opacity-90">Availability</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="px-4 py-20 sm:px-6 lg:px-8 bg-white/50"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied customers who transformed their
              support
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="mb-4 text-gray-600">
                "TicketAI has completely transformed our customer support.
                Response times are down 85% and our team can focus on complex
                issues."
              </p>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  <span className="font-semibold text-blue-600">JS</span>
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">John Smith</div>
                  <div className="text-sm text-gray-600">CEO, TechCorp</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="mb-4 text-gray-600">
                "The AI responses are incredibly accurate and our customers love
                the instant support. Game-changer for our business!"
              </p>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                  <span className="font-semibold text-purple-600">MJ</span>
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">
                    Maria Johnson
                  </div>
                  <div className="text-sm text-gray-600">
                    Support Manager, StartupXYZ
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="mb-4 text-gray-600">
                "Setup was incredibly easy and the results were immediate. Our
                customer satisfaction scores have never been higher."
              </p>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                  <span className="font-semibold text-green-600">AD</span>
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900">Alex Davis</div>
                  <div className="text-sm text-gray-600">CTO, InnovateCo</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to Transform Your Customer Support?
          </h2>
          <p className="mb-8 text-xl opacity-90">
            Join thousands of companies already using TicketAI to deliver
            exceptional customer experiences.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="px-8 py-3 text-blue-600 bg-white hover:bg-gray-100"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 text-white bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center mb-4 space-x-2">
                <Ticket className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-bold">TicketAI</span>
              </div>
              <p className="text-gray-400">
                AI-powered customer support that scales with your business.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-white">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 text-center text-gray-400 border-t border-gray-800">
            <p>&copy; 2025 TicketAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
