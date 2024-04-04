import { Match } from "../types/match";
import { fetchWithCredentials } from "../utilities/fetch-utilities";


export async function createNewMatch(match: Omit<Match, '_id' | "players">) {
    const response = await fetchWithCredentials("matches", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(match),
    });

    if (response.ok) {
        return await response.text();
    }
}