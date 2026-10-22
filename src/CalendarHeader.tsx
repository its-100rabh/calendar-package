import React from "react";
import { View, Text, Pressable, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { DefaultChevronLeft, DefaultChevronRight } from "./ChevronIcons";
import { CalendarTheme } from "./types";

export interface CalendarHeaderProps {
  title: string;
  onPrevious: () => void;
  onNext: () => void;
  onTitlePress?: () => void;
  theme?: CalendarTheme;
  renderLeftIcon?: () => React.ReactNode;
  renderRightIcon?: () => React.ReactNode;
  headerStyle?: ViewStyle;
}

export default function CalendarHeader({
  title,
  onPrevious,
  onNext,
  onTitlePress,
  theme,
  renderLeftIcon,
  renderRightIcon,
  headerStyle,
}: CalendarHeaderProps) {
  const primaryTextColor = theme?.primaryTextColor || "#18181B";

  const titleStyle: TextStyle = {
    fontSize: 20,
    fontWeight: "600",
    color: primaryTextColor,
    fontFamily: theme?.fontFamily,
    ...theme?.headerTitleStyle,
  };

  return (
    <View style={[styles.container, headerStyle]}>
      <Pressable
        onPress={onPrevious}
        style={styles.iconButton}
        accessibilityRole="button"
        accessibilityLabel="Previous month"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {renderLeftIcon ? renderLeftIcon() : <DefaultChevronLeft size={20} color={primaryTextColor} />}
      </Pressable>

      <Pressable onPress={onTitlePress} accessibilityRole="button">
        <Text style={titleStyle}>{title}</Text>
      </Pressable>

      <Pressable
        onPress={onNext}
        style={styles.iconButton}
        accessibilityRole="button"
        accessibilityLabel="Next month"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {renderRightIcon ? renderRightIcon() : <DefaultChevronRight size={20} color={primaryTextColor} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
