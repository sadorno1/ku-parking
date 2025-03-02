import { useRouter } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to KU Parking App</Text>
      <Button title="Get Started" onPress={() => router.push("permit-selection" as const);} />
    </View>
  );
}


