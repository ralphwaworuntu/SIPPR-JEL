
console.log("Testing GET API...");

fetch('http://localhost:3000/api/congregants')
    .then(async response => {
        console.log("Response Status:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Data count:", result.length);
        if (result.length > 0) {
            console.log("Sample Data:", result[0]);
        } else {
            console.log("No data found.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
