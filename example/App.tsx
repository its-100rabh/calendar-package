import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
// IMPORT FROM PACKED NPM PACKAGE
import {
  Calendar,
  CalendarEvent,
  CalendarTheme,
  CalendarLegendItem,
} from "react-native-event-calendar";

export default function App() {
  const [activeTab, setActiveTab] = useState<"standard" | "range" | "custom">("standard");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 9, 15)); // Oct 15, 2026
  const [rangeStart, setRangeStart] = useState<Date | null>(new Date(2026, 9, 10));
  const [rangeEnd, setRangeEnd] = useState<Date | null>(new Date(2026, 9, 14));
  const [weekStartsOn, setWeekStartsOn] = useState<0 | 1>(0); // 0: Sun, 1: Mon
  const [currentMonthInfo, setCurrentMonthInfo] = useState<{ year: number; month: number }>({
    year: 2026,
    month: 10,
  });

  const handleMonthChange = React.useCallback((year: number, month: number) => {
    setCurrentMonthInfo((prev) => {
      if (prev.year === year && prev.month === month) return prev;
      return { year, month };
    });
  }, []);

  // Realistic sample event data for October & November 2026
  const sampleEvents: CalendarEvent[] = [
    { date: new Date(2026, 9, 5), type: "BOOKED", title: "Wedding Reception - Grand Hall" },
    { date: new Date(2026, 9, 5), type: "IN_PROGRESS", title: "Catering Setup" },
    { date: new Date(2026, 9, 12), type: "IN_PROGRESS", title: "Corporate Conference" },
    { date: new Date(2026, 9, 15), type: "BOOKED", title: "Sangeet Ceremony" },
    { date: new Date(2026, 9, 15), type: "AVAILABLE", title: "Lawn Slot Available" },
    { date: new Date(2026, 9, 20), type: "AVAILABLE", title: "Morning Slot Open" },
    { date: new Date(2026, 9, 24), type: "BOOKED", title: "Birthday Gala" },
    { date: new Date(2026, 9, 24), type: "BOOKED", title: "Evening Banquet" },
    { date: new Date(2026, 9, 28), type: "PRESENT", title: "Stage Rehearsal" },
    { date: new Date(2026, 10, 2), type: "BOOKED", title: "Annual Dinner" },
  ];

  // Auspicious/Saya Dates & High-Demand/Heavy Dates
  const sayaDates = ["2026-10-08", "2026-10-15", "2026-10-22", "2026-10-24", "2026-11-05"];
  const heavyDates = ["2026-10-15", "2026-10-24", "2026-11-02"];

  // Custom Legends
  const customLegends: CalendarLegendItem[] = [
    { color: "#DC2626", label: "Confirmed Booking" },
    { color: "#F59E0B", label: "Tentative / Hold" },
    { color: "#10B981", label: "Slot Open" },
  ];

  // Luxury Dark/Gold Theme for Tab 3
  const luxuryDarkTheme: CalendarTheme = {
    primaryColor: "#D97706",
    primaryTextColor: "#F3F4F6",
    secondaryTextColor: "#9CA3AF",
    mutedTextColor: "#4B5563",
    selectedTextColor: "#FFFFFF",
    selectedBackgroundColor: "#D97706",
    todayBackgroundColor: "rgba(217, 119, 6, 0.2)",
    rangeBackgroundColor: "rgba(217, 119, 6, 0.25)",
    heavyDateGlowColor: "#FBBF24",
    sayaBorderColor: "#F59E0B",
    headerTitleStyle: {
      color: "#F3F4F6",
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    monthGridItemStyle: {
      backgroundColor: "#1F2937",
    },
  };

  const formatDateStr = (d: Date | null) => {
    if (!d) return "None";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={activeTab === "custom" ? "light-content" : "dark-content"} />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          activeTab === "custom" && styles.darkBackground,
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.headerTitle,
              activeTab === "custom" && styles.darkTextPrimary,
            ]}
          >
            react-native-event-calendar
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              activeTab === "custom" && styles.darkTextSecondary,
            ]}
          >
            Independent Consumer Test App (Installed via npm pack tarball)
          </Text>
        </View>

        {/* Tab Switcher */}
        <View
          style={[
            styles.tabBar,
            activeTab === "custom" && styles.darkTabBar,
          ]}
        >
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "standard" && styles.tabButtonActive]}
            onPress={() => setActiveTab("standard")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "standard" && styles.tabTextActive,
                activeTab !== "standard" && activeTab === "custom" ? styles.darkTextSecondary : null,
              ]}
            >
              Standard Demo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "range" && styles.tabButtonActive]}
            onPress={() => setActiveTab("range")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "range" && styles.tabTextActive,
                activeTab !== "range" && activeTab === "custom" ? styles.darkTextSecondary : null,
              ]}
            >
              Range Selection
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "custom" && styles.tabButtonActive]}
            onPress={() => setActiveTab("custom")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "custom" && styles.tabTextActive,
              ]}
            >
              Themed & Custom
            </Text>
          </TouchableOpacity>
        </View>

        {/* Controls Bar */}
        <View
          style={[
            styles.controlsCard,
            activeTab === "custom" && styles.darkCard,
          ]}
        >
          <View style={styles.controlRow}>
            <Text
              style={[
                styles.controlLabel,
                activeTab === "custom" && styles.darkTextSecondary,
              ]}
            >
              Week Starts On:
            </Text>
            <TouchableOpacity
              style={styles.toggleBtn}
              onPress={() => setWeekStartsOn((prev) => (prev === 0 ? 1 : 0))}
            >
              <Text style={styles.toggleBtnText}>
                {weekStartsOn === 0 ? "Sunday (0)" : "Monday (1)"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statusRow}>
            <Text
              style={[
                styles.statusText,
                activeTab === "custom" && styles.darkTextSecondary,
              ]}
            >
              {activeTab === "range"
                ? `Range: ${formatDateStr(rangeStart)} → ${formatDateStr(rangeEnd)}`
                : `Selected Date: ${formatDateStr(selectedDate)}`}
            </Text>
            <Text
              style={[
                styles.statusSubtext,
                activeTab === "custom" && styles.darkTextSecondary,
              ]}
            >
              Current Month: {currentMonthInfo.year}-{String(currentMonthInfo.month).padStart(2, "0")}
            </Text>
          </View>
        </View>

        {/* Calendar Card */}
        <View
          style={[
            styles.calendarCard,
            activeTab === "custom" && styles.darkCard,
          ]}
        >
          {activeTab === "standard" && (
            <Calendar
              initialDate={new Date(2026, 9, 1)}
              defaultSelectedDate={selectedDate}
              selectionMode="single"
              onDateSelect={(d) => setSelectedDate(d)}
              onMonthChange={handleMonthChange}
              weekStartsOn={weekStartsOn}
              events={sampleEvents}
              sayaDates={sayaDates}
              heavyDates={heavyDates}
              showLegend={true}
              legendItems={customLegends}
            />
          )}

          {activeTab === "range" && (
            <Calendar
              initialDate={new Date(2026, 9, 1)}
              selectionMode="range"
              defaultStartDate={rangeStart}
              defaultEndDate={rangeEnd}
              onDateRangeSelect={(s, e) => {
                setRangeStart(s);
                setRangeEnd(e);
              }}
              onMonthChange={handleMonthChange}
              weekStartsOn={weekStartsOn}
              events={sampleEvents}
              sayaDates={sayaDates}
              heavyDates={heavyDates}
              showLegend={true}
              legendItems={customLegends}
            />
          )}

          {activeTab === "custom" && (
            <Calendar
              initialDate={new Date(2026, 9, 1)}
              defaultSelectedDate={selectedDate}
              selectionMode="single"
              onDateSelect={(d) => setSelectedDate(d)}
              onMonthChange={handleMonthChange}
              weekStartsOn={weekStartsOn}
              events={sampleEvents}
              sayaDates={sayaDates}
              heavyDates={heavyDates}
              theme={luxuryDarkTheme}
              showLegend={true}
              legendItems={[
                { color: "#D97706", label: "Booked (Gold)" },
                { color: "#FBBF24", label: "Peak Saya Date" },
                { color: "#10B981", label: "Available" },
              ]}
            />
          )}
        </View>

        {/* Feature Badges / Highlights */}
        <View
          style={[
            styles.infoCard,
            activeTab === "custom" && styles.darkCard,
          ]}
        >
          <Text
            style={[
              styles.infoTitle,
              activeTab === "custom" && styles.darkTextPrimary,
            ]}
          >
            Verified Package Features:
          </Text>
          <Text
            style={[
              styles.infoItem,
              activeTab === "custom" && styles.darkTextSecondary,
            ]}
          >
            ✨ Month / Year Header Navigation & View Toggle
          </Text>
          <Text
            style={[
              styles.infoItem,
              activeTab === "custom" && styles.darkTextSecondary,
            ]}
          >
            ✨ Single & Multi-Day Range Selection Modes
          </Text>
          <Text
            style={[
              styles.infoItem,
              activeTab === "custom" && styles.darkTextSecondary,
            ]}
          >
            ✨ Multi-Event Multi-Dot Indicators
          </Text>
          <Text
            style={[
              styles.infoItem,
              activeTab === "custom" && styles.darkTextSecondary,
            ]}
          >
            ✨ Saya Auspicious Borders & Heavy-Date Pulsing Glow
          </Text>
          <Text
            style={[
              styles.infoItem,
              activeTab === "custom" && styles.darkTextSecondary,
            ]}
          >
            ✨ Configurable First Day of Week (Sun / Mon)
          </Text>
          <Text
            style={[
              styles.infoItem,
              activeTab === "custom" && styles.darkTextSecondary,
            ]}
          >
            ✨ Dynamic Custom Theming & Legends
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F4F5",
  },
  scrollContainer: {
    padding: 16,
    paddingTop: Platform.OS === "android" ? 36 : 16,
  },
  darkBackground: {
    backgroundColor: "#111827",
  },
  header: {
    marginBottom: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#18181B",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#71717A",
    marginTop: 4,
    textAlign: "center",
  },
  darkTextPrimary: {
    color: "#F9FAFB",
  },
  darkTextSecondary: {
    color: "#9CA3AF",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#E4E4E7",
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  darkTabBar: {
    backgroundColor: "#1F2937",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  tabButtonActive: {
    backgroundColor: "#7A1F1F",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#52525B",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  controlsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  darkCard: {
    backgroundColor: "#1F2937",
    borderColor: "#374151",
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  controlLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3F3F46",
  },
  toggleBtn: {
    backgroundColor: "#7A1F1F",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  statusRow: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E4E4E7",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#18181B",
  },
  statusSubtext: {
    fontSize: 12,
    color: "#71717A",
    marginTop: 2,
  },
  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181B",
    marginBottom: 8,
  },
  infoItem: {
    fontSize: 12,
    color: "#52525B",
    lineHeight: 20,
  },
});
