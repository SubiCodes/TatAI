import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Home Screen.</Text>
      <Link href="/homefix/brokenfaucet" style={{backgroundColor: 'lightgreen', paddingVertical: 4, paddingHorizontal: 8}}>Go to Broken Faucet Fix</Link>
    </View>
  );
}
