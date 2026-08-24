
export const BRANCHES = {
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
