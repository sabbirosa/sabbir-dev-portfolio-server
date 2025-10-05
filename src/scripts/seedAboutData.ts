import { EducationModel } from "../models/Education";
import { ExperienceModel } from "../models/Experience";
import { ExtracurricularModel } from "../models/Extracurricular";
import { logger } from "../utils/logger";

const educationData = [
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "BRAC University, Dhaka",
    year: "Oct 2021 – Sep 2025 (Expected)",
    order: 1,
  },
  {
    degree: "Higher Secondary Certificate (Science)",
    institution: "Uttara High School & College, Dhaka",
    year: "Jul 2018 – Mar 2020",
    order: 2,
  },
  {
    degree: "Secondary School Certificate (Science)",
    institution: "Uttara High School & College, Dhaka",
    year: "Jan 2016 – Feb 2018",
    order: 3,
  },
];

const experienceData = [
  {
    position: "Software Engineer",
    company: "Graphland",
    year: "Sep 2025 – Present",
    description:
      "Building scalable web applications and contributing to innovative software solutions.",
    order: 1,
  },
];

const extracurricularData = [
  {
    role: "General Secretary (Acting)",
    organization: "BRAC University Computer Club",
    year: "May 2024 – Dec 2024",
    order: 1,
  },
  {
    role: "Director, Research & Development",
    organization: "BRAC University Computer Club",
    year: "Mar 2024 – Dec 2024",
    order: 2,
  },
  {
    role: "Coordinator & Judge, IntraHacktive 1.0",
    organization: "BUCC Competitive Programming Contest",
    year: "Nov 2024",
    order: 3,
  },
  {
    role: "CPC Instructor",
    organization: "BUCC Study Corner",
    year: "May 2023 – Dec 2023",
    order: 4,
  },
];

export async function seedAboutData() {
  try {
    // Check if data already exists
    const educationCount = await EducationModel.countDocuments();
    const experienceCount = await ExperienceModel.countDocuments();
    const extracurricularCount = await ExtracurricularModel.countDocuments();

    if (educationCount === 0) {
      await EducationModel.insertMany(educationData);
      logger.info("✅ Education data seeded");
    } else {
      logger.info("Education data already exists, skipping...");
    }

    if (experienceCount === 0) {
      await ExperienceModel.insertMany(experienceData);
      logger.info("✅ Experience data seeded");
    } else {
      logger.info("Experience data already exists, skipping...");
    }

    if (extracurricularCount === 0) {
      await ExtracurricularModel.insertMany(extracurricularData);
      logger.info("✅ Extracurricular data seeded");
    } else {
      logger.info("Extracurricular data already exists, skipping...");
    }
  } catch (error) {
    logger.error("Error seeding about data", { error });
    throw error;
  }
}
