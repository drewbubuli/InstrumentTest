import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { auth } from "../../firebaseConfig";
import { useGoals } from "../../hooks/useGoals";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const instrumentTypes = [
  { label: "String", value: "String", icon: "guitar-electric" },
  { label: "Keyboard", value: "Keyboard", icon: "piano" },
  { label: "Wind", value: "Wind", icon: "saxophone" },
  { label: "Other", value: "Other", icon: "music" },
];

const CreateInstrument = () => {
  const [instrumentName, setInstrumentName] = useState("");
  const [type, setType] = useState("String");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");

  const { createGoal } = useGoals();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!instrumentName.trim() || !description.trim()) return;

    await createGoal({
      instrumentName,
      type,
      description,
      brand,
      year,
      status: "Available",
      condition: "New",
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });

    setInstrumentName("");
    setType("String");
    setDescription("");
    setBrand("");
    setYear("");

    Keyboard.dismiss();
    router.push("/goals");
  };

  const renderInput = (label, value, setValue, placeholder, icon) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <FontAwesome5
          name={icon}
          size={16}
          color="#3BA7FF"
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={setValue}
        />
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#F0F9FF", "#DDF3FF"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Illustration */}
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="music-circle"
              size={80}
              color="#3BA7FF"
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.title}>Add New Instrument</Text>
            <Text style={styles.subtitle}>
              Fill in the details to grow your collection 
            </Text>
          </View>

          {/* Instrument Info */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Instrument Info</Text>
            {renderInput(
              "Instrument Name",
              instrumentName,
              setInstrumentName,
              "Acoustic Guitar",
              "guitar"
            )}
            {renderInput("Brand", brand, setBrand, "Yamaha, Fender, etc.", "tags")}
            {renderInput("Year", year, setYear, "2024", "calendar")}
          </View>

          {/* Category Chips */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.chipRow}>
              {instrumentTypes.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.chip,
                    type === option.value && styles.chipActive,
                  ]}
                  onPress={() => setType(option.value)}
                >
                  <MaterialCommunityIcons
                    name={option.icon}
                    size={18}
                    color={type === option.value ? "white" : "#3BA7FF"}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.chipText,
                      type === option.value && styles.chipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Description</Text>
            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder="Details about this instrument..."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>
          </View>
        </ScrollView>

        {/* Floating Action Buttons */}
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={[styles.fab, styles.cancelFab]}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={22} color="#3BA7FF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit} style={styles.fab}>
            <LinearGradient
              colors={["#3BA7FF", "#6BE6FF"]}
              style={styles.fabGradient}
            >
              <FontAwesome5 name="save" size={18} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CreateInstrument;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 140 },
  header: { alignItems: "center", marginBottom: 20 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1F3C88",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#497B9B",
    textAlign: "center",
    marginTop: 6,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    shadowColor: "#3BA7FF",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F3C88",
    marginBottom: 10,
  },
  inputContainer: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", color: "#497B9B", marginBottom: 6 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D0E9FF",
    paddingHorizontal: 12,
    shadowColor: "#3BA7FF",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1E293B",
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3BA7FF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  chipActive: {
    backgroundColor: "#3BA7FF",
    borderColor: "#3BA7FF",
  },
  chipText: { color: "#3BA7FF", fontWeight: "600" },
  chipTextActive: { color: "white" },
  textAreaWrapper: {
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "#D0E9FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textArea: {
    minHeight: 100,
    fontSize: 15,
    color: "#1E293B",
    textAlignVertical: "top",
  },

  // Floating FAB styles
  fabContainer: {
    position: "absolute",
    bottom: 30,
    left: 250,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3BA7FF",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cancelFab: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#3BA7FF",
  },
  fabGradient: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
  },
});
