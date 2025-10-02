// app/goals/[id].jsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Animated,
  Vibration,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import { BlurView } from "expo-blur";

const conditionColors = {
  New: ["#34D399", "#059669"],
  Used: ["#60A5FA", "#2563EB"],
  Repair: ["#FBBF24", "#F59E0B"],
  Broken: ["#F87171", "#DC2626"],
};

const conditionIcons = {
  New: "star-circle",
  Used: "guitar-acoustic",
  Repair: "wrench",
  Broken: "close-circle",
};

// <-- static requires for Metro
const noteFiles = {
  E2: require("../../assets/sounds/E2.wav"),
  A2: require("../../assets/sounds/A2.wav"),
  D3: require("../../assets/sounds/D3.wav"),
  G3: require("../../assets/sounds/G3.wav"),
  B3: require("../../assets/sounds/B3.wav"),
  E4: require("../../assets/sounds/E4.wav"),
};

const InstrumentDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [instrument, setInstrument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playingNote, setPlayingNote] = useState(null);

  // Animation
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(20);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "goals", id), (docSnap) => {
      if (docSnap.exists()) setInstrument({ id: docSnap.id, ...docSnap.data() });
      else setInstrument(null);
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  const playTone = async (noteKey) => {
    try {
      const noteFile = noteFiles[noteKey];
      if (!noteFile) return;
      setPlayingNote(noteKey);
      Vibration.vibrate(20);
      const { sound } = await Audio.Sound.createAsync(noteFile);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
          setPlayingNote(null);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3BA7FF" />
      </View>
    );

  if (!instrument)
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Instrument not found</Text>
      </View>
    );

  return (
    <LinearGradient colors={["#d3eafaff", "#cce5fcff"]} style={styles.container}>

      <ScrollView contentContainerStyle={{ paddingBottom: 80, paddingTop: 40 }}>
  {/* Hero */}
  <Animated.View
    style={[
      styles.hero,
      { transform: [{ translateY: slideAnim }] },
    ]}
  >
    <Text style={styles.heroName}>{instrument.instrumentName}</Text>
    <Text style={styles.subtitle}> Instrument Profile</Text>
    {instrument.condition && (
      <LinearGradient
        colors={conditionColors[instrument.condition] || ["#9CA3AF", "#6B7280"]}
        style={styles.conditionBadge}
      >
        <MaterialCommunityIcons
          name={conditionIcons[instrument.condition]}
          size={20}
          color="white"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.conditionText}>{instrument.condition}</Text>
      </LinearGradient>
    )}
  </Animated.View>


        {/* Info Cards with Glassmorphism */}
        {[{
          label: "Type",
          value: instrument.type || "N/A"
        }, {
          label: "Brand / Year",
          value: `${instrument.brand || "N/A"} ${instrument.year ? `(${instrument.year})` : ""}`
        }, {
          label: "Notes",
          value: instrument.description || "N/A"
        }].map((item, idx) => (
          <BlurView
            intensity={30}
            tint="light"
            style={styles.card}
            key={idx}
          >
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </BlurView>
        ))}

        {/* Quick Tuner */}
        <BlurView intensity={30} tint="light" style={styles.card}>
          <Text style={styles.label}>Quick Tuner 🎶</Text>
          {playingNote && (
            <Text style={styles.nowPlaying}>Now Playing: {playingNote.replace(/\d/, "")}</Text>
          )}
          <View style={styles.tunerRow}>
            {["E2", "A2", "D3", "G3", "B3", "E4"].map((note) => (
              <Pressable
                key={note}
                style={({ pressed }) => [
                  styles.tunerBtn,
                  pressed && { transform: [{ scale: 0.95 }] },
                  playingNote === note && { shadowColor: "#3BA7FF", shadowOpacity: 0.6, shadowRadius: 10 },
                ]}
                onPress={() => playTone(note)}
              >
                <LinearGradient
                  colors={["#3BA7FF", "#6BE6FF"]}
                  style={styles.tunerGradient}
                >
                  <Text style={styles.tunerText}>{note.replace(/\d/, "")}</Text>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </BlurView>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <LinearGradient colors={["#32a1fcff", "#6BE6FF"]} style={styles.button}>
            <Pressable
              style={styles.buttonContent}
              onPress={() => router.push(`/goals/edit/${instrument.id}`)}
            >
              <Ionicons name="create-outline" size={18} color="white" />
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>
          </LinearGradient>

          <Pressable style={[styles.button, styles.cancelBtn]} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Back</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default InstrumentDetail;

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "red" },

 hero: {
  alignItems: "center",
  paddingVertical: 40,
  zIndex: 10,
},
heroName: {
  fontSize: 36,
  fontWeight: "800",
  color: "#1F3C88", // stronger dark blue
  textAlign: "center",
  textShadowColor: "rgba(0,0,0,0.15)",
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 4,
},
conditionBadge: {
  flexDirection: "row",
  alignItems: "center",
  borderRadius: 20,
  paddingVertical: 6,
  paddingHorizontal: 18,
  marginTop: 14,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
  zIndex: 20,
},


  conditionText: { color: "white", fontWeight: "700", fontSize: 15 },

  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    backgroundColor: "rgba(255,255,255,0.85)",
    overflow: "hidden",
    borderLeftWidth: 5,
    borderLeftColor: "#3BA7FF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  label: { fontSize: 14, fontWeight: "600", color: "#6B7280", marginBottom: 4 },
  value: { fontSize: 16, color: "#111827", fontWeight: "500" },

  tunerRow: { flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap", marginTop: 12 },
  tunerBtn: { margin: 6, borderRadius: 50, overflow: "hidden" },
  tunerGradient: { width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  tunerText: { color: "white", fontWeight: "800", fontSize: 18 },
  nowPlaying: { textAlign: "center", color: "#3BA7FF", fontWeight: "700", marginVertical: 6 },

  buttonRow: { flexDirection: "row", justifyContent: "space-between", margin: 20, gap: 12 },
  button: { flex: 1, borderRadius: 14, overflow: "hidden" },
  buttonContent: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, gap: 6 },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
  cancelBtn: { flex: 1, borderRadius: 14, borderWidth: 2, borderColor: "#3BA7FF", justifyContent: "center", alignItems: "center", paddingVertical: 14 },
  cancelText: { color: "#3BA7FF", fontWeight: "700", fontSize: 16 },
});
