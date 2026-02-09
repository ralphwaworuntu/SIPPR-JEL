import { auth } from "./auth";

async function createAdmin() {
    const email = "admin@gmit.ac.id";
    const password = "admin123";
    const name = "Administrator";

    try {
        console.log("Creating admin user...");

        await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
            }
        });

        console.log("✅ Admin user created successfully!");
        console.log("=================================");
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("=================================");
        console.log("IMPORTANT: Please change this password after first login!");

        process.exit(0);
    } catch (error: any) {
        if (error.message?.includes("already exists")) {
            console.log("⚠️  Admin user already exists!");
            console.log("=================================");
            console.log("Email:", email);
            console.log("=================================");
            process.exit(0);
        } else {
            console.error("❌ Failed to create admin:", error);
            process.exit(1);
        }
    }
}

createAdmin();
