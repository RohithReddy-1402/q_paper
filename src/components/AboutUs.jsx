import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { BookOpen, Users, Target } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <Helmet>
        <title>About Us | NIT KKR PYQs</title>
        <meta
          name="description"
          content="Learn about NIT KKR PYQs (NexSphere), a student-built platform that helps NIT Kurukshetra students find previous year question papers and syllabus resources for free."
        />
      </Helmet>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md my-8 text-gray-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">About Us</h1>

        <p className="mb-6">
          NIT KKR PYQs, built under the name NexSphere, is a free, student-run
          platform created to solve a problem every engineering student at NIT
          Kurukshetra runs into sooner or later: finding previous year question
          papers scattered across WhatsApp groups, old Google Drive links, and
          seniors who graduated years ago. We built this site so that any student,
          from any branch and any semester, can search, browse and download past
          papers in one organized place, without paying for access or waiting on a
          reply from someone.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 my-8">
          <div className="bg-white/80 p-5 rounded-xl shadow-sm">
            <BookOpen className="w-8 h-8 text-indigo-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">What We Offer</h3>
            <p className="text-sm text-gray-600">
              Question papers organized by branch, semester and year, alongside
              detailed syllabus pages for individual courses.
            </p>
          </div>
          <div className="bg-white/80 p-5 rounded-xl shadow-sm">
            <Users className="w-8 h-8 text-indigo-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Built By Students</h3>
            <p className="text-sm text-gray-600">
              Maintained by a small team of NIT KKR students who wanted a better
              way to prepare for exams, and kept improving it after graduating too.
            </p>
          </div>
          <div className="bg-white/80 p-5 rounded-xl shadow-sm">
            <Target className="w-8 h-8 text-indigo-600 mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Our Mission</h3>
            <p className="text-sm text-gray-600">
              Make exam preparation fairer by giving every student equal, free
              access to the same past papers and syllabus material.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-2 text-indigo-600">How It Started</h2>
        <p className="mb-4">
          The idea for this platform came from a very ordinary frustration: right
          before exams, students would scramble across multiple WhatsApp groups
          trying to find a Mid-1 or end-semester paper for a subject, often getting
          incomplete sets or blurry scans. We started collecting and organizing
          papers branch-wise and semester-wise, and what began as a small shared
          folder eventually grew into this website, with a proper search, filters
          by exam type and year, and a syllabus section that mirrors the official
          course structure.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2 text-indigo-600">What Makes This Different</h2>
        <p className="mb-4">
          Unlike scattered drive links, every paper here is tagged with its
          subject, subject code, semester, year and exam type, so you can search
          for exactly what you need in seconds. The syllabus pages are written out
          course by course, unit by unit, so you can cross-check the exact topics,
          credit structure and reference books for a subject before an exam. We
          also let students contribute papers they have, so the collection keeps
          growing with each passing semester instead of going stale.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2 text-indigo-600">Looking Ahead</h2>
        <p className="mb-4">
          We are gradually expanding coverage to more branches, adding more
          semesters of syllabus data, and improving how quickly a contributed
          paper gets verified and published. If you would like to contribute
          papers, report an issue, or just say hello, we would love to hear from
          you on our{" "}
          <Link to="/nit-kkr/contact" className="text-indigo-600 underline">
            Contact page
          </Link>.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
