import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function PermitSelection() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStoredPermit = async () => {
      const storedPermit = await AsyncStorage.getItem("userPermit");
      if (storedPermit) {
        router.replace(`/permit-info?permit=${storedPermit}`); 
      } else {
        setLoading(false); //show selection screen if no permit is found
      }
    };
    checkStoredPermit();
  }, []);

  const selectPermit = async (permit: string) => {
    await AsyncStorage.setItem("userPermit", permit);
    router.replace(`/permit-info?permit=${permit}`);
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
      <Text style={styles.title}>Select Your Parking Permit</Text>
      <Text style={styles.subtitle}>We'll remember your choice for next time.</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.gold]} onPress={() => selectPermit("Gold")}>
          <Text style={styles.buttonText}>Gold</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.blue]} onPress={() => selectPermit("Blue")}>
          <Text style={styles.buttonText}>Blue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.red]} onPress={() => selectPermit("Red")}>
          <Text style={styles.buttonText}>Red</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.yellow]} onPress={() => selectPermit("Yellow")}>
          <Text style={styles.buttonText}>Yellow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.green]} onPress={() => selectPermit("Green")}>
          <Text style={styles.buttonText}>Green</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 12,
    marginVertical: 8,
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
  gold: { backgroundColor: "#d4af37" },
  blue: { backgroundColor: "#005DAA" },
  red: { backgroundColor: "#D32F2F" },
  yellow: { backgroundColor: "#FBC02D" },
  green: { backgroundColor: "#4CAF50" }, 
});
