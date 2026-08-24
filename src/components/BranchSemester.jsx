import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";
import SemesterGrid from "./SemesterGrid";
import { BRANCHES } from "./syllabus-data/branches";
import coursesInfo from "./syllabus-data/courses-info.json";

const courseByCode = new Map(coursesInfo.map((c) => [c["Course Code"], c]));

function LtpcCells({ ltpc }) {
  return (
    <>
      <td className="px-4 py-3 text-center">{ltpc[0]}</td>
      <td className="px-4 py-3 text-center">{ltpc[1]}</td>
      <td className="px-4 py-3 text-center">{ltpc[2]}</td>
      <td className="px-4 py-3 text-center">{ltpc[3]}</td>
    </>
  );
}

export default function BranchSemester() {
  const { branchSlug, semNumber } = useParams();
  const [scheme, setScheme] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const branch = BRANCHES[branchSlug];

  useEffect(() => {
    setScheme(null);
    setNotFound(false);
    if (!branch) {
      setNotFound(true);
      return;
    }
    async function load() {
      try {
        const module = await import(
          `./syllabus-data/semester-schemes/${branch.code.toLowerCase()}-${semNumber}.json`
        );
        setScheme(module.default);
      } catch {
        setNotFound(true);
      }
    }
    load();
  }, [branchSlug, semNumber, branch]);

  if (!branch || notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="max-w-3xl mx-auto px-4 py-16 text-center flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {branch
              ? `Semester ${semNumber} isn't published yet`
              : "Branch not found"}
          </h1>
          <p className="text-gray-600 mb-6">
            {branch
              ? `We haven't added the ${branch.name} semester ${semNumber} scheme and syllabus yet. It'll appear here once it's added.`
              : "This branch doesn't exist in our directory yet."}
          </p>
          <Link
            to="/nit-kkr/syllabus"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse all syllabus
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const coreRows = scheme.rows.filter((r) => r.type === "core");
  const electiveRows = scheme.rows.filter((r) => r.type === "elective");
  const openElectiveCount = scheme.rows.filter((r) => r.type === "openElective").length;

  const coreSubjectCount = coreRows.filter((r) => courseByCode.get(r.code)).length;
  const subjectCount =
    coreSubjectCount + electiveRows.reduce((sum, r) => sum + r.options.length, 0);

  const electiveDescription = [
    electiveRows.length > 0
      ? `${electiveRows.length} program-elective group${electiveRows.length > 1 ? "s" : ""} (choose one subject from each)`
      : null,
    openElectiveCount > 0
      ? `${openElectiveCount} open elective${openElectiveCount > 1 ? "s" : ""}`
      : null,
  ].filter(Boolean);

  const title = `${branch.name} Semester ${scheme.semester} – Subjects & Syllabus | NIT KKR`;
  const description = `Subjects, credit scheme (L-T-P-C) and full syllabus for NIT Kurukshetra B.Tech ${branch.name} Semester ${scheme.semester}: ${coreRows
    .map((r) => courseByCode.get(r.code)?.["Course Title"])
    .filter(Boolean)
    .join(", ")}.`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/nit-kkr-pyqs" },
              { label: "Syllabus", href: "/nit-kkr/syllabus" },
              { label: "Branches", href: "/nit-kkr/syllabus/branch" },
              { label: branch.name, href: `/nit-kkr/syllabus/branch/${branchSlug}` },
              { label: `Semester ${scheme.semester}` },
            ]}
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {scheme.title}
          </h1>
          <p className="mt-2 text-gray-600 max-w-3xl">
            {subjectCount} subjects
            {electiveDescription.length > 0
              ? ` across core courses, ${electiveDescription.join(", and ")}`
              : " across core courses"}
            , totalling {scheme.totalCredits} credits. Every subject below
            links to its full unit-wise syllabus, textbooks and course
            outcomes.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full">
        {/* Scheme of examination table */}
        <section className="mb-10 overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600">
                <th className="px-4 py-3 font-semibold">Code</th>
                <th className="px-4 py-3 font-semibold">Course</th>
                <th className="px-4 py-3 font-semibold text-center">L</th>
                <th className="px-4 py-3 font-semibold text-center">T</th>
                <th className="px-4 py-3 font-semibold text-center">P</th>
                <th className="px-4 py-3 font-semibold text-center">Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {scheme.rows.map((row, i) => {
                if (row.type === "core") {
                  const course = courseByCode.get(row.code);
                  return (
                    <tr key={i} className="hover:bg-blue-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        {row.code}
                      </td>
                      <td className="px-4 py-3">
                        {course ? (
                          <Link
                            to={`/nit-kkr/syllabus/${course.route}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {course["Course Title"]}
                          </Link>
                        ) : (
                          row.label || row.code
                        )}
                      </td>
                      <LtpcCells ltpc={row.ltpc} />
                    </tr>
                  );
                }
                if (row.type === "elective") {
                  return (
                    <tr key={i} className="hover:bg-blue-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        —
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{row.label}</span>
                        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs">
                          {row.options.map((code) => {
                            const c = courseByCode.get(code);
                            return c ? (
                              <Link
                                key={code}
                                to={`/nit-kkr/syllabus/${c.route}`}
                                className="text-blue-600 hover:underline"
                              >
                                {c["Course Title"]}
                              </Link>
                            ) : null;
                          })}
                        </div>
                      </td>
                      <LtpcCells ltpc={row.ltpc} />
                    </tr>
                  );
                }
                if (row.type === "openElective") {
                  return (
                    <tr key={i} className="text-gray-500">
                      <td className="px-4 py-3">—</td>
                      <td className="px-4 py-3 italic">{row.label}</td>
                      <LtpcCells ltpc={row.ltpc} />
                    </tr>
                  );
                }
                // coCurricular
                return (
                  <tr key={i} className="text-gray-500">
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">
                      {row.label}
                      <div className="text-xs italic">{row.note}</div>
                    </td>
                    <LtpcCells ltpc={row.ltpc} />
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-3" colSpan={5}>
                  Total Credits
                </td>
                <td className="px-4 py-3 text-center">{scheme.totalCredits}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* Semester navigation */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            All Semesters — {branch.name}
          </h2>
          <SemesterGrid
            branchSlug={branchSlug}
            semestersAvailable={branch.semestersAvailable}
            activeSemester={scheme.semester}
          />
        </section>

        <section className="bg-white rounded-lg shadow px-6 py-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            About This Semester
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Semester {scheme.semester} of the {branch.name} program carries{" "}
            {scheme.totalCredits} credits across {coreSubjectCount} core
            courses{electiveDescription.length > 0 ? `, ${electiveDescription.join(", and ")}` : ""}.
            {" "}Click any subject above to view its full unit-wise syllabus,
            prerequisites, course outcomes and reference books.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link
              to={`/nit-kkr/syllabus/branch/${branchSlug}`}
              className="text-blue-600 hover:underline"
            >
              ← {branch.name} overview
            </Link>
            <Link to="/nit-kkr/syllabus/branch" className="text-blue-600 hover:underline">
              All branches
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
