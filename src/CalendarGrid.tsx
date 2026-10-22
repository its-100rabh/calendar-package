import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import CalendarDay from "./CalendarDay";
import { CalendarDayData, CalendarEvent, CalendarTheme } from "./types";

export interface CalendarGridProps {
  days: CalendarDayData[];
  onDayPress: (date: Date) => void;
  theme?: CalendarTheme;
  renderDayContent?: (dayData: CalendarDayData) => React.ReactNode;
  getEventDotColor?: (event: CalendarEvent) => string;
  gridStyle?: ViewStyle;
}

export default function CalendarGrid({
  days,
  onDayPress,
  theme,
  renderDayContent,
  getEventDotColor,
  gridStyle,
}: CalendarGridProps) {
  return (
    <View style={[styles.grid, gridStyle]}>
      {days.map((item) => (
        <View key={item.date.toISOString()} style={styles.cell}>
          <CalendarDay
            {...item}
            onPress={onDayPress}
            theme={theme}
            renderDayContent={renderDayContent}
            getEventDotColor={getEventDotColor}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cell: {
    width: "14.28%",
    marginBottom: 4,
  },
});
