import { queryGameServerInfo } from 'npm:steam-server-query';

// this is the list of ips that will be queried
const ips = ['144.217.10.50', '198.27.70.76']
const ports = [25001, 25002, 25003]

// this was a short cut i wrote because
// i was to lazy to write all of the ports
// so this just loops thru the range of all the ports
for (let i = 27015; i <= 27069; i++) {
    ports.push(i);
}

// this holds the raw data from the quries before they are sorted
let onlineData: any[] = [];


// This is the main function
async function fetchDataAndWriteToFile() {

    // This is a list of all of the querries that are being executed
    const promises = [];

    // Loops through all the ips then all the ports defined above and then queries them
    for (let i = 0; i < ips.length; i++) {

        for (let j = 0; j < ports.length; j++) {
            // puts the query into the promises array to make sure they are all executed
            promises.push(
                // Delay of 5 second between each query to prevent the connection from timing out
                delay(i * 5000).then(() =>
                    queryGameServerInfo(`${ips[i]}:${ports[j]}`)
                        .then(infoResponse => {
                            if (infoResponse) {
                                // the errors in this section are just typing errors but it does not affect the program

                                // converts the gameid to a string to fix an issue with BigInt when formatting to json
                                infoResponse.gameId = infoResponse.gameId.toString();

                                // adds the ip to the response object
                                infoResponse["ip"] = ips[i];
                                onlineData.push(infoResponse);
                            }
                        })
                        .catch((err) => {
                            // If you uncomment this, it will print out the offline servers but 
                            // it will spam the console if you are querying a lot of servers
                            //console.log(`${ips[i]}:${ports[j]} is offline or is timed out`)
                        })
                )
            );
        }
    }

    await Promise.all(promises);
    // console.log(onlineData);

    // sorts the data alphabetically by folder/game and then by hostname if its the same game
    const sortedData = onlineData.sort((a, b) => {
        // sorts the array by foilder first
        if (a.folder < b.folder) {
            return -1;
        }
        if (a.folder > b.folder) {
            return 1;
        }

        // then If folder is the same, sort by the hostname
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });

    const now = new Date();

    // Formats the hours, minutes, seconds, month, date and year
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const date = now.getDate().toString().padStart(2, "0");
    const year = now.getFullYear();
  
    // Output the time and the number of servers queried after the querrying is finished
    console.log(`%c${hours}:${minutes}:${seconds} ${month}/${date}/${year} %c| %c${sortedData.length} %cserver have been queried. `, "color: yellow", "color: white", "color: green", "color: yellow");

    // write to a json file in the same directory as this script
    // it also overwrites the old data with the new data
    try {
        await Deno.writeTextFile('serverdata.json', JSON.stringify(sortedData, null, 2), (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });

        // reset the onlineData array to prevent duplicate data and old data.
        onlineData = [];
    } catch (err) {
        console.error('Error writing file', err);
        onlineData = [];
    }
}

// Call the function initial function and then every 1 minute
console.log("Started querying servers...");
fetchDataAndWriteToFile();
setInterval(fetchDataAndWriteToFile, 60000);

// This fuction is used to delay the execution of the queryGameServerInfo function
// This is to prevent the connection to the server from timing out
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}