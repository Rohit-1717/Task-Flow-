import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./models/taskModel.js";
import User from "./models/userModel.js";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/taskflow";

// Sample task data
const taskTitles = [
  "Complete project documentation",
  "Prepare meeting agenda",
  "Review pull requests",
  "Update team dashboard",
  "Fix critical bug in authentication",
  "Design new user interface",
  "Write unit tests for API",
  "Optimize database queries",
  "Deploy to production",
  "Create user onboarding guide",
  "Research new technologies",
  "Update dependencies",
  "Code review for team members",
  "Setup monitoring alerts",
  "Backup database",
  "Performance testing",
  "Security audit",
  "Client presentation preparation",
  "Team training session",
  "Budget planning for next quarter",
  "Hiring interviews",
  "Market research",
  "Competitor analysis",
  "Social media campaign",
  "Email newsletter",
  "Blog post writing",
  "SEO optimization",
  "Mobile app testing",
  "API documentation",
  "Customer support tickets",
  "Bug triaging",
  "Feature planning",
  "Sprint planning",
  "Retrospective meeting",
  "Stakeholder update",
  "Product demo",
  "User feedback analysis",
  "A/B testing setup",
  "Analytics review",
  "Server maintenance",
  "Database migration",
  "Code refactoring",
  "Technical debt reduction",
  "New feature development",
  "Integration testing",
  "Load testing",
  "Security patches",
  "Compliance check",
  "Documentation update",
  "Team building activity",
];

const taskDescriptions = [
  "Need to complete this task by the deadline to ensure project success.",
  "This is a high priority task that requires immediate attention.",
  "Regular maintenance task to keep the system running smoothly.",
  "Important for the upcoming release and customer satisfaction.",
  "Collaborate with team members to achieve the best results.",
  "Research and implement best practices for this functionality.",
  "Ensure all edge cases are covered and properly handled.",
  "Coordinate with other departments for seamless integration.",
  "Document the process for future reference and team knowledge.",
  "Test thoroughly before marking as completed.",
  "Follow up with stakeholders for feedback and approval.",
  "Review and incorporate team suggestions for improvement.",
  "Monitor performance metrics after implementation.",
  "Prepare reports and analysis for management review.",
  "Train team members on new processes and tools.",
];

const priorities = ["low", "medium", "high"];
const statuses = ["pending", "in-progress", "completed"];

// Function to generate random date within a range
function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Function to generate random tasks
function generateTasks(userId, count = 60) {
  const tasks = [];
  const startDate = new Date(2024, 0, 1); // Jan 1, 2024
  const endDate = new Date(2025, 11, 31); // Dec 31, 2025

  for (let i = 0; i < count; i++) {
    const randomTitle =
      taskTitles[Math.floor(Math.random() * taskTitles.length)];
    const randomDescription =
      taskDescriptions[Math.floor(Math.random() * taskDescriptions.length)];
    const randomPriority =
      priorities[Math.floor(Math.random() * priorities.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomDueDate = randomDate(startDate, endDate);
    const randomCreatedAt = randomDate(new Date(2024, 0, 1), new Date());

    tasks.push({
      title: `${randomTitle} #${i + 1}`,
      description: `${randomDescription} This is task number ${i + 1}.`,
      dueDate: randomDueDate,
      priority: randomPriority,
      status: randomStatus,
      createdBy: userId,
      createdAt: randomCreatedAt,
      updatedAt: randomCreatedAt,
    });
  }

  return tasks;
}

// Main seed function
async function seedDatabase() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get your user ID (replace with your actual user ID)
    const userId = new mongoose.Types.ObjectId("68f8930d4216e3ac1181564c");

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      console.error("❌ User not found. Please check the user ID.");
      process.exit(1);
    }
    console.log(`✅ Found user: ${user.name} (${user.email})`);

    // Clear existing tasks for this user
    console.log("🗑️ Clearing existing tasks...");
    await Task.deleteMany({ createdBy: userId });
    console.log("✅ Existing tasks cleared");

    // Generate new tasks
    console.log("📝 Generating new tasks...");
    const tasks = generateTasks(userId, 65); // Generate 65 tasks
    console.log(`✅ Generated ${tasks.length} tasks`);

    // Insert tasks into database
    console.log("💾 Saving tasks to database...");
    await Task.insertMany(tasks);
    console.log("✅ Tasks saved successfully!");

    // Verify the count
    const taskCount = await Task.countDocuments({ createdBy: userId });
    console.log(`📊 Total tasks in database: ${taskCount}`);

    // Show some statistics
    const stats = await Task.aggregate([
      { $match: { createdBy: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
          },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          highPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] },
          },
          mediumPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "medium"] }, 1, 0] },
          },
          lowPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "low"] }, 1, 0] },
          },
        },
      },
    ]);

    if (stats.length > 0) {
      const stat = stats[0];
      console.log("\n📈 Task Statistics:");
      console.log(`   Total: ${stat.total}`);
      console.log(`   Completed: ${stat.completed}`);
      console.log(`   In Progress: ${stat.inProgress}`);
      console.log(`   Pending: ${stat.pending}`);
      console.log(`   High Priority: ${stat.highPriority}`);
      console.log(`   Medium Priority: ${stat.mediumPriority}`);
      console.log(`   Low Priority: ${stat.lowPriority}`);
    }

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("📖 You can now test pagination with your frontend.");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
