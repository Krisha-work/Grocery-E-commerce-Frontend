'use client';

import { FaLeaf, FaTruck, FaStoreAlt, FaHandsHelping } from 'react-icons/fa';
import { AiOutlineEye } from 'react-icons/ai';
import Image from 'next/image';
import { ReactNode } from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative bg-green-700 text-white py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About FreshCart</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Delivering farm-fresh groceries straight to your doorstep since 2015
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform skew-y-1 origin-top-left"></div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        {/* Our Story */}
        <section className="mb-16 md:mb-24">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
            <div className="lg:w-1/2">
              <Image
                src="/about-farmers.jpg"
                alt="Local farmers"
                width={600}
                height={400}
                className="rounded-lg shadow-lg object-cover h-full"
                priority
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Our Farm-to-Table Journey</h2>
              <p className="text-gray-600 mb-4">
                FreshCart began with a simple idea: connect local farmers directly with urban households. 
                What started as a small delivery service in one neighborhood has grown into a trusted 
                online grocery platform serving thousands of families.
              </p>
              <p className="text-gray-600 mb-6">
                We work directly with over 200 local farms and producers to bring you the freshest 
                seasonal produce, dairy, meats, and pantry staples - all while supporting sustainable 
                agriculture in our community.
              </p>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-green-700 font-medium">
                  "We believe in food that's fresh, honest, and good for both people and the planet."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-gray-800">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <ValueCard 
              icon={<FaLeaf className="text-3xl text-green-600" />}
              title="Farm Fresh"
              description="Direct from local farms within 24 hours of harvest"
            />
            <ValueCard 
              icon={<FaTruck className="text-3xl text-green-600" />}
              title="Fast Delivery"
              description="Same-day delivery on orders before noon"
            />
            <ValueCard 
              icon={<AiOutlineEye className="text-3xl text-green-600" />}
              title="Sustainable"
              description="Eco-friendly packaging and zero food waste policy"
            />
            <ValueCard 
              icon={<FaHandsHelping className="text-3xl text-green-600" />}
              title="Community"
              description="Supporting local farmers and food producers"
            />
          </div>
        </section>

        {/* Our Team */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-gray-800">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <TeamMemberCard
              name="Sarah Johnson"
              role="Founder & CEO"
              image="/team-sarah.jpg"
              bio="Former farmer turned tech entrepreneur"
            />
            <TeamMemberCard
              name="Michael Chen"
              role="Head of Operations"
              image="/team-michael.jpg"
              bio="Supply chain expert with 15 years experience"
            />
            <TeamMemberCard
              name="Priya Patel"
              role="Head Chef & Product Curator"
              image="/team-priya.jpg"
              bio="Michelin-starred chef passionate about local ingredients"
            />
            <TeamMemberCard
              name="David Wilson"
              role="Customer Experience"
              image="/team-david.jpg"
              bio="Ensuring every customer gets the FreshCart difference"
            />
          </div>
        </section>

        {/* Sustainability Promise */}
        <section className="bg-green-50 rounded-xl p-8 md:p-12 mb-16">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Our Sustainability Promise</h2>
              <p className="text-gray-600 mb-4">
                At FreshCart, we're committed to reducing our environmental impact through:
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-6">
                <li>100% compostable or reusable packaging</li>
                <li>Electric delivery vehicles in urban areas</li>
                <li>Zero food waste through our partnership with food banks</li>
                <li>Carbon offset programs for all deliveries</li>
              </ul>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition">
                Learn About Our Green Initiatives
              </button>
            </div>
            <div className="lg:w-1/3">
              <Image
                src="/sustainability.jpg"
                alt="Sustainability efforts"
                width={400}
                height={300}
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Type definitions for ValueCard props
interface ValueCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

// Component for Value Cards
function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

// Type definitions for TeamMemberCard props
interface TeamMemberCardProps {
  name: string;
  role: string;
  image: string;
  bio: string;
}

// Component for Team Members
function TeamMemberCard({ name, role, image, bio }: TeamMemberCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="h-48 md:h-56 relative">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <p className="text-green-600 font-medium mb-2">{role}</p>
        <p className="text-gray-600 text-sm">{bio}</p>
      </div>
    </div>
  );
}