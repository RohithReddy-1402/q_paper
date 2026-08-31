
export const BRANCHES = {
  "cse": {
    code: "CS",
    name: "Computer Science and Engineering",
    description:
      "Covers programming, data structures, algorithms, computer organization, operating systems, computer networks, databases, AI/ML, software engineering, and electives spanning security, data science, cloud, distributed systems and more.",
    semestersAvailable: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  "ra": {
    code: "RA",
    name: "Robotics & Automation",
    description:
      "Covers robotics, automation, control systems, sensors and actuators, microprocessors and embedded systems, mechanics of materials, and electives spanning MEMS, IoT, data acquisition and data structures.",
    semestersAvailable: [1, 2, 4, 5],
  },
  "aiml": {
    code: "AIML",
    name: "Artificial Intelligence & Machine Learning",
    description:
      "Covers programming, data structures, algorithms, databases, knowledge representation, machine learning, neural networks, deep learning, computer vision, generative AI and large language models, with electives spanning security, NLP, HPC, IoT and business analytics.",
    semestersAvailable: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  "ee": {
    code: "EE",
    name: "Electrical Engineering",
    description:
      "Covers electric circuits, AC and DC machines, transformers, power generation, transmission and distribution, power system analysis, power electronics, control systems, signals and systems, network synthesis and filters, linear system theory, measurement and instrumentation, and machine learning and data analytics.",
    semestersAvailable: [3, 4, 5, 6, 7, 8],
  },
};

export function branchSlugFromCode(code) {
  return Object.keys(BRANCHES).find((slug) => BRANCHES[slug].code === code);
}
