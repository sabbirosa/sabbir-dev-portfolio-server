"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const projectSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
    },
    image: {
        type: String,
        required: [true, "Image URL is required"],
    },
    liveLink: {
        type: String,
        required: [true, "Live link is required"],
    },
    codeLink: {
        type: String,
        default: null,
    },
    year: {
        type: String,
        required: [true, "Year is required"],
    },
    techStack: {
        type: [String],
        default: [],
        required: [true, "Tech stack is required"],
    },
    challenges: {
        type: [String],
        default: [],
    },
    improvements: {
        type: [String],
        default: [],
    },
    featured: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
projectSchema.index({ title: "text", description: "text" });
projectSchema.index({ featured: 1, order: 1 });
projectSchema.index({ year: -1 });
exports.ProjectModel = mongoose_1.default.model("Project", projectSchema);
//# sourceMappingURL=Project.js.map