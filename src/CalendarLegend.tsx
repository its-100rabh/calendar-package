import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { CalendarLegendItem, CalendarTheme } from "./types";

export interface CalendarLegendProps {
  items?: CalendarLegendItem[];
  theme?: CalendarTheme;
  containerStyle?: ViewStyle;
}

const DEFAULT_ITEMS: CalendarLegendItem[] = [
  { color: "#DC2626", label: "Booked" },
  { color: "#FFC800", label: "In Talks" },
  { color: "#16A34A", label: "Available" },
];

export default function CalendarLegend({
  items,
  theme,
  containerStyle,
}: CalendarLegendProps) {
  const renderItems = items || DEFAULT_ITEMS;
  const textColor = theme?.secondaryTextColor || theme?.primaryTextColor || "#52525B";

  return (
    <View style={[styles.container, containerStyle]}>
      {renderItems.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text
            style={[
              styles.label,
              { color: textColor, fontFamily: theme?.fontFamily },
            ]}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "400",
  },
});
