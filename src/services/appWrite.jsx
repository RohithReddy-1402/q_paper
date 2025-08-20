import { Client, Storage } from "appwrite";

const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1') 
    .setProject('68a567d00002634f3687'); 


export const storage = new Storage(client);


