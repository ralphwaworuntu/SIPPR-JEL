const axios = require('axios');

async function test() {
    try {
        const res = await axios.get('http://localhost:3000/api/members', {
            headers: {
                Cookie: 'connect.sid=dummy;'
            }
        });
        console.log("Success");
    } catch (err) {
        console.log("STATUS:", err.response?.status);
        console.log("DATA:", err.response?.data);
    }
}

test();
