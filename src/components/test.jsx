import React from "react";
import { Download } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
function SectionHeading({ children }) {
  return (
    <h2 className="mt-8 text-[24px] font-bold uppercase tracking-wide text-black">
      {children}
    </h2>
  );
}

export default function SyllabusPage() {
  const { code } = useParams();
  const [d, setD] = useState(null);
  // console.log("code", code);
  useEffect(() => {
    // console.log("useEffect called with code:", code);

    async function loadCourse() {
      try {
        const module = await import(`./syllabus-data/course/${code}.json`);
        // console.log("Loaded course data:", module.default);
        setD(module.default);
      } catch (err) {
        console.error(err);
      }
    }

    // console.log(1);
    loadCourse();
    // console.log(2);
  }, [code]);
  // console.log("After useEffect");

  const handleDownload = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>{d?.["Course Code"]||""} Syllabus</title>
        <meta name="description" content={`Syllabus for ${d?.["Course Code"]} - ${d?.["Course Title"]}`} />
        <meta
          name="keywords"
          content={`NIT Kurukshetra syllabus, NIT KKR syllabus, NIT Kurukshetra syllabus PDF, NIT Kurukshetra CSE syllabus, NIT Kurukshetra IT syllabus, NIT Kurukshetra Robotics syllabus, NIT Kurukshetra Mathematics and Computing syllabus, semester wise syllabus ${d?.["Course Code"]} , ${d?.["Course Title"]} Syllabus ,NIT KKR `}
        />
      </Helmet>
      <div className="min-h-screen bg-white font-serif text-black"> 
        <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

        <div className="no-print flex items-center justify-end border-b border-black/20 px-6 py-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 border border-black px-4 py-2 text-sm font-medium text-black hover:bg-black hover:text-white"
          >
            <Download size={15} />
            Download PDF
          </button>
        </div>

        {d && (
          <main className="mx-auto max-w-3xl px-6 py-10 text-[20px] leading-relaxed">
            <table className="w-full border-collapse border border-black text-[18px]">
              <tbody>
                <tr>
                  <td className="w-1/2 border border-black px-3 py-2 font-semibold">
                    Course Code
                  </td>
                  <td className="border border-black px-3 py-2">
                    {d["Course Code"]}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-3 py-2 font-semibold">
                    Course Title
                  </td>
                  <td className="border border-black px-3 py-2">
                    {d["Course Title"]}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-3 py-2 font-semibold">
                    Number of Credits
                  </td>
                  <td className="border border-black px-3 py-2">
                    {d["credits"]}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-3 py-2 font-semibold">
                    Prerequisites (Course code)
                  </td>
                  <td className="border border-black px-3 text-4xl py-2">
                    {d["Prerequisites"] == null ? "-" : d["Prerequisites"]}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black px-3 py-2 font-semibold">
                    Course Type
                  </td>
                  <td className="border border-black px-3 py-2">
                    {d["Course Type"]}
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="mt-3 w-full border-collapse border border-black text-center text-[18px]">
              <thead>
                <tr>
                  <th className="border border-black px-3 py-2 font-semibold">
                    L
                  </th>
                  <th className="border border-black px-3 py-2 font-semibold">
                    T
                  </th>
                  <th className="border border-black px-3 py-2 font-semibold">
                    P
                  </th>
                  <th className="border border-black px-3 py-2 font-semibold">
                    Credits
                  </th>
                  <th className="border border-black px-3 py-2 font-semibold">
                    Total contact hours
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-3 py-2">
                    {d["ltpc"][0]}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {d["ltpc"][1]}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {d["ltpc"][2]}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {d["ltpc"][3]}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {d["contactHours"]}
                  </td>
                </tr>
              </tbody>
            </table>
            <SectionHeading>Brief Description about the course</SectionHeading>
            <p className="mt-2 text-justify">{d["description"]}</p>

            {/* Units */}
            {d["syllabus"]?.map((u) => (
              <div key={u.id}>
                <h2 className="mt-8 text-[15px] font-bold uppercase tracking-wide text-black">
                  Unit - {u.id}
                </h2>
                <h3 className="mt-1 text-[22px] font-bold">{u.title}</h3>
                <p className="mt-2 text-justify">
                  {u.body}{" "}
                  <span className="whitespace-nowrap  ">({u.hours} hrs)</span>
                </p>

                {u?.subsection && (
                  <>
                    <h3 className="mt-4 text-[22px] font-bold">
                      {u.subsection.title}
                    </h3>
                    <p className="mt-2 text-justify">
                      {u.subsection.body}{" "}
                      <span className="whitespace-nowrap">
                        ({u.subsection.hours} hrs)
                      </span>
                    </p>
                  </>
                )}
              </div>
            ))}
            {d["experiments"]?.length > 0 && (
              <>
                <SectionHeading>List of Experiments</SectionHeading>

                <ol className="mt-2 list-decimal space-y-2 pl-6">
                  {d["experiments"].map((experiment, i) => (
                    <li key={i}>{experiment}</li>
                  ))}
                </ol>
              </>
            )}
            <SectionHeading>Course Outcomes</SectionHeading>
            <p className="mt-2">
              Upon successful completion of the course, students will:
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-6">
              {d["outcomes"]?.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ol>

            {d["textbooks"]?.length > 0 && (
              <>
                <SectionHeading>Text Books</SectionHeading>
                <ol className="mt-2 list-decimal space-y-1 pl-6">
                  {d["textbooks"].map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ol>
              </>
            )}

            {d["referenceBooks"]?.length > 0 && (
              <>
                <SectionHeading>Reference Books</SectionHeading>
                <ol className="mt-2 list-decimal space-y-1 pl-6">
                  {d["referenceBooks"].map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ol>
              </>
            )}
          </main>
        )}
      </div>
    </>
  );
}
