import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PermitSelection from "./screens/PermitSelection";
import ReportScreen from "./screens/ReportScreen";
import RecommendationScreen from "./screens/RecommendationScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="PermitSelection" component={PermitSelection} />
        <Tab.Screen name="ReportScreen" component={ReportScreen} />
        <Tab.Screen name="RecommendationScreen" component={RecommendationScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
