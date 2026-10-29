import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
} from "react-native";

// Describe the moon data we want to display.
type MoonData = {
  phase: string;
  date: string;
};

export default function Index() {
  const [moon, setMoon] = useState<MoonData | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function getMoonPhase(date: Date) {
    try {
      setLoading(true);
      setError("");

      // Format the selected date for the API request.
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const apiDate = `${year}-${month}-${day}`;

      // Format the date for display on the screen.
      const displayDate = date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      // Request moon phase information for the selected date.
      const response = await fetch(
        `https://aa.usno.navy.mil/api/rstt/oneday?date=${apiDate}&coords=42.1103,-88.0342&tz=-5&dst=true`,
      );

      if (!response.ok) {
        throw new Error("Could not retrieve moon data.");
      }

      // Convert the JSON response into a JavaScript object.
      const data = await response.json();

      // Extract the moon phase from the nested JSON properties.
      setMoon({
        phase: data.properties.data.curphase,
        date: displayDate,
      });
    } catch (e) {
      setMoon(null);
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // Fetch today's moon phase when the screen first opens.
  useEffect(() => {
    getMoonPhase(selectedDate);
  }, []);

  // Move backward or forward by one calendar day.
  function changeDate(days: number) {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);

    setSelectedDate(newDate);
    getMoonPhase(newDate);
  }

  // Return to the current date.
  function returnToToday() {
    const today = new Date();
    setSelectedDate(today);
    getMoonPhase(today);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Tonight's Moon</Text>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : moon ? (
          <>
            <Text style={styles.moon}>🌙</Text>
            <Text style={styles.date}>{moon.date}</Text>
            <Text style={styles.phase}>{moon.phase}</Text>
          </>
        ) : null}

        <View style={styles.navigation}>
          <View style={styles.navButton}>
            <Button
              title="Previous Day"
              onPress={() => changeDate(-1)}
              disabled={loading}
            />
          </View>

          <View style={styles.navButton}>
            <Button
              title="Return to Today"
              onPress={returnToToday}
              disabled={loading}
            />
          </View>

          <View style={styles.navButton}>
            <Button
              title="Next Day"
              onPress={() => changeDate(1)}
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Style the screen's layout, spacing, and text.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECF6F8",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  moon: {
    fontSize: 64,
  },
  date: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  phase: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  navigation: {
    flexDirection: "row",
    width: "100%",
    gap: 1,
    marginTop: 12,
    alignItems: "center",
  },
  navButton: {
    flex: 1,
    transform: [{ scale: 1 }],
  },
});
