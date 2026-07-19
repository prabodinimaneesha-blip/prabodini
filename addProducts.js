import { db } from "./firebase.js";
import { collection, addDoc } from "firebase/firestore";

async function insertInitialProducts() {
    try {
        // 1. Customized Photo Frame එකතු කිරීම
        const docRef1 = await addDoc(collection(db, "products"), {
            name: "Customized Photo Frame",
            description: "High-quality wooden customized gift photo frame.",
            price: 1500.00,
            category: "Photo Frames",
            stock_quantity: 25,
            delivery_charges: 250.00,
            images: ["photo_frame_01.jpg"]
        });
        console.log("Photo Frame added successfully with ID: ", docRef1.id);

        // 2. Customized Mug එකතු කිරීම
        const docRef2 = await addDoc(collection(db, "products"), {
            name: "Customized Mug",
            description: "Beautiful ceramic personalized mug for customized gifts.",
            price: 950.00,
            category: "Mugs",
            stock_quantity: 50,
            delivery_charges: 200.00,
            images: ["mug_01.jpg"]
        });
        console.log("Mug added successfully with ID: ", docRef2.id);

    } catch (error) {
        console.error("Error inserting products to Firestore: ", error);
    }
}

// Function එක Call කිරීම
insertInitialProducts();