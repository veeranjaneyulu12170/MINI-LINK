import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import Foter from './Foter';
import Logo from './Logo';
import { 
  CheckCircle2, 
  Shield, 
  Zap, 
  Globe, 
  BarChart2, 
  Users,
  Star,
  MessageCircle,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Link as LinkIcon,
  Music,
  Ticket,
  ShoppingBag,
  BookOpen,
  Gift,
  MessageSquare,
  Contact
} from 'lucide-react';
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaTiktok
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const SUBTLE_PARALLAX = {
  translateY: ['0px', '50px'] as [string, string],
  scale: [0.98, 1.02] as [number, number],
  easing: "easeInOutQuad" as const,
  shouldAlwaysCompleteAnimation: true,
  expanded: false
};

const MEDIUM_PARALLAX = {
  translateY: ['0px', '100px'] as [string, string],
  scale: [0.95, 1.05] as [number, number],
  easing: "easeInOutQuad" as const,
  shouldAlwaysCompleteAnimation: true,
  expanded: false
};

const LandingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Check for saved section
    const lastSection = localStorage.getItem('lastSection');
    if (lastSection) {
      const element = document.getElementById(lastSection);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      localStorage.removeItem('lastSection'); // Clear after use
    }
  }, []);

  const handleGetFreeLink = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <ParallaxProvider>
    <div className="min-h-screen">
      {/* Navigation */}
      

      {/* Hero Section */}
      <div className="relative min-h-screen pt-16 flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                id="home"
                className="relative z-10"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                The easiest place to update and share your Connection
              </h1>
              <p className="text-gray-700 mb-8 text-lg">
                Help your followers discover everything you're sharing all over the internet, in one simple place. They'll thank you for it!
              </p>
              <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleGetFreeLink}
                  className="bg-indigo-600 text-white px-6 py-3 
                            rounded-md text-lg font-semibold 
                            hover:bg-indigo-700 transition-colors"
                >
                  Get your free link
                  </button>
                <Link
                  to="/pricing"
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-3 
                            rounded-md text-lg font-semibold 
                            hover:bg-gray-50 transition-colors"
                >
                  See pricing
                </Link>
              </div>
              </motion.div>
              <motion.div className="relative">
                <Parallax {...MEDIUM_PARALLAX}>
              <img 
                src="src/public/images/Analytics 1 1.png" 
                alt="Dashboard preview" 
                className="rounded-lg shadow-xl"
              />
                </Parallax>
              </motion.div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
        <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Parallax
                  translateY={['0px', '100px']}
                  scale={[0.97, 1.03]}
                  easing="easeInOutQuad"
                  shouldAlwaysCompleteAnimation={true}
                >
              <img 
                src="src/public/images/div.png" 
                alt="Analytics dashboard" 
                className="rounded-lg shadow-lg"
              />
                </Parallax>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Analyze your audience and keep your followers engaged
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Track your engagement over time, monitor revenue attribution, what's converting your audience. Make informed updates on the fly to keep them coming back.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time click tracking and analytics",
                  "Audience demographics and insights",
                  "Revenue attribution from multiple sources",
                  "Conversion rate optimization tools"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              </motion.div>
          </div>
        </div>
      </section>

      {/* Monetization Section */}
        <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                className="order-2 md:order-1"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Sell products and collect payments. It's monetization made simple.
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Turn your audience into customers with our seamless payment integration. Set up once and start earning.
              </p>
              <ul className="space-y-4">
                {[
                  "Accept payments with just a few clicks",
                  "Multiple pricing tiers and subscription options",
                  "Digital product delivery automation",
                  "Detailed revenue reporting and analytics"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              </motion.div>
              <motion.div
                className="order-1 md:order-2"
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Parallax 
                  translateY={['0px', '140px']} 
                  scale={[0.85, 1.15]}
                >
              <img 
                src="src\public\images\A high-angle perspective, high-resolution stock photo of a modern, minimalistic e-commerce dashboard interface. The UI displays payment systems, pricing tiers, subscription op.jpg" 
                alt="Payment dashboard" 
                className="rounded-lg shadow-lg"
              />
                </Parallax>
              </motion.div>
          </div>
        </div>
      </section>

      {/* Content Sharing Section */}
        <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Image with Parallax */}
              <Parallax
                translateY={['0px', '80px']}
                scale={[0.95, 1.05]}
                easing="easeInOutQuad"
                shouldAlwaysCompleteAnimation={true}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
              <img 
                src="src/public/images/gyhn.png" 
                alt="Content showcase" 
                    className="rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  />
                </motion.div>
              </Parallax>

              {/* Content with Parallax */}
              <Parallax
                translateY={['0px', '40px']}
                scale={[0.98, 1.02]}
                easing="easeInOutQuad"
                shouldAlwaysCompleteAnimation={true}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Share limitless content in limitless ways
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Connect your content with fans and help followers find more of what they love. Share videos, Tweets, TikToks, blogs, music, articles, photos, products and more - all in one organized, single powerful place.
              </p>
              <ul className="space-y-4">
                {[
                  "Multiple content formats supported",
                  "Customizable layouts and themes",
                  "Schedule and automate content publishing",
                  "Searchable content library"
                ].map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start"
                      >
                    <CheckCircle2 className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                      </motion.li>
                ))}
              </ul>
                </motion.div>
              </Parallax>
            </div>
      </div>
      </section>

        {/* Features Section with Staggered Animation */}
        <section id="features" className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Parallax {...SUBTLE_PARALLAX}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage your links
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features to help you grow your online presence and track your success
            </p>
              </motion.div>
            </Parallax>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-indigo-600" />,
                title: "Secure & Reliable",
                description: "Enterprise-grade security and 99.9% uptime guarantee"
              },
              {
                icon: <Zap className="w-8 h-8 text-indigo-600" />,
                title: "Lightning Fast",
                description: "Optimized for speed with global CDN distribution"
              },
              {
                icon: <Globe className="w-8 h-8 text-indigo-600" />,
                title: "Global Reach",
                description: "Connect with audience worldwide with localized links"
              },
              {
                icon: <BarChart2 className="w-8 h-8 text-indigo-600" />,
                title: "Advanced Analytics",
                description: "Detailed insights into your link performance"
              },
              {
                icon: <Users className="w-8 h-8 text-indigo-600" />,
                title: "Team Collaboration",
                description: "Work together seamlessly with team features"
              },
              {
                icon: <CheckCircle2 className="w-8 h-8 text-indigo-600" />,
                title: "Easy Integration",
                description: "Connect with your favorite tools and platforms"
              }
            ].map((feature, index) => (
                <Parallax
                  key={index}
                  translateY={['0px', '40px']}
                  scale={[0.98, 1.02]}
                  easing="easeInOutQuad"
                  shouldAlwaysCompleteAnimation={true}
                >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
                </Parallax>
            ))}
          </div>
        </div>
      </section>

        {/* Integrations Section with Grid Animation */}
        <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Parallax {...SUBTLE_PARALLAX}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              All Link Apps and Integrations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with your favorite tools and platforms
            </p>
              </motion.div>
            </Parallax>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Automark",
                description: "Add an Audiomark player to your links",
                  color: "bg-yellow-100",
                  icon: <Music className="w-6 h-6 text-yellow-600" />
              },
              {
                name: "Blazorbrawl",
                description: "Drive ticket sales by listing your events",
                  color: "bg-blue-100",
                  icon: <Ticket className="w-6 h-6 text-blue-600" />
              },
              {
                name: "Borafo",
                description: "Display and sell your custom merch",
                  color: "bg-red-100",
                  icon: <ShoppingBag className="w-6 h-6 text-red-600" />
              },
              {
                name: "Docks",
                description: "Promote books on your timeline",
                  color: "bg-gray-100",
                  icon: <BookOpen className="w-6 h-6 text-gray-600" />
              },
              {
                name: "Buy Me a Gift",
                description: "Allow your support you with a small gift",
                  color: "bg-red-100",
                  icon: <Gift className="w-6 h-6 text-red-600" />
              },
              {
                name: "Carioso",
                description: "Make impossible fan conversations possible",
                  color: "bg-purple-100",
                  icon: <MessageCircle className="w-6 h-6 text-purple-600" />
              },
              {
                name: "Clubhouse",
                description: "Let your community in on the conversation",
                  color: "bg-yellow-100",
                  icon: <Users className="w-6 h-6 text-yellow-600" />
              },
              {
                name: "Community",
                description: "Build an SMS subscriber list",
                  color: "bg-gray-100",
                  icon: <MessageSquare className="w-6 h-6 text-gray-600" />
              },
              {
                name: "Connect Datum",
                description: "Easily share downloadable contact details",
                  color: "bg-purple-100",
                  icon: <Contact className="w-6 h-6 text-purple-600" />
              }
            ].map((integration, index) => (
                <Parallax
                  key={index}
                  translateY={[`${index % 2 ? '0px' : '-32px'}`, `${index % 2 ? '32px' : '0px'}`]}
                  scale={[0.98, 1.02]}
                  easing="easeInOutQuad"
                  shouldAlwaysCompleteAnimation={true}
                >
              <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className={`${integration.color} p-6 rounded-lg`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        {integration.icon}
                </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-1">{integration.name}</h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                </div>
              </motion.div>
                </Parallax>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Parallax {...SUBTLE_PARALLAX}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Here's what our customers have to say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied users worldwide
            </p>
          </div>
            </Parallax>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  text: "MiniLink has transformed how I share content with my audience. The analytics are incredible!",
                  name: "Sarah Johnson",
                  role: "Content Creator",
                  avatar: "src/public/images/a1.jpeg",
                  gradient: "from-blue-400 to-indigo-500"
                },
                {
                  text: "The best link management tool I've ever used. Clean interface and powerful features.",
                  name: "Michael Chen",
                  role: "Digital Marketer",
                  avatar: "src/public/images/a2.jpeg",
                  gradient: "from-green-400 to-emerald-500"
                },
                {
                  text: "Integration options are fantastic. I can connect all my platforms seamlessly.",
                  name: "Emily Rodriguez",
                  role: "Social Media Manager",
                  avatar: "src/public/images/a3.jpeg",
                  gradient: "from-purple-400 to-pink-500"
                },
                {
                  text: "The analytics insights have helped me understand my audience better than ever.",
                  name: "David Kim",
                  role: "Entrepreneur",
                  avatar: "src/public/images/a4.jpeg",
                  gradient: "from-orange-400 to-red-500"
                }
              ].map((testimonial, index) => (
                <Parallax
                  key={index}
                  translateY={[`${index % 2 ? '0px' : '-48px'}`, `${index % 2 ? '48px' : '0px'}`]}
                  scale={[0.98, 1.02]}
                  easing="easeInOutQuad"
                  shouldAlwaysCompleteAnimation={true}
                >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                  >
                    {/* Background gradient */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${testimonial.gradient} opacity-10 rounded-full transform translate-x-16 -translate-y-16`}></div>
                    
                    <div className="relative">
                      <p className="text-gray-700 mb-6 text-lg italic">
                        "{testimonial.text}"
                </p>
                <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br ${testimonial.gradient} rounded-full border-2 border-white`}></div>
                        </div>
                        <div className="ml-4">
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                  </div>
                </div>
              </motion.div>
                </Parallax>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "0",
                features: ["5 links", "Basic analytics", "Standard support", "Mobile-friendly links"]
              },
              {
                name: "Pro",
                price: "9",
                features: ["Unlimited links", "Advanced analytics", "Priority support", "Custom domains", "Remove branding", "Link scheduling"]
              },
              {
                name: "Enterprise",
                price: "29",
                features: ["Everything in Pro", "Team collaboration", "API access", "24/7 support", "Custom integrations", "Dedicated account manager"]
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white p-8 rounded-2xl shadow-lg ${
                  index === 1 ? 'border-2 border-indigo-500 relative' : ''
                }`}
              >
                {index === 1 && (
                  <span className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 text-sm rounded-bl-lg rounded-tr-xl">
                    Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-semibold ${
                  index === 1
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get in touch
            </h2>
            <p className="text-xl text-gray-600">
              We'd love to hear from you
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info - Spans 2 columns on medium screens */}
            <div className="md:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                <Logo size="small" color="light" />
                <span className="ml-2 text-xl font-bold">MiniLink</span>
              </div>
              <p className="text-gray-400">Simplify your links, track your clicks</p>
              <div className="flex space-x-4 mt-4">
                <FaTwitter className="text-purple-400 hover:text-purple-300 text-xl cursor-pointer" />
                <FaFacebookF className="text-purple-400 hover:text-purple-300 text-xl cursor-pointer" />
                <FaLinkedinIn className="text-purple-400 hover:text-purple-300 text-xl cursor-pointer" />
                <FaInstagram className="text-purple-400 hover:text-purple-300 text-xl cursor-pointer" />
                <FaYoutube className="text-purple-400 hover:text-purple-300 text-xl cursor-pointer" />
                <FaTiktok className="text-purple-400 hover:text-purple-300 text-xl cursor-pointer" />
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Get In Touch</h3>
              <div className="space-y-2">
                <p className="flex items-center text-gray-400">
                  <MapPin className="text-purple-400 mr-2 h-5 w-5" />
                  Richardson, California 62639
                </p>
                <p className="flex items-center text-gray-400">
                  <Mail className="text-purple-400 mr-2 h-5 w-5" />
                  hello@minilink.com
                </p>
                <p className="flex items-center text-gray-400">
                  <Phone className="text-purple-400 mr-2 h-5 w-5" />
                  (405) 555-0128
                </p>
                <p className="flex items-center text-gray-400">
                  <Calendar className="text-purple-400 mr-2 h-5 w-5" />
                  Mon-Fri: 9am-5pm PST
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['Home', 'About', 'Team', 'Pricing', 'Blog'].map((item) => (
                  <li key={item} className="text-gray-400 hover:text-purple-400 cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {['Help Center', 'Careers', 'FAQs', 'Privacy Policy', 'Terms and Conditions'].map((item) => (
                  <li key={item} className="text-gray-400 hover:text-purple-400 cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright and Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} MiniLink. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a href="#" className="text-gray-400 hover:text-purple-400">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-purple-400">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-purple-400">Cookies</a>
                <a href="#" className="text-gray-400 hover:text-purple-400">Report a Problem</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </ParallaxProvider>
  );
};

export default LandingPage; 