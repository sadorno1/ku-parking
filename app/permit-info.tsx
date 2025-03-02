import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import parkingLots from "./data/parkingLots"; // Import parking lot data

export default function PermitInfo() {
  const { permit } = useLocalSearchParams(); // Get permit from query params
  const router = useRouter(); // For navigation
  const lots = parkingLots[permit as keyof typeof parkingLots] || [];

  // Function to change permit
  const changePermit = async () => {
    await AsyncStorage.removeItem("userPermit"); // Remove saved permit
    router.replace("/permit-selection"); // Redirect to permit selection
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parking Options for {permit} Permit</Text>

      <FlatList
        data={lots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push(`/report?permit=${permit}&location=${item.name}`)}
          >
            <Text style={styles.lotName}>{item.name}</Text>
            <Text style={styles.lotLocation}>📍 Location: {item.location}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Change Permit Button */}
      <TouchableOpacity style={styles.changeButton} onPress={changePermit}>
        <Text style={styles.buttonText}>Change Parking Permit</Text>
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#005DAA",
    marginBottom: 20,
    textAlign: "center",
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lotName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  lotLocation: {
    fontSize: 16,
    color: "#777",
  },
  changeButton: {
    marginTop: 30,
    backgroundColor: "#D32F2F",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
