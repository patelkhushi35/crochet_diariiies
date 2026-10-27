import { Link } from 'react-router-dom';
import { Heart, Sparkles, Truck, Shield, Star, Users, Award, Leaf, Palette, Clock, Package, Gift } from 'lucide-react';
import api from '../utils/api';

export default function About() {
  const [stats, setStats] = useState({
    happyCustomers: 0,
    ordersCompleted: 0,
    customOrders: 0,
    yearsExperience: 0,
  });

  useEffect(() => {
    // In production, fetch from API
    setStats({
      happyCustomers: 2500,
      ordersCompleted: 5000,
      customOrders: 800,
      yearsExperience: 3,
    });
  }, []);

  const story = {
    title: "A little yarn, a lot of love.",
    paragraphs: [
      "Crochet_Diariiies started with a simple love for yarn, colors and creating beautiful things by hand. What began as a hobby in a cozy corner of my home soon blossomed into a passionate journey of sharing handmade warmth with the world.",
      "Every piece is carefully crocheted one stitch at a time. From tiny flowers to thoughtful gifts, our creations are made to bring a little more warmth and happiness into everyday moments. There's something magical about transforming a simple ball of yarn into something that can make someone smile.",
      "Because handmade isn't just a product. It's time, patience, creativity and love woven together. When you hold a Crochet_Diariiies piece, you're holding hours of dedication, a sprinkle of creativity, and a whole lot of heart."
    ]
  };

  const values = [
    { icon: Heart, title: 'Handmade with Love', desc: 'Every stitch made with care and attention to detail' },
    { icon: Sparkles, title: 'Unique Creations', desc: 'No two pieces are exactly the same - each has its own personality' },
    { icon: Leaf, title: 'Sustainable Materials', desc: 'Premium cotton yarns, eco-friendly packaging' },
    { icon: Gift, title: 'Gift-Ready', desc: 'Beautifully packaged, perfect for gifting' },
    { icon: Users, title: 'Community First', desc: 'Building relationships, not just transactions' },
    { icon: Award, title: 'Quality Guaranteed', desc: 'Rigorous quality checks on every piece' },
  ];

  const team = [
    { name: 'Priya Sharma', role: 'Founder & Chief Crocheter', bio: 'Started crocheting at age 12. Turned passion into profession in 2022.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
    { name: 'Meera Patel', role: 'Design & Custom Orders', bio: 'Translates customer dreams into beautiful crochet designs.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
    { name: 'Anjali Singh', role: 'Quality & Packaging', bio: 'Ensures every piece meets our high standards before it reaches you.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300' },
  ];

  const milestones = [
    { year: '2022', title: 'Crochet_Diariiies Born', desc: 'Started from home kitchen with 5 designs' },
    { year: '2023', title: 'First 100 Orders', desc: 'Launched website, shipped across India' },
    { year: '2023', title: 'Custom Orders Launch', desc: 'Began bespoke creations for customers' },
    { year: '2024', title: '1000+ Happy Customers', desc: 'Expanded product range, hired team' },
    { year: '2024', title: 'Studio Space', desc: 'Moved to dedicated creative studio' },
    { year: '2025', title: 'New Collections', desc: 'Seasonal drops, limited editions launched' },
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23EC4899%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="container-custom relative z-10 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-cream-900/50 text-cream-300 text-sm font-medium mb-4">
              Our Story
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6 leading-tight">
              A little yarn, a lot of love.
            </h1>
            <p className="text-lg text-cream-300 max-w-2xl mx-auto">
              Handmade crochet studio creating cute, beautiful and thoughtful yarn-based products 
              since 2022. Every piece tells a story.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-cream-100 text-cream-700 text-sm font-medium mb-4">
                Our Journey
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-medium text-brown-900 mb-6 leading-tight">
                {story.title}
              </h2>
              <div className="space-y-6 text-brown-600 leading-relaxed">
                {story.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <Link to="/custom-orders" className="btn-outline inline-flex mt-6">
                Create Something Custom
                <Sparkles className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-card-lg overflow-hidden shadow-card-lg">
                <img
                  src="https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=800&q=80"
                  alt="Crochet workspace with yarn and finished products"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-cream-500 rounded-full flex items-center justify-center animate-float">
                <Heart className="w-16 h-16 text-white fill-current" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section bg-brown-900 text-cream-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23EC4899%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Happy Customers', value: stats.happyCustomers, suffix: '+', icon: Users },
              { label: 'Orders Completed', value: stats.ordersCompleted, suffix: '+', icon: Package },
              { label: 'Custom Creations', value: stats.customOrders, suffix: '+', icon: Sparkles },
              { label: 'Years of Love', value: stats.yearsExperience, suffix: '+', icon: Heart },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-10 h-10 mx-auto mb-4 text-cream-500" />
                <div className="font-heading text-4xl sm:text-5xl font-bold mb-1">
                  {stat.value.toLocaleString()}<span className="text-cream-500">{stat.suffix}</span>
                </div>
                <p className="text-cream-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-cream-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">What We Stand For</h2>
            <p className="section-subtitle">The values that guide every stitch</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-card-hover transition-shadow">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-cream-100 flex items-center justify-center">
                  <value.icon className="w-7 h-7 text-cream-500" />
                </div>
                <h3 className="font-heading text-lg font-medium text-brown-900 mb-2">{value.title}</h3>
                <p className="text-brown-600 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Meet the Makers</h2>
            <p className="section-subtitle">The hands behind every creation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="aspect-square rounded-full overflow-hidden shadow-card mx-auto max-w-xs">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <h3 className="font-heading text-xl font-medium text-brown-900 mb-1">{member.name}</h3>
                <p className="text-cream-600 text-sm mb-3">{member.role}</p>
                <p className="text-brown-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section bg-cream-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Journey So Far</h2>
            <p className="section-subtitle">Milestones that make us proud</p>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-beige-200" />
            {milestones.map((milestone, index) => (
              <div key={index} className="relative flex items-start space-x-6 mb-12 last:mb-0">
                <div className={`
                  relative flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center z-10
                  ${index % 2 === 0 ? 'bg-cream-500' : 'bg-sage-500'}
                `}>
                  <span className="font-heading text-xl font-bold text-white">{milestone.year}</span>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-heading text-lg font-medium text-brown-900 mb-1">{milestone.title}</h3>
                  <p className="text-brown-600 text-sm">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Behind Every Piece</h2>
            <p className="section-subtitle">The love and care that goes into your order</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Palette, title: 'Design', desc: 'Thoughtful design for every piece' },
              { icon: Leaf, title: 'Materials', desc: 'Premium, sustainable yarns only' },
              { icon: Clock, title: 'Handcraft', desc: 'Hours of patient stitching' },
              { icon: Star, title: 'Quality Check', desc: 'Inspected with love' },
              { icon: Gift, title: 'Gift Wrap', desc: 'Beautifully packaged for you' },
            ].map((step, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-cream-100 flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-cream-500" />
                </div>
                <h3 className="font-heading font-medium text-brown-900 mb-2">{step.title}</h3>
                <p className="text-brown-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-r from-cream-100 via-cream-50 to-sage-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center p-8 md:p-16 rounded-card-lg bg-white shadow-card">
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-brown-900 mb-4">
              Ready to experience handmade?
            </h2>
            <p className="text-lg text-brown-600 mb-8">
              Browse our collection or dream up a custom creation. We can't wait to make something beautiful for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/shop" className="btn-primary text-lg px-8 py-4">
                Shop Collection
              </Link>
              <Link to="/custom-orders" className="btn-outline text-lg px-8 py-4">
                Custom Order
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';