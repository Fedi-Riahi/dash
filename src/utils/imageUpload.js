// imageUpload.js
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const uploadImageToStorage = async (file, folderId, folderName) => {
  try {
    // Constructing the storage path
    let storagePath = `images/${folderId}/${folderName}/`;
    
    // Creating a reference to the storage path
    const storageRef = ref(storage, storagePath + file.name);
    
    // Uploading the file to the constructed storage path
    const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
    
    console.log("Image uploaded successfully:", uploadTaskSnapshot);
    
    return uploadTaskSnapshot;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

