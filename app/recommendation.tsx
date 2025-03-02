import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { db } from "../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import parkingLots from "./data/parkingLots";
import * as Location from "expo-location";
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
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Location permission denied");
        } else {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location.coords);
        }

        // Fetch parking reports
        const querySnapshot = await getDocs(collection(db, "parking_reports"));
        const reports = querySnapshot.docs.map((doc) => doc.data());

        // Get lots for the selected permit
        const permitLots: ParkingLot[] = parkingLots[permit as keyof typeof parkingLots] || [];

        // Calculate availability rating & distance for each lot
        const rankedLots = permitLots.map((lot: ParkingLot) => {
          const reportsForLot = reports.filter((r) => r.location === lot.name);
          const avgRating =
            reportsForLot.length > 0
              ? reportsForLot.reduce((sum, r) => sum + r.rating, 0) / reportsForLot.length
              : 3; // Default rating if no reports exist

          let distance: number | null = null;
          if (userLocation) {
            const R = 6371; // Radius of Earth in km
            const dLat = ((lot.latitude - userLocation.latitude) * Math.PI) / 180;
            const dLon = ((lot.longitude - userLocation.longitude) * Math.PI) / 180;
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos((userLocation.latitude * Math.PI) / 180) *
                Math.cos((lot.latitude * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            distance = R * c; // Distance in km
          }

          return { ...lot, avgRating, distance: distance ?? Infinity }; // Ensure distance is never undefined
        });

        // ✅ Fixed Sorting Function
        rankedLots.sort((a: ParkingLot, b: ParkingLot) => {
          if ((b.avgRating ?? 0) !== (a.avgRating ?? 0)) return (b.avgRating ?? 0) - (a.avgRating ?? 0); // Highest rating first
          return (a.distance ?? Infinity) - (b.distance ?? Infinity); // Closest first, undefined distances last
        });

        setRecommendations(rankedLots.slice(0, 5));
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
      setLoading(false);
    };

    fetchRecommendations();
  }, [permit]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#005DAA" />
        <Text>Finding the best parking options...</Text>
      </View>
    );
  }

  const openGoogleMaps = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚗 Top 5 Parking Options for {permit} Permit</Text>

      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.lotCard}>
            <Text style={styles.lotRank}>#{index + 1}</Text>
            <Text style={styles.lotName}>{item.name}</Text>
            <Text style={styles.lotLocation}>📍 {item.location}</Text>
            <Text style={styles.lotRating}>⭐ {item.avgRating?.toFixed(1)}</Text>
            
            {/* ✅ Fixed distance handling */}
            <Text style={styles.lotDistance}>
              📏 {item.distance !== undefined && item.distance !== Infinity ? `${item.distance.toFixed(2)} km away` : "Distance unavailable"}
            </Text>

            <TouchableOpacity style={styles.directionButton} onPress={() => openGoogleMaps(item.latitude, item.longitude)}>
              <Text style={styles.buttonText}>Get Directions</Text>
            </TouchableOpacity>
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
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#005DAA",
    marginBottom: 15,
    textAlign: "center",
  },
  lotCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lotRank: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D32F2F",
  },
  lotName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  lotLocation: {
    fontSize: 16,
    color: "#777",
  },
  lotRating: {
    fontSize: 16,
    color: "#FFA500",
    fontWeight: "bold",
  },
  lotDistance: {
    fontSize: 14,
    color: "#555",
  },
  directionButton: {
    marginTop: 10,
    backgroundColor: "#005DAA",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
