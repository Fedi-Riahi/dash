// videoUpload.js
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const uploadVideoToStorage = async (file, folderId, folderName) => {
  try {
    let storagePath = `videos/${folderId}/${folderName}/`;
    const storageRef = ref(storage, storagePath + file.name);
    const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
    console.log("Video uploaded successfully:", uploadTaskSnapshot);
    return uploadTaskSnapshot;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};
