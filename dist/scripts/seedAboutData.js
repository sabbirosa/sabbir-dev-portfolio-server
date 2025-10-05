"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAboutData = seedAboutData;
const Education_1 = require("../models/Education");
const Experience_1 = require("../models/Experience");
const Extracurricular_1 = require("../models/Extracurricular");
const logger_1 = require("../utils/logger");
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
        description: "Building scalable web applications and contributing to innovative software solutions.",
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
async function seedAboutData() {
    try {
        const educationCount = await Education_1.EducationModel.countDocuments();
        const experienceCount = await Experience_1.ExperienceModel.countDocuments();
        const extracurricularCount = await Extracurricular_1.ExtracurricularModel.countDocuments();
        if (educationCount === 0) {
            await Education_1.EducationModel.insertMany(educationData);
            logger_1.logger.info("✅ Education data seeded");
        }
        else {
            logger_1.logger.info("Education data already exists, skipping...");
        }
        if (experienceCount === 0) {
            await Experience_1.ExperienceModel.insertMany(experienceData);
            logger_1.logger.info("✅ Experience data seeded");
        }
        else {
            logger_1.logger.info("Experience data already exists, skipping...");
        }
        if (extracurricularCount === 0) {
            await Extracurricular_1.ExtracurricularModel.insertMany(extracurricularData);
            logger_1.logger.info("✅ Extracurricular data seeded");
        }
        else {
            logger_1.logger.info("Extracurricular data already exists, skipping...");
        }
    }
    catch (error) {
        logger_1.logger.error("Error seeding about data", { error });
        throw error;
    }
}
//# sourceMappingURL=seedAboutData.js.map