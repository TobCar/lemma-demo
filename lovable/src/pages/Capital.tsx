import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const steps = [
  {
    number: 1,
    title: "We analyze your claims",
    description: "Real-time underwriting based on payer history and claim quality",
  },
  {
    number: 2,
    title: "Draw what you need",
    description: "Access funds instantly against outstanding claims",
  },
  {
    number: 3,
    title: "Auto-repayment",
    description: "We settle when insurance pays—fully automated",
  },
];

const benefits = [
  "No personal guarantees",
  "Transparent pricing",
  "Preserve ownership",
  "Scales with your practice",
];

const Capital = () => {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 text-sm font-medium">
            Coming Soon
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-3">Lemma Capital</h1>
          <p className="text-lg text-muted-foreground">
            Get paid on your claims before insurance does
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Separator className="mb-8" />
          <div className="grid grid-cols-3 gap-8 text-center mb-8">
            <div>
              <p className="text-xl font-bold text-foreground">Instant</p>
              <p className="text-sm text-muted-foreground">Underwriting</p>
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">80-90%</p>
              <p className="text-sm text-muted-foreground">Advance Rate</p>
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">Same Day</p>
              <p className="text-sm text-muted-foreground">Funding</p>
            </div>
          </div>
          <Separator className="mb-10" />
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6">How it works</h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.25 + index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {step.number}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-10"
        >
          <div className="grid grid-cols-2 gap-x-16 gap-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-muted-foreground">—</span>
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Separator className="mb-10" />
          <div className="text-center">
            <Button className="bg-foreground text-background hover:bg-foreground/90 px-8">
              Join Waitlist
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Be the first to know when we launch
            </p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Capital;
