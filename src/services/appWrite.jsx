import { Client, Storage } from "appwrite";

const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1') 
    .setProject('68a567d00002634f3687'); 

const bucketId="68a5689f000a8af36f8a";
export const storage = new Storage(client);

export const getFileViewUrl = (fileId) => {
  return storage.getFileView(bucketId, fileId);
};
export const getFileDownloadUrl = (fileId) => {
  return storage.getFileDownload(bucketId, fileId);
};
