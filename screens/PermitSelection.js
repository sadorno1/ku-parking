import React from "react";
import { View, Text, Button } from "react-native";

export default function PermitSelection({ navigation }) {
  const selectPermit = (type) => {
    navigation.navigate("ReportScreen", { permit: type });
  };

  return (
    <View>
      <Text>Select Your Parking Permit:</Text>
      <Button title="Gold" onPress={() => selectPermit("Gold")} />
      <Button title="Blue" onPress={() => selectPermit("Blue")} />
      <Button title="Red" onPress={() => selectPermit("Red")} />
      <Button title="Yellow" onPress={() => selectPermit("Yellow")} />
    </View>
  );
}
