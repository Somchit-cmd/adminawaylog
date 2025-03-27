
// Firebase implementation
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNk9KPd_QQtJURp8iFPrZKeex56K1N5_A",
  authDomain: "admin-away-log.firebaseapp.com",
  projectId: "admin-away-log",
  storageBucket: "admin-away-log.firebasestorage.app",
  messagingSenderId: "418840841692",
  appId: "1:418840841692:web:433c98841258d985735319",
  measurementId: "G-VLWLXRYMSK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Type definition for the report data
export interface ReportData {
  id?: string; // Optional since it's assigned by Firestore
  userName: string;
  purpose: string;
  timeOut: string;
  timeIn: string;
  vehicle: string;
  notes?: string;
  photoBase64?: string; // Store base64 images directly in Firestore
  location?: { lat: number; lng: number };
  timestamp?: string; // ISO string date
  createdAt?: Timestamp; // Firestore timestamp
}

// Function to save report data to Firestore
export const saveReport = async (reportData: ReportData): Promise<string> => {
  try {
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
        photoBase64: data.photoBase64,
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

// Function for saving reports with photos (base64 only)
export const saveReportWithPhoto = async (reportData: any, photoFile: File, photoBase64?: string): Promise<string> => {
  try {
    let dataToSave: any = {
      ...reportData,
      createdAt: Timestamp.now()
    };

    // Store the photo as base64 in Firestore
    if (photoBase64) {
      dataToSave.photoBase64 = photoBase64;
    } else {
      // Convert the file to base64 if not already provided
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(photoFile);
      });
      
      dataToSave.photoBase64 = await base64Promise;
    }
    
    // Add document to Firestore
    const docRef = await addDoc(collection(db, "reports"), dataToSave);
    
    return docRef.id;
  } catch (error) {
    console.error("Error saving report with photo:", error);
    throw new Error("Failed to save report with photo");
  }
};
