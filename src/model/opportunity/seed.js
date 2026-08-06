import mongoose from "mongoose";
import Opportunity from "./opportunity.model.js";

const sampleOpportunities = [
  {
    clientName: "Acme Retail Group",
    projectName: "E-commerce Platform Revamp",
    industry: "Retail",
    contactPerson: "Sarah Johnson",
    contactEmail: "sarah.johnson@acmeretail.com",
    contactPhone: "01012345671",
    generalNotes:
      "Client wants a full redesign of their online store with improved checkout flow and mobile support.",
    status: "new",
  },
  {
    clientName: "Northwind Logistics",
    projectName: "Fleet Tracking Dashboard",
    industry: "Logistics",
    contactPerson: "David Chen",
    contactEmail: "david.chen@northwindlogistics.com",
    contactPhone: "01012345672",
    generalNotes:
      "Real-time GPS tracking dashboard for a fleet of 200+ delivery vehicles.",
    status: "in_progress",
  },
  {
    clientName: "HealthFirst Clinics",
    projectName: "Patient Portal Modernization",
    industry: "Healthcare",
    contactPerson: "Dr. Emily Carter",
    contactEmail: "emily.carter@healthfirst.com",
    contactPhone: "01012345673",
    generalNotes:
      "Migrating a legacy patient portal to a modern, HIPAA-compliant web application.",
    status: "ready-for-analysis",
  },
  {
    clientName: "BrightBank Financial",
    projectName: "Mobile Banking App",
    industry: "Finance",
    contactPerson: "Michael Osei",
    contactEmail: "michael.osei@brightbank.com",
    contactPhone: "01012345674",
    generalNotes:
      "Cross-platform mobile banking app with biometric login and bill pay features.",
    status: "in_progress",
  },
  {
    clientName: "EduSpark Academy",
    projectName: "Online Learning Management System",
    industry: "Education",
    contactPerson: "Laura Martinez",
    contactEmail: "laura.martinez@eduspark.com",
    contactPhone: "01012345675",
    generalNotes:
      "LMS with live classes, assignment tracking, and integrated video conferencing.",
    status: "new",
  },
  {
    clientName: "GreenGrid Energy",
    projectName: "Smart Meter Analytics Platform",
    industry: "Energy",
    contactPerson: "Tom Becker",
    contactEmail: "tom.becker@greengrid.com",
    contactPhone: "01012345676",
    generalNotes:
      "Analytics platform to visualize smart meter data and detect usage anomalies.",
    status: "closed",
  },
  {
    clientName: "Voyage Hospitality",
    projectName: "Hotel Booking Engine",
    industry: "Hospitality",
    contactPerson: "Amara Okafor",
    contactEmail: "amara.okafor@voyagehotels.com",
    contactPhone: "01012345677",
    generalNotes:
      "Custom booking engine to replace third-party OTA dependency and reduce commission fees.",
    status: "ready-for-analysis",
  },
  {
    clientName: "Summit Manufacturing",
    projectName: "Inventory Management System",
    industry: "Manufacturing",
    contactPerson: "James Park",
    contactEmail: "james.park@summitmfg.com",
    contactPhone: "01012345678",
    generalNotes:
      "Barcode-driven inventory system integrated with existing ERP.",
    status: "new",
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/presales";

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);

    await Opportunity.deleteMany({});
    console.log("Cleared existing opportunities data.");

    const inserted = await Opportunity.insertMany(sampleOpportunities);
    console.log(`Successfully seeded ${inserted.length} opportunities!`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding opportunities:", error);
    process.exit(1);
  }
};

seedDatabase();
