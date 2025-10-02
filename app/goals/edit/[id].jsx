// EditInstrument.jsx (Text boxes like CreateInstrument)
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

const conditionOptions = [
  { label: "✨ New", value: "New" },
  { label: "👍 Good", value: "Good" },
  { label: "😐 Fair", value: "Fair" },
  { label: "⚠️ Needs Repair", value: "Needs Repair" },
];

const EditInstrument = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [instrumentName, setInstrumentName] = useState("");
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("New");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstrument = async () => {
      try {
        const docRef = doc(db, "goals", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setInstrumentName(data.instrumentName || "");
          setType(data.type || "");
          setBrand(data.brand || "");
          setYear(data.year || "");
          setDescription(data.description || "");
          setCondition(data.condition || "New");
        }
      } catch (err) {
        console.log("Error fetching instrument:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInstrument();
  }, [id]);

  const handleUpdate = async () => {
    if (!instrumentName.trim() || !brand.trim()) return;

    try {
      const docRef = doc(db, "goals", id);
      await updateDoc(docRef, {
        instrumentName,
        type,
        brand,
        year,
        description,
        condition,
        updatedAt: new Date(),
        userId: auth.currentUser.uid,
      });
      Keyboard.dismiss();
      router.push("/goals");
    } catch (err) {
      console.log("Error updating instrument:", err);
    }
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3BA7FF" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#F0F9FF", "#DDF3FF"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="music-circle"
              size={80}
              color="#3BA7FF"
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.title}>Edit Instrument</Text>
            <Text style={styles.subtitle}>
              Update details to keep your collection fresh 
            </Text>
          </View>

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
            {renderInput(
              "Type",
              type,
              setType,
              "String, Keyboard, Wind, etc.",
              "music"
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Condition</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={condition}
                onValueChange={(itemValue) => setCondition(itemValue)}
                style={styles.picker}
              >
                {conditionOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

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

        {/* Floating Update Button */}
        <Pressable onPress={handleUpdate} style={styles.fab}>
          <LinearGradient colors={["#3BA7FF", "#6BE6FF"]} style={styles.fabGradient}>
            <FontAwesome5 name="edit" size={18} color="white" />
          </LinearGradient>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default EditInstrument;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 140 },
  header: { alignItems: "center", marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "800", color: "#1F3C88", textAlign: "center" },
  subtitle: { fontSize: 15, color: "#497B9B", textAlign: "center", marginTop: 6 },

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
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1F3C88", marginBottom: 10 },

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
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: "#1E293B" },

  pickerWrapper: {
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "#D0E9FF",
    paddingHorizontal: 12,
  },
  picker: { width: "100%", height: 50 },

  textAreaWrapper: {
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "#D0E9FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textArea: { minHeight: 100, fontSize: 15, color: "#1E293B", textAlignVertical: "top" },

  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
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
  fabGradient: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
