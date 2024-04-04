import { fetchWithCredentials } from "../utilities/fetch-utilities";

export async function getUser() {
    const response = await fetchWithCredentials("user/info");
    if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const text = await response.text();
            if (text.length > 0) {
                return JSON.parse(text);
            }
        } else {
            return await response.text();
        }
    }
}

export async function authenticateUser(username: string, password: string){
    const response  = await fetchWithCredentials("login/password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            username, 
            password 
        }),
    }); 

    if (response.ok) {
        return await response.json();
    }
}

export async function registerUser(username: string, displayName: string, password: string){
    const response = await fetchWithCredentials("register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            username, 
            displayName, 
            password 
        }),
    });

    if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        } else {
            return await response.text();
        }
    }
}

export async function logoutUser(){
    const response = await fetchWithCredentials("logout", {
        method: "POST",
    });
    if (response.ok) {
        const result = await response.text();
        return result === 'OK';
    }
    return false;
}