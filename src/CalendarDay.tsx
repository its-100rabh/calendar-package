import React, { useEffect, useRef } from "react";
import {
  Pressable,
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import { format } from "date-fns";
import { CalendarDayData, CalendarEvent, CalendarTheme } from "./types";

export interface CalendarDayProps extends CalendarDayData {
  onPress: (date: Date) => void;
  theme?: CalendarTheme;
  renderDayContent?: (dayData: CalendarDayData) => React.ReactNode;
  getEventDotColor?: (event: CalendarEvent) => string;
}

const DEFAULT_DOT_COLORS: Record<string, string> = {
  BOOKED: "#EF4444",
  IN_PROGRESS: "#FFC800",
  AVAILABLE: "#16A34A",
  PRESENT: "#16A34A",
  LATE: "#F97316",
  ABSENT: "#EF4444",
};

export default function CalendarDay({
  date,
  isToday,
  isSelected,
  isCurrentMonth,
  disabled,
  events,
  isSayaDate,
  isHeavyDate,
  isRangeStart,
  isRangeEnd,
  isInRange,
  onPress,
  theme,
  renderDayContent,
  getEventDotColor,
}: CalendarDayProps) {
  const isSelectedStyle = isSelected || isRangeStart || isRangeEnd;

  // Glowing circular ring animation for heavy dates
  const glowScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (!isHeavyDate) return;

    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(glowScale, {
            toValue: 1.14,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowScale, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.25,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.85,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulse.start();

    return () => pulse.stop();
  }, [isHeavyDate, glowScale, glowOpacity]);

  if (renderDayContent) {
    return (
      <Pressable disabled={disabled} onPress={() => onPress(date)}>
        {renderDayContent({
          date,
          isToday,
          isSelected,
          isCurrentMonth,
          disabled,
          events,
          isSayaDate,
          isHeavyDate,
          isRangeStart,
          isRangeEnd,
          isInRange,
        })}
      </Pressable>
    );
  }

  // Theme resolution
  const primaryBrand = theme?.primaryColor || "#7A1F1F";
  const selectedBg = theme?.selectedBackgroundColor || primaryBrand;
  const selectedText = theme?.selectedTextColor || "#FFFFFF";
  const todayBg = theme?.todayBackgroundColor || "rgba(122, 31, 31, 0.1)";
  const rangeBg = theme?.rangeBackgroundColor || "rgba(122, 31, 31, 0.2)";
  const sayaBorder = theme?.sayaBorderColor || primaryBrand;
  const glowColor = theme?.heavyDateGlowColor || "#F97316";

  const textColor = isSelectedStyle
    ? selectedText
    : !isCurrentMonth
    ? (theme?.mutedTextColor || "#868692")
    : (theme?.primaryTextColor || "#18181B");

  const dayNumberTextStyle: TextStyle = {
    fontSize: 16,
    fontWeight: isSelectedStyle ? "600" : "400",
    color: textColor,
    fontFamily: theme?.fontFamily,
    ...theme?.dayTextStyle,
  };

  // Determine container styles
  const pressableStyles: ViewStyle[] = [styles.dayPressable];

  if (isSelectedStyle) {
    pressableStyles.push({ backgroundColor: selectedBg });
  } else if (isToday && !isSayaDate) {
    pressableStyles.push({ backgroundColor: todayBg });
  }

  if (isSayaDate && !isSelectedStyle) {
    pressableStyles.push({ borderWidth: 1, borderColor: sayaBorder });
  }

  if (disabled) {
    pressableStyles.push({ opacity: 0.3 });
  }

  const resolveDotColor = (event: CalendarEvent) => {
    if (getEventDotColor) return getEventDotColor(event);
    if (event.color) return event.color;
    return DEFAULT_DOT_COLORS[event.type] || primaryBrand;
  };

  return (
    <View style={styles.container}>
      {/* Range connector ribbon */}
      {isInRange && (
        <View
          style={[
            styles.rangeConnector,
            { backgroundColor: rangeBg },
            isRangeStart && isRangeEnd
              ? styles.rangeHidden
              : isRangeStart
              ? styles.rangeStartOnly
              : isRangeEnd
              ? styles.rangeEndOnly
              : styles.rangeFull,
          ]}
        />
      )}

      {/* Animated Glowing Ring for Heavy Dates */}
      {isHeavyDate && !isSelectedStyle && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glowRing,
            {
              borderColor: glowColor,
              shadowColor: glowColor,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />
      )}

      <Pressable
        disabled={disabled}
        onPress={() => onPress(date)}
        style={pressableStyles}
        accessibilityRole="button"
        accessibilityLabel={format(date, "MMMM d, yyyy")}
      >
        <Text style={dayNumberTextStyle}>{format(date, "d")}</Text>

        {events.length > 0 && (
          <View style={styles.dotsRow}>
            {events.slice(0, 3).map((event, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index > 0 && styles.dotMargin,
                  { backgroundColor: resolveDotColor(event) },
                ]}
              />
            ))}
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  rangeConnector: {
    position: "absolute",
    top: 0,
    bottom: 0,
  },
  rangeHidden: {
    left: "50%",
    right: "50%",
    opacity: 0,
  },
  rangeStartOnly: {
    left: "50%",
    right: 0,
  },
  rangeEndOnly: {
    left: 0,
    right: "50%",
  },
  rangeFull: {
    left: 0,
    right: 0,
  },
  glowRing: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    backgroundColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 7,
    elevation: 4,
    zIndex: 1,
  },
  dayPressable: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    aspectRatio: 1,
    width: "100%",
    maxWidth: 50,
    maxHeight: 50,
    position: "relative",
    zIndex: 10,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotMargin: {
    marginLeft: 3,
  },
});
