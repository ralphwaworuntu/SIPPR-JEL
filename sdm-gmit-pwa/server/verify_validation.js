
const invalidData = {
    fullName: "Test Invalid User",
    gender: "Alien", // Invalid
    dateOfBirth: "1990-01-01",
    phone: "081234567890",
    sector: "Sektor 99", // Invalid
    address: "Jl. Test"
};

console.log("Testing POST /api/congregants with INVALID data...");

fetch('http://localhost:3000/api/congregants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidData)
})
    .then(async response => {
        console.log("Response Status:", response.status);
        const result = await response.json();
        console.log("Response Body:", JSON.stringify(result, null, 2));
    })
    .catch(error => console.error("Error:", error));
