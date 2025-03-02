import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getDatabase, ref, push } from "firebase/database";
import { db } from "./config/firebaseConfig"; 

export default function ReportScreen() {
  const router = useRouter();
  const { permit, location } = useLocalSearchParams();
  const [rating, setRating] = useState<number | null>(null);

  const submitReport = async () => {
    if (rating === null) {
      alert("❌ Please select a rating before submitting.");
      return;
    }

    try {
      const dbRef = getDatabase(); 
      const sanitizedLocation = Array.isArray(location)
        ? location.join("_")
        : location.replace(/[.#$[\]]/g, "_"); 

      await push(ref(dbRef, `parking_reports/${sanitizedLocation}`), {
        permit,
        rating,
        timestamp: new Date().toISOString(),
      });

      alert("✅ Submission successful!");
      router.replace("/");
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("❌ Failed to submit report.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚗 Report Parking Availability</Text>
      <Text style={styles.subtitle}>Location: <Text style={styles.highlight}>{location}</Text></Text>
      <Text style={styles.subtitle}>Permit Type: <Text style={styles.highlight}>{permit}</Text></Text>

      <Text style={styles.ratingLabel}>Select Parking Availability (1=Worst, 5=Best)</Text>

      {/* Rating Buttons */}
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity
            key={num}
            style={[styles.ratingButton, rating === num && styles.selectedRating]}
            onPress={() => setRating(num)}
          >
            <Text style={styles.buttonText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={submitReport}>
        <Text style={styles.submitButtonText}>Submit Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#005DAA",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
  },
  highlight: {
    fontWeight: "bold",
    color: "#D32F2F",
  },
  ratingLabel: {
    fontSize: 16,
    marginVertical: 10,
    color: "#777",
  },
  ratingContainer: {
    flexDirection: "row",
    marginVertical: 15,
  },
  ratingButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginHorizontal: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRating: {
    backgroundColor: "#005DAA",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: "#D32F2F",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
