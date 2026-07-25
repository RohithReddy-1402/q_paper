import { Client, Storage } from "appwrite";

const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1') 
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); 

const bucketId=import.meta.env.VITE_APPWRITE_BUCKET_ID;
export const storage = new Storage(client);

export const getFileViewUrl = (fileId) => {
  return storage.getFileView(bucketId, fileId);
};
export const getFileDownloadUrl = (fileId) => {
  return storage.getFileDownload(bucketId, fileId);
};
