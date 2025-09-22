"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Users, TrendingUp, Clock, Shield, Globe, Zap } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "1M+",
    label: "Active Users",
    description: "Growing community worldwide",
    color: "text-blue-500",
  },
  {
    icon: TrendingUp,
    value: "99.9%",
    label: "Success Rate",
    description: "Reliable service delivery",
    color: "text-green-500",
  },
  {
    icon: Clock,
    value: "< 1hr",
    label: "Average Delivery",
    description: "Lightning fast results",
    color: "text-yellow-500",
  },
  {
    icon: Shield,
    value: "24/7",
    label: "Support",
    description: "Always here to help",
    color: "text-purple-500",
  },
  {
    icon: Globe,
    value: "50+",
    label: "Countries",
    description: "Global reach",
    color: "text-cyan-500",
  },
  {
    icon: Zap,
    value: "10M+",
    label: "Orders Completed",
    description: "Proven track record",
    color: "text-orange-500",
  },
];

export function StatsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by Millions Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their
            social media presence with our services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-background border-2 border-border/50 mb-4 group-hover:border-primary/50 transition-colors ${stat.color}`}
                >
                  <stat.icon className="w-8 h-8" />
                </motion.div>

                {/* Animated background glow */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 0.1 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.color.replace("text-", "from-")} to-transparent blur-xl`}
                />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
                className="space-y-2"
              >
                <div className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="font-semibold text-foreground">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

