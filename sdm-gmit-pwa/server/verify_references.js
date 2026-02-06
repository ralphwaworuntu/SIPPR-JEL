
console.log("Testing GET /api/references...");

fetch('http://localhost:3000/api/references')
    .then(async response => {
        console.log("Response Status:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("References Headers:", Object.keys(result));
        console.log("Sectors:", result.sectors);
    })
    .catch(error => {
        console.error("Error:", error);
    });
