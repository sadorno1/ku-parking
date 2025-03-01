import React from "react";
import { View, Text, Button, Linking } from "react-native";

export default function RecommendationScreen({ route }) {
  const { permit } = route.params;
  const recommendedLot = getBestParkingLot(permit); // Placeholder function

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

// Placeholder function - replace with real logic
const getBestParkingLot = (permit) => {
  const lots = {
    Gold: { name: "Rec Center", latitude: 38.9555, longitude: -95.2526 },
    Blue: { name: "Allen Fieldhouse Garage", latitude: 38.9552, longitude: -95.2500 },
    Red: { name: "Murphy Hall", latitude: 38.9548, longitude: -95.2490 },
    Yellow: { name: "Mississippi Street Garage", latitude: 38.9532, longitude: -95.2548 },
  };
  return lots[permit];
};
