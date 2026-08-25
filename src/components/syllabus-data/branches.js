
export const BRANCHES = {
  "computer-science-engineering": {
    code: "CS",
    name: "Computer Science and Engineering",
    description:
      "Covers programming, data structures, algorithms, computer organization, operating systems, computer networks, databases, AI/ML, software engineering, and electives spanning security, data science, cloud, distributed systems and more.",
    semestersAvailable: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  "robotics-automation": {
    code: "RA",
    name: "Robotics & Automation",
    description:
      "Covers robotics, automation, control systems, sensors and actuators, microprocessors and embedded systems, mechanics of materials, and electives spanning MEMS, IoT, data acquisition and data structures.",
    semestersAvailable: [4, 5],
  },
};

export function branchSlugFromCode(code) {
  return Object.keys(BRANCHES).find((slug) => BRANCHES[slug].code === code);
}
