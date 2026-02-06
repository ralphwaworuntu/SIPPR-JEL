
const validData = {
    fullName: "Valid User Zod Test",
    gender: "Laki-laki",
    dateOfBirth: "1990-01-01",
    phone: "081234567890",
    sector: "Efata", // Valid from references
    address: "Jl. Valid No. 1",
    willingnessToServe: "Bersedia" // Valid from transform
};

console.log("Testing POST /api/congregants with VALID data...");

fetch('http://localhost:3000/api/congregants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validData)
})
    .then(async response => {
        console.log("Response Status:", response.status);
        const result = await response.json();
        console.log("Response Body:", JSON.stringify(result, null, 2));
    })
    .catch(error => console.error("Error:", error));
