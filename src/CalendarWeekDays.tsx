import React from "react";
import { View, Text, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { CalendarTheme } from "./types";

export interface CalendarWeekDaysProps {
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  weekDayNames?: string[];
  theme?: CalendarTheme;
  containerStyle?: ViewStyle;
}

const DEFAULT_WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarWeekDays({
  weekStartsOn = 0,
  weekDayNames = DEFAULT_WEEK_DAYS,
  theme,
  containerStyle,
}: CalendarWeekDaysProps) {
  const daysList = weekDayNames.length === 7 ? weekDayNames : DEFAULT_WEEK_DAYS;

  const rotatedDays = [
    ...daysList.slice(weekStartsOn),
    ...daysList.slice(0, weekStartsOn),
  ];

  const textStyle: TextStyle = {
    fontSize: 14,
    fontWeight: "500",
    color: theme?.secondaryTextColor || theme?.primaryTextColor || "#52525B",
    fontFamily: theme?.fontFamily,
    ...theme?.weekDayTextStyle,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {rotatedDays.map((day, index) => (
        <View key={`${day}-${index}`} style={styles.dayColumn}>
          <Text style={textStyle}>{day}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dayColumn: {
    width: "14.28%",
    alignItems: "center",
    justifyContent: "center",
  },
});
