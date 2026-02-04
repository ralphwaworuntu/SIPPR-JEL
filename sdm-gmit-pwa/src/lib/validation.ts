/**
 * Mock Service for validating data against a simulated database.
 * interacting with a backend API.
 */

// Simulated database of existing names
const EXISTING_NAMES = [
    "John Doe",
    "Jane Doe",
    "Budi Santoso",
    "Siti Aminah",
    "Michael T",
    "Test User"
];

/**
 * Checks if a name already exists in the database.
 * @param name The name to check
 * @returns Promise<boolean> True if exists (duplicate), False otherwise
 */
export const checkDuplicateName = async (name: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    if (!name) return false;

    // Case-insensitive check
    const normalizedInput = name.toLowerCase().trim();
    return EXISTING_NAMES.some(existing => existing.toLowerCase() === normalizedInput);
};
