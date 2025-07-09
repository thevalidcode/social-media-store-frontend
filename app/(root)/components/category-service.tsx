"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Users,
  Heart,
  MessageCircle,
  Eye,
  Share2,
  Instagram,
  TrendingUp,
  Star,
  Zap,
} from "lucide-react";

// Category data with matching IDs for text and images
const categories = [
  {
    id: "followers",
    title: "Followers & Subscribers",
    description:
      "Grow your social media presence with authentic followers and subscribers across all major platforms.",
    icon: Users,
    features: [
      "Instagram Followers",
      "YouTube Subscribers",
      "TikTok Followers",
      "Twitter Followers",
    ],
    image: "/images/followers-service.jpg", // Placeholder - replace with actual image
  },
  {
    id: "likes",
    title: "Likes & Reactions",
    description:
      "Boost engagement with likes, hearts, and reactions to make your content stand out.",
    icon: Heart,
    features: [
      "Instagram Likes",
      "Facebook Reactions",
      "YouTube Likes",
      "TikTok Hearts",
    ],
    image: "/images/likes-service.jpg",
  },
  {
    id: "comments",
    title: "Comments & Reviews",
    description:
      "Generate authentic comments and reviews to build trust and credibility.",
    icon: MessageCircle,
    features: [
      "Instagram Comments",
      "YouTube Comments",
      "Product Reviews",
      "Testimonials",
    ],
    image: "/images/comments-service.jpg",
  },
  {
    id: "views",
    title: "Views & Watch Time",
    description:
      "Increase your content reach with views and watch time to boost algorithm performance.",
    icon: Eye,
    features: [
      "YouTube Views",
      "TikTok Views",
      "Instagram Reels Views",
      "Story Views",
    ],
    image: "/images/views-service.jpg",
  },
  {
    id: "shares",
    title: "Shares & Retweets",
    description:
      "Amplify your content reach through shares, retweets, and reposts.",
    icon: Share2,
    features: [
      "Twitter Retweets",
      "Facebook Shares",
      "Instagram Reposts",
      "TikTok Shares",
    ],
    image: "/images/shares-service.jpg",
  },
  {
    id: "engagement",
    title: "Story Views & Engagement",
    description:
      "Maximize your story engagement with views, reactions, and interactions.",
    icon: Instagram,
    features: [
      "Instagram Story Views",
      "Snapchat Views",
      "Story Reactions",
      "Direct Messages",
    ],
    image: "/images/engagement-service.jpg",
  },
];

export default function CategoryService() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("followers");

  // Track which category is currently in view
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;

      // Calculate which category should be active based on scroll position
      const categoryHeight = containerHeight / categories.length;
      const scrollPosition = scrollTop + windowHeight / 2 - containerTop;
      const activeIndex = Math.floor(scrollPosition / categoryHeight);

      if (activeIndex >= 0 && activeIndex < categories.length) {
        setActiveCategory(categories[activeIndex].id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
            Popular Social Media Services
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Sell high-quality social media services across all major platforms.
            Each category is designed to help your customers grow their online
            presence.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Text Sections */}
          <div className="space-y-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                id={category.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className={`relative p-8 rounded-2xl backdrop-blur-sm border transition-all duration-500 ${
                  activeCategory === category.id
                    ? "bg-white/10 border-purple-400/50 shadow-2xl shadow-purple-500/20"
                    : "bg-white/5 border-white/10 hover:bg-white/8"
                }`}
              >
                {/* Category Icon */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      activeCategory === category.id
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    <category.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {category.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {category.description}
                </p>

                {/* Features List */}
                <div className="grid grid-cols-2 gap-2">
                  {category.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center gap-2 text-sm text-gray-400"
                    >
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Active indicator */}
                {activeCategory === category.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Right Column - Sticky Images */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="relative">
              {categories.map((category) => (
                <motion.div
                  key={`image-${category.id}`}
                  className={`absolute inset-0 transition-all duration-700 ${
                    activeCategory === category.id ? "opacity-100" : "opacity-0"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: activeCategory === category.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                >
                  {/* Image Container */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10">
                    {/* Placeholder for actual images */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <category.icon className="w-24 h-24 mx-auto mb-4 text-purple-400" />
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {category.title}
                        </h3>
                        <p className="text-gray-300 max-w-xs">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="absolute bottom-4 left-4 p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                      <Star className="w-5 h-5 text-yellow-400" />
                    </div>
                  </div>

                  {/* Floating stats */}
                  <motion.div
                    className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
                    initial={{ scale: 0 }}
                    animate={{ scale: activeCategory === category.id ? 1 : 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    +500% Growth
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform cursor-pointer">
            <Zap className="w-5 h-5" />
            Start Selling Services Now
          </div>
        </motion.div>
      </div>
    </section>
  );
}
