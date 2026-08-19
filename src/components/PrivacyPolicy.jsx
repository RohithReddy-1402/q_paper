import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <Helmet>
        <title>Privacy Policy | NIT KKR PYQs</title>
        <meta
          name="description"
          content="Privacy Policy for NIT KKR PYQs (NexSphere) - learn what information we collect, how we use it, and how we handle cookies, Google sign-in, analytics and payments on this site."
        />
      </Helmet>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md my-8 text-gray-800 leading-relaxed">
        <h1 className="text-3xl font-bold mb-2 text-indigo-700">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: August 19, 2026</p>

        <p className="mb-6">
          NIT KKR PYQs (also referred to as "NexSphere", "we", "us" or "our") is a
          student-run platform that helps students of NIT Kurukshetra find previous
          year question papers, syllabus information and related academic resources.
          This Privacy Policy explains what information we collect when you use
          our website, how we use it, and the choices you have. By using this
          website you agree to the collection and use of information described here.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2 text-indigo-600">1. Information We Collect</h2>
        <p className="mb-2">We collect a limited amount of information, only what is needed to run the service:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>
            <strong>Account information:</strong> if you sign in with Google or create an
            account, we receive your name, email address and profile picture from the
            authentication provider so we can identify your account.
          </li>
          <li>
            <strong>Contributed content:</strong> if you upload a question paper through
            our Contribute feature, we store the file along with the subject, semester
            and year details you provide, so it can be reviewed and shared with other
            students.
          </li>
          <li>
            <strong>Contact and support requests:</strong> if you reach out through our
            Contact page, we store the message and any contact details you choose to
            share so we can respond.
          </li>
          <li>
            <strong>Usage data:</strong> we automatically collect basic, non-identifying
            usage data such as pages visited, download counts and approximate location
            (via IP) through analytics tools, to understand how the site is used and to
            improve it.
          </li>
          <li>
            <strong>Donation information:</strong> if you choose to donate, payments are
            processed directly by Razorpay. We do not receive or store your card,
            UPI or bank details on our servers.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2 text-indigo-600">2. How We Use Information</h2>
        <p className="mb-4">
          We use the information above to operate and maintain the website, to let you
          sign in and contribute papers, to review and publish contributed content, to
          respond to support requests, to keep basic usage statistics, and to keep the
          platform secure and free of abuse. We do not sell your personal information
          to third parties.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2 text-indigo-600">3. Cookies and Third-Party Services</h2>
        <p className="mb-2">
          This site uses cookies and similar technologies from the following
          third-party services, each governed by its own privacy policy:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>
            <strong>Google Sign-In:</strong> used to let you log in securely using your
            Google account.
          </li>
          <li>
            <strong>Google AdSense:</strong> we use, or may use, Google AdSense to show
            ads on this site. Google and its partners may use cookies to serve ads
            based on your prior visits to this or other websites. You can opt out of
            personalized advertising by visiting{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noreferrer noopener"
              className="text-indigo-600 underline"
            >
              Google Ads Settings
            </a>.
          </li>
          <li>
            <strong>Vercel Analytics:</strong> used to measure page visits in an
            aggregated, privacy-friendly way.
          </li>
          <li>
            <strong>Razorpay:</strong> used to securely process donation payments.
          </li>
          <li>
            <strong>Cloudflare:</strong> used to store and deliver question paper files.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2 text-indigo-600">4. Data Sharing</h2>
        <p className="mb-4">
          We do not share your personal information with third parties except with the
          service providers listed above (strictly to operate the site), or when
          required to comply with the law, protect our rights, or prevent fraud or
          abuse of the platform.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2 text-indigo-600">5. Data Security</h2>
        <p className="mb-4">
          We take reasonable technical measures, such as encrypted connections (HTTPS)
          and access-controlled storage, to protect the information we hold. However,
          no method of transmission or storage over the internet is completely secure,
          and we cannot guarantee absolute security.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2 text-indigo-600">6. Your Choices</h2>
        <p className="mb-4">
          You can use most of this website, including browsing and downloading
          question papers and syllabus content, without creating an account. If you
          have an account and would like your data corrected or deleted, or if you
          would like a contributed paper removed, you can reach out to us through the{" "}
          <Link to="/nit-kkr/contact" className="text-indigo-600 underline">
            Contact page
          </Link>{" "}
          and we will act on your request.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2 text-indigo-600">7. Children's Privacy</h2>
        <p className="mb-4">
          This website is intended for college students and is not directed at
          children under 13. We do not knowingly collect personal information from
          children under 13.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2 text-indigo-600">8. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time to reflect changes in
          our practices or for legal reasons. Any changes will be posted on this page
          with an updated "Last updated" date.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2 text-indigo-600">9. Contact Us</h2>
        <p className="mb-2">
          If you have any questions about this Privacy Policy, please get in touch
          through our{" "}
          <Link to="/nit-kkr/contact" className="text-indigo-600 underline">
            Contact page
          </Link>.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
