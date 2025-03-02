import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ReportScreen() {
  const { permit } = useLocalSearchParams(); // Get permit from query params
  const [rating, setRating] = useState(3);
  const router = useRouter(); // Use Expo Router for navigation

  const submitReport = async () => {
    try {
      await addDoc(collection(db, "parking_reports"), {
        permit: permit,
        rating: rating,
        timestamp: new Date(),
      });
      alert("Report submitted!");
      router.push(`/recommendation?permit=${permit}`); // Navigate to recommendation screen
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <View>
      <Text>Rate Parking Availability (1-5): {rating}</Text>
      <Button title="Increase" onPress={() => setRating((r) => Math.min(5, r + 1))} />
      <Button title="Decrease" onPress={() => setRating((r) => Math.max(1, r - 1))} />
      <Button title="Submit Report" onPress={submitReport} />
    </View>
  );
}
