
const formData = {
    fullName: "Test User Automasi",
    gender: "Laki-laki",
    dateOfBirth: "1990-01-01",
    phone: "081234567890",
    sector: "Sektor 1",
    lingkungan: "Lingkungan 1",
    rayon: "Rayon 1",
    address: "Jl. Test No. 1",
    educationLevel: "S1",
    jobCategory: "Tenaga Profesional",
    skills: ["Programming", "Testing"],
    willingnessToServe: "Aktif"
};

console.log("Testing API submission...");

fetch('http://localhost:3000/api/congregants', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
})
    .then(async response => {
        console.log("Response Status:", response.status);
        const result = await response.json();
        console.log("Response Body:", result);
    })
    .catch(error => {
        console.error("Error:", error);
    });
