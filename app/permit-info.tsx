import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

const parkingLots = {
  Gold: [
    { id: "1", name: "Rec Center", location: "I6" },
    { id: "2", name: "Watkins Health Center", location: "J6" },
  ],
  Blue: [
    { id: "1", name: "Allen Fieldhouse Garage", location: "H5" },
    { id: "2", name: "Capitol Federal Hall", location: "I6" },
  ],
  Red: [
    { id: "1", name: "Murphy Hall", location: "H5" },
    { id: "2", name: "Memorial Stadium", location: "I3" },
  ],
  Yellow: [
    { id: "1", name: "Mississippi Street Garage", location: "K3" },
    { id: "2", name: "Stouffer Place", location: "F6" },
  ],
  Green: [
    { id: "1", name: "Sunflower Apartments", location: "I1" },
    { id: "2", name: "Research Circle", location: "C9" },
  ],
};

export default function PermitInfo() {
  const { permit } = useLocalSearchParams(); // Get permit from query params

  const lots = parkingLots[permit as keyof typeof parkingLots] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚗 Parking Options for {permit} Permit</Text>
      <FlatList
        data={lots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.lotName}>{item.name}</Text>
            <Text style={styles.lotLocation}>Location: {item.location}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#005DAA",
    marginBottom: 20,
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
});
