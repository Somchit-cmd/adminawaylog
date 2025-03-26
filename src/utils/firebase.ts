
// Firebase implementation
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Type definition for the report data
export interface ReportData {
  id?: string; // Optional since it's assigned by Firestore
  userName: string;
  purpose: string;
  timeOut: string;
  timeIn: string;
  vehicle: string;
  notes?: string;
  photoUrl?: string;
  location?: { lat: number; lng: number };
  timestamp?: string; // ISO string date
  createdAt?: Timestamp; // Firestore timestamp
}

// Function to upload an image to Firebase Storage
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Create a unique file name
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `photos/${fileName}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

// Function to save report data to Firestore
export const saveReport = async (reportData: ReportData): Promise<string> => {
  try {
    // If there's a photo file, upload it and get the URL
    if (reportData.photoUrl && reportData.photoUrl.startsWith("blob:")) {
      // This is a local blob URL, we need to replace with firebase URL
      // But in actual implementation we'd receive a File object instead
      // This is just to handle the mock data we've been using
      console.log("Note: In real implementation, upload actual file instead of blob URL");
    }
    
    // Add timestamp
    const dataToSave = {
      ...reportData,
      createdAt: Timestamp.now()
    };
    
    // Add document to Firestore
    const docRef = await addDoc(collection(db, "reports"), dataToSave);
    
    return docRef.id;
  } catch (error) {
    console.error("Error saving report:", error);
    throw new Error("Failed to save report");
  }
};

// Function to get all reports
export const getReports = async (): Promise<ReportData[]> => {
  try {
    // Create a query to get all reports ordered by timestamp
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    
    // Get documents
    const querySnapshot = await getDocs(q);
    
    // Map documents to ReportData objects
    const reports: ReportData[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      
      return {
        id: doc.id,
        userName: data.userName,
        purpose: data.purpose,
        timeOut: data.timeOut,
        timeIn: data.timeIn,
        vehicle: data.vehicle,
        notes: data.notes,
        photoUrl: data.photoUrl,
        location: data.location,
        timestamp: data.createdAt?.toDate()?.toISOString() || new Date().toISOString()
      };
    });
    
    return reports;
  } catch (error) {
    console.error("Error getting reports:", error);
    throw new Error("Failed to get reports");
  }
};

// Function for a realistic saveReport implementation
export const saveReportWithPhoto = async (reportData: any, photoFile: File): Promise<string> => {
  try {
    // First, upload the photo to Firebase Storage
    const photoUrl = await uploadImage(photoFile);
    
    // Then save the report data with the photo URL to Firestore
    const dataToSave = {
      ...reportData,
      photoUrl,
      createdAt: Timestamp.now()
    };
    
    // Add document to Firestore
    const docRef = await addDoc(collection(db, "reports"), dataToSave);
    
    return docRef.id;
  } catch (error) {
    console.error("Error saving report with photo:", error);
    throw new Error("Failed to save report with photo");
  }
};
