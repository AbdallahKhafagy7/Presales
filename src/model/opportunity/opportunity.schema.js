import { Schema } from "mongoose";

export const opporunitySchema = new Schema({
    clientName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30,
        trim: true,
    },
    projectName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30,
        trim: true,
    },
    industry: {
        type: String,
    },
    contactPerson: {
        type: String,
        required: true,
        minLength: 2,
        trim: true,
    },
    contactEmail: {
        type: String,
        required: true,
        minLength: 2,
        trim: true,
        match: [/^\\S+@\\S+\\.\\S+$/, "Please provide a valid email address"],

    },
    contactPhone: {
        type: String,
        match: [/^\\d{11}$/, "Phone number must be exactly 11 digits"],
    },
    generalNotes: {
        type: String,
    },
    status: {
        type: String,
        default: "new",
        enum: Object.values(["new", "in_progress", "ready-for-analysis", "closed"])
    }
},
    {
        timestamps: true
    }) 