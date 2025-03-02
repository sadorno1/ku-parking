import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [permit, setPermit] = useState<string | null>(null); 

  useEffect(() => {
    const checkStoredPermit = async () => {
      const storedPermit = await AsyncStorage.getItem("userPermit");
      if (storedPermit) {
        setPermit(storedPermit); 
      }
      setLoading(false);
    };
    checkStoredPermit();
  }, []);

  const handleRecommendation = () => {
    if (permit) {
      router.push(`/recommendation?permit=${permit}`); 
    } else {
      router.push("/permit-selection");
    }
  };

  const handleReport = () => {
    if (permit) {
      router.push(`/permit-info?permit=${permit}`); //go to parking info
    } else {
      router.push("/permit-selection"); //if no permit, ask them to choose one
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#005DAA" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to KU Parking</Text>
      <Text style={styles.subtitle}>Find the best parking lot or report availability.</Text>

      {/* Recommend Button */}
      <TouchableOpacity style={[styles.button, styles.blue]} onPress={handleRecommendation}>
        <Text style={styles.buttonText}>Recommend Me Where to Park</Text>
      </TouchableOpacity>

      {/* Report Button */}
      <TouchableOpacity style={[styles.button, styles.red]} onPress={handleReport}>
        <Text style={styles.buttonText}>Report Parking Availability</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#005DAA",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    width: "80%",
    paddingVertical: 12,
    marginVertical: 10,
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
  blue: { backgroundColor: "#005DAA" }, 
  red: { backgroundColor: "#D32F2F" }, 
});
