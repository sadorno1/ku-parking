import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { child, ref, get } from "firebase/database";
import { db } from "./config/firebaseConfig"; 
import parkingLots from "./data/parkingLots"; 
import * as Linking from "expo-linking";

type ParkingLot = {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  avgRating?: number;
  distance?: number;
};

export default function RecommendationScreen() {
  const { permit } = useLocalSearchParams();
  const [recommendations, setRecommendations] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState<string>("");
  const [destinationCoords, setDestinationCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  //function to fetch parking recommendations from Firebase
  const fetchRecommendations = async () => {
    if (!permit) {
      alert("❌ Permit type is missing.");
      return;
    }
  
    setLoading(true);
    try {
      const dbRef = ref(db); //reference to Firebase Database
      const querySnapshot = await get(child(dbRef, "parking_reports"));
  
      if (!querySnapshot.exists()) {
        console.warn("⚠️ No parking reports found.");
        setLoading(false);
        return;
      }
  
      const reportsData = querySnapshot.val();
      const locationRatings: Record<string, number[]> = {};
  
      //process Firebase data
      Object.keys(reportsData).forEach((location) => {
        const reports = Object.values(reportsData[location]) as { rating: number }[];
        const sanitizedLocation = location.replace(/[.#$[\]]/g, "_"); 
        locationRatings[sanitizedLocation] = reports.map((r) => r.rating).filter(Boolean);
      });
  
      //get the list of lots for the selected permit
      const permitLots: ParkingLot[] = parkingLots[permit as keyof typeof parkingLots] || [];
  
      // Update lots with average ratings
      const updatedLots: ParkingLot[] = permitLots.map((lot: ParkingLot) => {
        const sanitizedLotName = lot.name.replace(/[.#$[\]]/g, "_"); //ensure valid Firebase key
        const ratings = locationRatings[sanitizedLotName] || [];
        const avgRating = ratings.length > 0
          ? ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length
          : 3; //default rating
  
        return { ...lot, avgRating };
      });
  
      updatedLots.sort((a: ParkingLot, b: ParkingLot) => (b.avgRating ?? 0) - (a.avgRating ?? 0));
  
      setRecommendations(updatedLots.slice(0, 5)); //keep only top 5 recommendations
    } catch (error) {
      console.error("❌ Error fetching recommendations:", error);
    }
    setLoading(false);
  };
  

  //function to fetch coordinates for a destination
  const getDestinationCoordinates = async () => {
    if (!destination) {
      alert("❌ Please enter a destination.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=blablah`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setDestinationCoords({ latitude: lat, longitude: lng });
        fetchRecommendations(); //fetch updated recommendations
      } else {
        alert("❌ Could not find location. Try again.");
      }
    } catch (error) {
      console.error("❌ Error fetching destination coordinates:", error);
    }
    setLoading(false);
  };

  //open Google Maps for directions
  const openGoogleMaps = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚗 Find the Best Parking for {permit} Permit</Text>

      {/* Destination Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your destination"
        value={destination}
        onChangeText={setDestination}
      />

      <TouchableOpacity style={styles.searchButton} onPress={getDestinationCoordinates}>
        <Text style={styles.buttonText}>🔍 Search Destination</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#005DAA" />
          <Text style={styles.loadingText}>Finding the best parking options...</Text>
        </View>
      ) : (
        <FlatList
          data={recommendations}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.lotCard}>
              <Text style={styles.lotRank}>#{index + 1}</Text>
              <Text style={styles.lotName}>{item.name}</Text>
              <Text style={styles.lotAddress}>📍 {item.location}</Text>
              <Text style={styles.lotRating}>⭐ {item.avgRating?.toFixed(1)}</Text>
              <TouchableOpacity style={styles.directionButton} onPress={() => openGoogleMaps(item.latitude, item.longitude)}>
                <Text style={styles.buttonText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Reset Button */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => {
          setDestination("");
          setDestinationCoords(null);
          setRecommendations([]);
        }}
      >
        <Text style={styles.resetButtonText}>🔄 Reset & Enter New Destination</Text>
      </TouchableOpacity>
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
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  searchButton: {
    backgroundColor: "#005DAA",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#555",
    marginTop: 10,
  },
  lotCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lotRank: { fontSize: 18, fontWeight: "bold", color: "#D32F2F" },
  lotName: { fontSize: 20, fontWeight: "600", color: "#333" },
  lotAddress: { fontSize: 14, color: "#555" },
  lotRating: { fontSize: 16, color: "#FFA500", fontWeight: "bold" },
  directionButton: {
    backgroundColor: "#005DAA",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: "#FFA500",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});

