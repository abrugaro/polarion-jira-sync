import {getNotSyncedTCs, updateTcTrelloField} from "./requests/polarion";
import {createTask} from "./requests/jira";

getNotSyncedTCs('abrugaro').then(async (response) => {
    console.log(response);
    for (const item of response.data) {
        if (item.attributes.trello) {
            console.log(`Polarion TC ${item.attributes.id} | ${item.attributes.title} already synced, skipping...`);
            continue;
        }

        const title = `[QE] Automate ${item.attributes.title} Polarion TC ${item.attributes.id}`
        const task = await createTask(title, item.links.portal, 'rh-ee-abrugaro');
        if (!task) {
            return;
        }

        console.log(task);

        try {
            const res = await updateTcTrelloField(item.attributes.id, task.key);
            console.log("Polarion update status", res.status);
            if (res.status !== 204) {
                console.error("Polarion update error");
                return;
            }
        } catch (err) {
            console.error("Polarion TC updated", err);
            return;
        }

        console.log('\n\n\n------------------------------------------------------------------\n\n\n');
    }
});