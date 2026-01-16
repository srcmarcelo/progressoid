import { exec } from "child_process"; // Import exec to run shell commands
import dotenv from "dotenv"; // Import dotenv to load environment variables

// Load environment variables from .env
dotenv.config();

// Read the project ID from environment variables
const projectId = process.env.SUPABASE_PROJECT_ID;

if (!projectId) {
  console.error("Error: SUPABASE_PROJECT_ID is not set in your .env file.");
  process.exit(1);
}

// Construct the command
const command = `supabase gen types typescript --project-id ${projectId} --schema public > lib/supabase/database.types.ts`;

// Execute the command
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing command: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`Error: ${stderr}`);
  }
  console.log("Types generated successfully!");
});
