import React from 'react';
import { Shield, Heart, Users, TrendingUp, CheckCircle, Lock, Award, Globe } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Escrow System',
      description: 'All payments are held in escrow until the buyer confirms receipt and satisfaction with their purchase.'
    },
    {
      icon: Heart,
      title: 'Charity Integration',
      description: 'Every sale automatically donates a percentage to the seller\'s chosen charity, making commerce compassionate.'
    },
    {
      icon: Users,
      title: 'Verified Community',
      description: 'All users go through verification processes to ensure a safe and trustworthy marketplace.'
    },
    {
      icon: TrendingUp,
      title: 'Impact Tracking',
      description: 'Track your charitable impact and see how your purchases and sales are making a difference.'
    }
  ];

  const escrowSteps = [
    {
      step: 1,
      title: 'Purchase Made',
      description: 'Buyer places order and payment is securely held in our escrow account'
    },
    {
      step: 2,
      title: 'Item Shipped',
      description: 'Seller ships the item with tracking information provided to buyer'
    },
    {
      step: 3,
      title: 'Item Received',
      description: 'Buyer receives item and has 7 days to inspect and confirm satisfaction'
    },
    {
      step: 4,
      title: 'Payment Released',
      description: 'Once confirmed, payment is released to seller and charity donation is processed'
    }
  ];

  const stats = [
    { number: '$2.5M+', label: 'Donated to Charities' },
    { number: '150K+', label: 'Items Sold' },
    { number: '75K+', label: 'Happy Users' },
    { number: '500+', label: 'Partner Charities' }
  ];

  const team = [
    {
      name: 'Arren Vijendren',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Visionary entrepreneur passionate about combining technology with social impact to create meaningful change in the world.'
    },
    {
      name: 'Mahmood',
      role: 'Co-Founder',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Strategic leader focused on building sustainable business models that drive both commercial success and charitable impact.'
    }
  ];

  return (
    <div className="dark:bg-slate-900 min-h-screen transition-colors bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            About Trade2Help
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            We're revolutionizing online commerce by making every transaction a force for good.
            Our secure platform connects buyers and sellers while automatically supporting charities worldwide.
          </p>
          <div className="flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400">
            <Heart className="w-6 h-6" />
            <span className="text-lg font-semibold">Making Commerce Compassionate</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{stat.number}</div>
              <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 text-white mb-16 border border-indigo-700/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl leading-relaxed mb-6">
              To create a world where every commercial transaction contributes to positive social impact. 
              We believe that business can be a force for good, and we're building the infrastructure to make that vision a reality.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Globe className="w-6 h-6" />
              <span className="font-semibold">Building a Better World, One Transaction at a Time</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Why Choose Trade2Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-200/60 dark:border-emerald-700/60">
                    <IconComponent className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Escrow System Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-8 mb-16 transition-colors">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-200/60 dark:border-indigo-700/60">
              <Lock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Secure Escrow Protection</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Our escrow system ensures safe transactions for both buyers and sellers.
              Your money is protected until you're completely satisfied with your purchase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {escrowSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-lg border border-indigo-500/30">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-900 border border-emerald-200/60 dark:border-emerald-700/60 rounded-2xl">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">100% Buyer Protection Guarantee</h3>
                <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                  If an item doesn't match its description or arrives damaged, we'll refund your money in full.
                  Our escrow system ensures you never lose money on fraudulent transactions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-200/60 dark:border-indigo-700/60">
                <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">List Your Items</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Upload photos, set your price, and choose which charity gets a percentage of your sale.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-200/60 dark:border-emerald-700/60">
                <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Secure Transactions</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Buyers purchase through our secure escrow system, ensuring safe transactions for everyone.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200/60 dark:border-amber-700/60">
                <Heart className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Support Charities</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Your chosen percentage is automatically donated to the charity, making every sale count.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Meet Our Founders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-40 h-40 rounded-2xl mx-auto mb-6 object-cover shadow-lg border border-slate-200/60 dark:border-slate-700/60"
                />
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">{member.name}</h3>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-4 text-lg">{member.role}</p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 mb-16 transition-colors border border-slate-200/60 dark:border-slate-700/60">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-200/60 dark:border-indigo-700/60">
                <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Trust & Security</h3>
              <p className="text-slate-600 dark:text-slate-400">
                We prioritize the safety and security of our users above all else, with robust verification and escrow systems.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-200/60 dark:border-emerald-700/60">
                <Heart className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Social Impact</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Every transaction on our platform contributes to positive change in the world through charitable giving.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200/60 dark:border-amber-700/60">
                <Award className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Excellence</h3>
              <p className="text-slate-600 dark:text-slate-400">
                We strive for excellence in everything we do, from user experience to charitable impact measurement.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Join thousands of users who are already making commerce compassionate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 border border-indigo-500/30"
            >
              Get Started Today
            </a>
            <a
              href="/charities"
              className="border-2 border-amber-400/50 text-amber-600 dark:text-amber-400 px-8 py-3 rounded-2xl font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300 backdrop-blur-sm"
            >
              View Our Charities
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;