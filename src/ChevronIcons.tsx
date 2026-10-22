import React from "react";
import { View, StyleSheet } from "react-native";

export function DefaultChevronLeft({ size = 20, color = "#18181B" }: { size?: number; color?: string }) {
  const borderWidth = Math.max(2, Math.round(size / 9));
  const innerSize = Math.round(size * 0.45);
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.chevron,
          {
            width: innerSize,
            height: innerSize,
            borderLeftWidth: borderWidth,
            borderBottomWidth: borderWidth,
            borderColor: color,
            transform: [{ rotate: "45deg" }, { translateX: 2 }],
          },
        ]}
      />
    </View>
  );
}

export function DefaultChevronRight({ size = 20, color = "#18181B" }: { size?: number; color?: string }) {
  const borderWidth = Math.max(2, Math.round(size / 9));
  const innerSize = Math.round(size * 0.45);
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.chevron,
          {
            width: innerSize,
            height: innerSize,
            borderTopWidth: borderWidth,
            borderRightWidth: borderWidth,
            borderColor: color,
            transform: [{ rotate: "45deg" }, { translateX: -2 }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  chevron: {
    backgroundColor: "transparent",
  },
});
