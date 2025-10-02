import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Instruments = () => {
  const [instruments, setInstruments] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "goals"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInstruments(list);
      },
      (error) => console.error("Firestore error:", error)
    );

    return unsubscribe;
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "goals", id));
      setSelectedInstrument(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/auth/login");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  const conditionColors = {
    New: ["#34D399", "#10B981"], // green
    Used: ["#60A5FA", "#2563EB"], // blue
    Repair: ["#FCD34D", "#F59E0B"], // amber
    Broken: ["#F87171", "#DC2626"], // red
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/goals/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons
          name="music-circle"
          size={26}
          color="#3BA7FF"
          style={{ marginRight: 10 }}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.instrumentName}>{item.instrumentName}</Text>
          <Text style={styles.dateText}>
            Added:{" "}
            {item.createdAt?.toDate
              ? item.createdAt.toDate().toLocaleDateString()
              : "N/A"}
          </Text>
        </View>

        {/* Condition Badge */}
        <LinearGradient
          colors={conditionColors[item.condition] || ["#9CA3AF", "#6B7280"]}
          style={styles.conditionBadge}
        >
          <Text style={styles.conditionText}>
            {item.condition || "Unknown"}
          </Text>
        </LinearGradient>

        {/* Options */}
        <Pressable onPress={() => setSelectedInstrument(item)}>
          <Ionicons name="ellipsis-vertical" size={20} color="#475569" />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient colors={["#F0F9FF", "#DDF3FF"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Instruments</Text>
          <Text style={styles.subtitle}>
            Track and manage your collection
          </Text>
        </View>

        <FlatList
          data={instruments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No instruments yet 🎶</Text>
          }
        />

        {/* Modal for Delete */}
        <Modal visible={!!selectedInstrument} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPressOut={() => setSelectedInstrument(null)}
            activeOpacity={1}
          >
            <View style={styles.modalContent}>
              <Pressable
                style={styles.modalItem}
                onPress={() => handleDelete(selectedInstrument.id)}
              >
                <Text style={[styles.modalText, { color: "#DC2626" }]}>
                  Delete
                </Text>
              </Pressable>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Floating FABs */}
<View style={styles.fabContainer}>
  {/* Add Instrument (Save style) */}
  <Pressable
    style={styles.fab}
    onPress={() => router.push("/goals/create")}
  >
    <LinearGradient
      colors={["#3BA7FF", "#6BE6FF"]}
      style={styles.fabGradient}
    >
      <Ionicons name="add" size={26} color="white" />
    </LinearGradient>
  </Pressable>

  {/* Logout (Cancel style) */}
  <Pressable style={[styles.fab, styles.logoutFab]} onPress={handleLogout}>
    <View style={styles.logoutWrapper}>
      <Ionicons name="log-out-outline" size={26} color="#3BA7FF" />
    </View>
  </Pressable>
</View>

      </SafeAreaView>
    </LinearGradient>
  );
};

export default Instruments;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10 },
  header: { alignItems: "center", marginBottom: 14 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1F3C88",
  },
  subtitle: {
    fontSize: 15,
    color: "#497B9B",
    marginTop: 4,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 18,
    borderRadius: 18,
    shadowColor: "#3BA7FF",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  instrumentName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  conditionBadge: {
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  conditionText: {
    color: "white",
    fontWeight: "700",
    fontSize: 13,
  },
  dateText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 40,
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalItem: { paddingVertical: 12 },
  modalText: { fontSize: 16, fontWeight: "600" },
  fabContainer: {
    position: "absolute",
    bottom: 30,
    left: 250,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fabContainer: {
  position: "absolute",
  bottom: 30,
  left: 250,
  right: 30,
  flexDirection: "row",
  justifyContent: "space-between",
},
fab: {
  width: 60,
  height: 60,
  borderRadius: 30,
  shadowColor: "#3BA7FF",
  shadowOpacity: 0.2,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
},
fabGradient: {
  flex: 1,
  borderRadius: 30,
  justifyContent: "center",
  alignItems: "center",
},
logoutFab: {
  borderWidth: 2,
  borderColor: "#3BA7FF",
  backgroundColor: "white",
  justifyContent: "center",
  alignItems: "center",
},
logoutWrapper: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 30,
},

});
