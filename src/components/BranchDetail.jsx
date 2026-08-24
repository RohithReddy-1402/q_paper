import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";
import SemesterGrid from "./SemesterGrid";
import { BRANCHES } from "./syllabus-data/branches";
import coursesInfo from "./syllabus-data/courses-info.json";

export default function BranchDetail() {
  const { branchSlug } = useParams();
  const branch = BRANCHES[branchSlug];

  if (!branch) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="max-w-3xl mx-auto px-4 py-16 text-center flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Branch not found
          </h1>
          <p className="text-gray-600 mb-6">
            This branch doesn't exist in our directory yet.
          </p>
          <Link
            to="/nit-kkr/syllabus/branch"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse all branches
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const subjectCount = coursesInfo.filter((c) =>
    c.Branches?.includes(branch.code),
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>{branch.name} – Semesters, Subjects & Syllabus | NIT KKR</title>
        <meta
          name="description"
          content={`${branch.name} at NIT Kurukshetra: semester-wise scheme of examination and full syllabus for every subject. ${branch.description}`}
        />
      </Helmet>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/nit-kkr-pyqs" },
              { label: "Syllabus", href: "/nit-kkr/syllabus" },
              { label: "Branches", href: "/nit-kkr/syllabus/branch" },
              { label: branch.name },
            ]}
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {branch.name}
          </h1>
          <p className="mt-2 text-gray-600 max-w-3xl">{branch.description}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full">
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Select a Semester
          </h2>
          <SemesterGrid
            branchSlug={branchSlug}
            semestersAvailable={branch.semestersAvailable}
          />
          {branch.semestersAvailable.length === 0 && (
            <p className="mt-4 text-sm text-gray-500">
              No semester schemes are published for {branch.name} yet. Check
              back soon.
            </p>
          )}
        </section>

        <section className="bg-white rounded-lg shadow px-6 py-8 max-w-3xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            About {branch.name}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            {branch.description} {subjectCount} subjects from this branch are
            currently on the site, across{" "}
            {branch.semestersAvailable.length} published semester
            {branch.semestersAvailable.length === 1 ? "" : "s"}.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link to="/nit-kkr/syllabus/branch" className="text-blue-600 hover:underline">
              ← All branches
            </Link>
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
