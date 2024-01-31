import {PolarionWorkItemResponse} from '../model/polarion-work-items';
import {ENV} from "../../env";

const headers = {
        Authorization: `Bearer ${ENV.polarionAccessToken}`,
        Accept: 'application/json',
        "Content-Type": "application/json"
}

/**
 * Returns the list of TCs which comply these requisites:
 * Not automated
 * Updated (or created) in the last 7 days
 * Drafts or approved
 * Assigned to the assignee
 * @param assignee string
 */
export const getNotSyncedTCs = (assignee: string): Promise<PolarionWorkItemResponse> => {

    const query = `query=assignee.id:${assignee} AND caseautomation.KEY:notautomated AND status:(approved draft) AND updated:[$today-7d$ TO $today$]&fields[workitems]=@basic,trello,assignee`;
    const url = `${ENV.polarionApiUrl}/projects/${ENV.polarionProject}/workitems`;
    return fetch(`${url}?${query}`, {
        method: 'GET',
        headers
    }).then(response => response.json() as Promise<PolarionWorkItemResponse>);

}

export const updateTcTrelloField = (workItemId: string, value: string): Promise<Response> => {
    const url = `${ENV.polarionApiUrl}/projects/${ENV.polarionProject}/workitems/${workItemId}`;
    const body = {
        data: {
            type: 'workitems',
            id: `${ENV.polarionProject}/${workItemId}`,
            attributes: {
                trello: value
            }
        }
    }
    return fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body)
    });
}