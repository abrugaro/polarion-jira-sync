import { ENV } from "../../env";
const headers = {
    Authorization: `Bearer ${ENV.jiraAccessToken}`,
    Accept: 'application/json'
};
export const createTask = (title, description, assignee) => {
    const data = {
        fields: {
            project: { key: ENV.jiraProject },
            summary: title,
            description: description,
            issuetype: { name: "Task" },
            labels: ["qe-task"],
            assignee: {
                name: assignee
            }
        }
    };
    return fetch(ENV.jiraApiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    }).then(response => response.json());
};
