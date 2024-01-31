import { ENV } from "../../env";
const headers = {
    Authorization: `Bearer ${ENV.jiraAccessToken}`,
    Accept: 'application/json'
};
/**
 * Returns the list of TCs which comply these requisites:
 * Not automated
 * Updated (or created) in the last 7 days
 * Drafts or approved
 * Assigned to the assignee
 * @param assignee string
 */
export const getNotSyncedTCs = (assignee) => {
    const query = `query=assignee.id:${assignee} AND caseautomation.KEY:notautomated AND status:(approved draft) AND updated:[$today-7d$ TO $today$]&fields[workitems]=@basic,trello,assignee`;
    const url = `${ENV.polarionApiUrl}/projects/${ENV.polarionProject}/workitems`;
    return fetch(`${url}?${query}`, {
        method: 'GET',
        headers
    }).then(response => response.json());
};
export const updateTcTrelloField = (workItemId, value) => {
    const url = `${ENV.polarionApiUrl}/projects/${ENV.polarionProject}/workitems/${workItemId}`;
    const body = {
        data: {
            type: 'workitems',
            id: `${ENV.polarionProject}/${workItemId}`,
            attributes: {
                trello: value
            }
        }
    };
    return fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body)
    });
};
