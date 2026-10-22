import React from "react";
import { View, Text, Pressable, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { CalendarTheme } from "./types";

export interface CalendarMonthGridProps {
  onMonthSelect: (index: number) => void;
  months?: string[];
  theme?: CalendarTheme;
  containerStyle?: ViewStyle;
}

const DEFAULT_MONTHS = [
  "JAN", "FEB", "MAR",
  "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP",
  "OCT", "NOV", "DEC",
];

export default function CalendarMonthGrid({
  onMonthSelect,
  months = DEFAULT_MONTHS,
  theme,
  containerStyle,
}: CalendarMonthGridProps) {
  const primaryTextColor = theme?.primaryTextColor || "#18181B";

  const monthItemStyle: ViewStyle = {
    width: "30%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    ...theme?.monthGridItemStyle,
  };

  const monthTextStyle: TextStyle = {
    fontSize: 16,
    fontWeight: "500",
    color: primaryTextColor,
    fontFamily: theme?.fontFamily,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {months.map((month, index) => (
        <Pressable
          key={month}
          onPress={() => onMonthSelect(index)}
          style={monthItemStyle}
          accessibilityRole="button"
          accessibilityLabel={month}
        >
          <Text style={monthTextStyle}>{month}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 8,
  },
});
