export interface FormData {
    // Step 1: Identity
    fullName: string;
    gender: 'Laki-laki' | 'Perempuan' | '';
    dateOfBirth: string;
    phone: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    sector: string;
    lingkungan: string;
    rayon: string;

    // Step 2: Professional
    educationLevel: string;
    major: string;
    jobCategory: string; // KBJI
    jobTitle: string;
    companyName: string;
    yearsOfExperience: number;
    skills: string[];

    // Step 3: Commitment
    willingnessToServe: string; // Active / On-demand
    interestAreas: string[];
    contributionTypes: string[];

    // Step 4: Consent
    agreedToPrivacy: boolean;
    dataValidated: boolean;
}

export const initialFormData: FormData = {
    fullName: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    latitude: -10.1772, // Default kupang
    longitude: 123.6070,
    sector: '',
    lingkungan: '',
    rayon: '',
    educationLevel: '',
    major: '',
    jobCategory: '',
    jobTitle: '',
    companyName: '',
    yearsOfExperience: 0,
    skills: [],
    willingnessToServe: '',
    interestAreas: [],
    contributionTypes: [],
    agreedToPrivacy: false,
    dataValidated: false,
};
