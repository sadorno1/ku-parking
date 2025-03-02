import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export default function ReportScreen({ route, navigation }) {
  const { permit } = route.params;
  const [rating, setRating] = useState(3);

  const submitReport = async () => {
    try {
      await addDoc(collection(db, "parking_reports"), {
        permit: permit,
        rating: rating,
        timestamp: new Date(),
      });
      alert("Report submitted!");
      navigation.navigate("RecommendationScreen", { permit: permit });
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
