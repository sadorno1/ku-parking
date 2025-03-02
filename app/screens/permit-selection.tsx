import { useRouter } from "expo-router";
import { View, Text, Button } from "react-native";

export default function PermitSelection() {
  const router = useRouter();

  return (
    <View>
      <Text>Select Your Parking Permit:</Text>
      <Button title="Gold" onPress={() => router.push("/report?permit=Gold")} />
      <Button title="Blue" onPress={() => router.push("/report?permit=Blue")} />
      <Button title="Red" onPress={() => router.push("/report?permit=Red")} />
      <Button title="Yellow" onPress={() => router.push("/report?permit=Yellow")} />
    </View>
  );
}

