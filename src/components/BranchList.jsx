import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";
import { BRANCHES } from "./syllabus-data/branches";
import coursesInfo from "./syllabus-data/courses-info.json";

function subjectCountFor(code) {
  return coursesInfo.filter((c) => c.Branches?.includes(code)).length;
}

export default function BranchList() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Branches – Syllabus & Semester Schemes | NIT KKR</title>
        <meta
          name="description"
          content="Browse NIT Kurukshetra B.Tech branches to find semester-wise subjects, credit schemes and full syllabus for each course."
        />
      </Helmet>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/nit-kkr-pyqs" },
              { label: "Syllabus", href: "/nit-kkr/syllabus" },
              { label: "Branches" },
            ]}
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Branches
          </h1>
          <p className="mt-2 text-gray-600 max-w-3xl">
            Pick a branch to see its semester-wise scheme of examination and
            every subject's full syllabus.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(BRANCHES).map(([slug, b]) => (
            <Link
              key={slug}
              to={`/nit-kkr/syllabus/branch/${slug}`}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 flex flex-col"
            >
              <h2 className="text-lg font-semibold text-gray-900">{b.name}</h2>
              <p className="mt-2 text-sm text-gray-600 flex-1">
                {b.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {b.semestersAvailable.length} of 8 semesters published ·{" "}
                  {subjectCountFor(b.code)} subjects
                </span>
                <span className="text-blue-600 font-medium">View →</span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-10 bg-white rounded-lg shadow px-6 py-8 max-w-3xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            More on Syllabus & Question Papers
          </h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link to="/nit-kkr/syllabus" className="text-blue-600 hover:underline">
              Search all syllabus
            </Link>
            <Link
              to="/nit-kkr/question-papers"
              className="text-blue-600 hover:underline"
            >
              Browse question papers
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
