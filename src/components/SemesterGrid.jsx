import { Link } from "react-router-dom";

export default function SemesterGrid({ branchSlug, semestersAvailable, activeSemester }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => {
        const available = semestersAvailable.includes(n);
        return available ? (
          <Link
            key={n}
            to={`/nit-kkr/syllabus/branch/${branchSlug}/semester/${n}`}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              n === activeSemester
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50"
            }`}
          >
            Semester {n}
          </Link>
        ) : (
          <span
            key={n}
            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
            title="Not published yet"
          >
            Semester {n}
          </span>
        );
      })}
    </div>
  );
}
