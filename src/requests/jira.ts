import {ENV} from "../../env";

const headers = {
    Authorization: `Bearer ${ENV.jiraAccessToken}`,
    Accept: 'application/json',
    "Content-Type": "application/json"
}

export const createTask = async (title: string, description: string, assignee: string) => {
    const data = {
        fields: {
            project: {key: ENV.jiraProject},
            summary: title,
            description: description,
            issuetype: {name: "Task"},
            labels: ["qe-task"],
            components: [
                {
                    name: "QE-Task"
                }
            ],
            assignee: {
                name: assignee
            }
        }
    }

    try {
        const response = await fetch(ENV.jiraApiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        console.log('Task creation Response status', response.status);
        if (response.status === 403) {
            throw new Error("Status 403 when creating Task");
        }

        return response.json();
    } catch (err) {
        console.error("Task Creation error", err);
    }

}