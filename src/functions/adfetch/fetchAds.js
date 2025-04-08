// utils/fetchAds.js

export async function fetchAds(page, limit, userEmail, searchTerm) {
    try {
        const response = await fetch(`/api/viewaduser?page=${page}&limit=${limit}&user_email=${userEmail}&titleval=${searchTerm}`);
        console.log("url ", `/api/viewaduser?page=${page}&limit=${limit}&user_email=${userEmail}&titleval=${searchTerm}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            records: data.records,
            totalPages: data.totalPages,
        };
    } catch (error) {
        console.error("Error fetching ads:", error);
        return {
            records: [],
            totalPages: 1,
        };
    }
}
