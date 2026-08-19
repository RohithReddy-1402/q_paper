import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "./Header";
import Footer from "./Footer";
import { Code2, Server, Database, ShieldCheck, Mail, CreditCard, LineChart, Cloud } from "lucide-react";

const stack = [
  {
    icon: Code2,
    title: "Frontend",
    body:
      "The website is built with React 18 and Vite for fast builds and instant page loads, styled with Tailwind CSS 4 for a consistent, responsive layout across devices. Navigation between pages, such as Home, Question Papers, Syllabus and course pages, is handled with React Router. Framer Motion powers the small animations and transitions you see around the site.",
  },
  {
    icon: Server,
    title: "Backend",
    body:
      "The API that serves question papers, syllabus data and user accounts is a Node.js server built with Express, handling everything from search and downloads to authentication sessions.",
  },
  {
    icon: Database,
    title: "Database",
    body:
      "All structured data, including paper metadata, download counts and user accounts, is stored in MongoDB, which fits well with how flexible our question paper and syllabus records need to be as the collection grows.",
  },
  {
    icon: ShieldCheck,
    title: "Authentication",
    body:
      "You can sign in either with Google Sign-In or with a manually created email and password account, so you are not forced into any single login method to contribute papers or access your account.",
  },
  {
    icon: Mail,
    title: "Email",
    body:
      "Account emails, such as verification and password-reset messages for manual sign-ups, are delivered through Resend, a reliable transactional email service.",
  },
  {
    icon: Database,
    title: "File Storage",
    body:
      "Every question paper you download is stored using Cloudflare R2, an S3-compatible object storage service. This keeps downloads fast and reliable, and lets us keep adding papers each semester without slowing the site down.",
  },
  {
    icon: CreditCard,
    title: "Payments",
    body:
      "Donations to support hosting and running costs are processed through Razorpay, a widely used and trusted payment gateway in India. We never see or store your card, UPI, or banking details; that information stays with Razorpay.",
  },
  {
    icon: LineChart,
    title: "Analytics",
    body:
      "We use Vercel Analytics to understand, in an aggregated and privacy-friendly way, which pages and papers are most useful to students, so we know where to focus improvements next.",
  },
  {
    icon: Cloud,
    title: "Hosting & Deployment",
    body:
      "The frontend is deployed on Vercel, which gives us fast global delivery and automatic deployments whenever we ship an update, so new papers and fixes go live quickly.",
  },
];

const TechStack = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <Helmet>
        <title>Tech Stack | NIT KKR PYQs</title>
        <meta
          name="description"
          content="A look at the technology powering NIT KKR PYQs - React, Express, MongoDB, Cloudflare R2, Razorpay and Vercel - and why we chose each one."
        />
      </Helmet>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md my-8 text-gray-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">Tech Stack</h1>

        <p className="mb-8">
          A Student from a Coding Background, so we get asked fairly often what this site is actually
          built with. Here is a quick, honest breakdown of the tools and services
          that keep NIT KKR PYQs running, from the page you are looking at right
          now to the file that downloads when you click a paper.
        </p>

        <div className="space-y-6">
          {stack.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white/80 p-5 rounded-xl shadow-sm flex gap-4">
              <div className="w-11 h-11 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 mb-1">{title}</h2>
                <p className="text-sm text-gray-600">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mt-10 mb-2 text-indigo-600">Why This Stack</h2>
        <p className="mb-4">
          We picked tools that let a small, mostly student team ship features
          quickly without needing to manage a lot of infrastructure. React and
          Vite give us a fast, modern frontend, backed by a straightforward
          Express API and a MongoDB database that flexes easily as we add new
          branches and semesters. Cloudflare R2 keeps file storage costs low
          while serving downloads quickly, Resend handles account emails
          reliably, and Vercel lets us deploy new changes, like a freshly added
          semester of papers, in minutes.
        </p>
        <p className="mb-4">
          If you are a student who is curious about how this was built, or you
          would like to contribute to the project, feel free to reach out through
          our Contact page.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default TechStack;
