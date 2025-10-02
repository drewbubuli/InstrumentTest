import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Link, router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const cardSize = (width - 64) / 2;

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3BA7FF" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#F0F9FF", "#DDF3FF"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="music-circle"
            size={88}
            color="#3BA7FF"
            style={{ marginBottom: 12 }}
          />
          <Text style={styles.logo}>Instrument Test</Text>
          <Text style={styles.subtitle}>
            Organize instruments & rhythms in style
          </Text>
        </View>

        {/* Action Grid */}
        <View style={styles.grid}>
          <Link href="/goals" asChild>
            <TouchableOpacity activeOpacity={0.8} style={styles.cardWrapper}>
              <LinearGradient
                colors={["#3BA7FF", "#6BE6FF"]}
                style={styles.card}
              >
                <Ionicons name="musical-notes" size={38} color="white" />
                <Text style={styles.cardText}>View Instruments</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Link>

          <Link href="/goals/create" asChild>
            <TouchableOpacity activeOpacity={0.8} style={styles.cardWrapper}>
              <LinearGradient
                colors={["#5DC9FF", "#3BA7FF"]}
                style={styles.card}
              >
                <MaterialCommunityIcons
                  name="guitar-electric"
                  size={38}
                  color="white"
                />
                <Text style={styles.cardText}>Add Instrument</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F9FF",
  },
  container: {
    flex: 1,
  },
  scroll: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
  },
  logo: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1F3C88",
    marginBottom: 6,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#497B9B",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  cardWrapper: {
    width: cardSize,
    height: cardSize,
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#3BA7FF",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 6,
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    padding: 16,
  },
  cardText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
});

export default Home;
