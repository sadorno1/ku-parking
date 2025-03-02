import React from "react";
import { View, Text, Button, Linking } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function RecommendationScreen() {
  const { permit } = useLocalSearchParams(); // Expo Router method

  const recommendedLot = getBestParkingLot(permit as string); // Ensure it's treated as a string

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${recommendedLot.latitude},${recommendedLot.longitude}`;
    Linking.openURL(url);
  };

  return (
    <View>
      <Text>Recommended Lot: {recommendedLot.name}</Text>
      <Button title="Get Directions" onPress={openGoogleMaps} />
    </View>
  );
}

const getBestParkingLot = (permit: string | undefined) => {
  if (!permit) {
    return { name: "Unknown", latitude: 0, longitude: 0 };
  }

  const lots: Record<string, { name: string; latitude: number; longitude: number }> = {
    Gold: { name: "Rec Center", latitude: 38.9555, longitude: -95.2526 },
    Blue: { name: "Allen Fieldhouse Garage", latitude: 38.9552, longitude: -95.2500 },
    Red: { name: "Murphy Hall", latitude: 38.9548, longitude: -95.2490 },
    Yellow: { name: "Mississippi Street Garage", latitude: 38.9532, longitude: -95.2548 },
  };

  return lots[permit] || { name: "Unknown", latitude: 0, longitude: 0 };
};
