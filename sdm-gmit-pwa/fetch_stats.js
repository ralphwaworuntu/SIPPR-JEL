async function checkMembers() {
    try {
        console.log("Fetching members from port 3000...");
        const res = await fetch('http://localhost:3000/api/members');
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Body:", text.slice(0, 500));
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

checkMembers();
