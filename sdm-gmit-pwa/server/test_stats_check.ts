import axios from "axios";

async function test() {
    try {
        const res = await axios.get("http://localhost:3000/api/dashboard/stats", {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
        });
        console.log("SUCCESS:", JSON.stringify(res.data, null, 2).substring(0, 500));
    } catch (err: any) {
        console.error("ERROR STATUS:", err.response?.status);
        console.error("ERROR DATA:", err.response?.data);
        console.error("ERROR MESSAGE:", err.message);
    }
}

test();
