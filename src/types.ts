import type { TextStyle, ViewStyle } from "react-native";

export type CalendarEventType =
  | "BOOKED"
  | "AVAILABLE"
  | "IN_PROGRESS"
  | "PRESENT"
  | "LATE"
  | "ABSENT"
  | string;

export type CalendarShift =
  | "MORNING"
  | "EVENING"
  | string;

export interface CalendarEvent {
  type: CalendarEventType;
  date: Date;
  shift?: CalendarShift;
  color?: string;
  [key: string]: any;
}

export interface CalendarDayData {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
  disabled: boolean;
  events: CalendarEvent[];
  isSayaDate?: boolean;
  isHeavyDate?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  isInRange?: boolean;
}

export interface CalendarTheme {
  primaryColor?: string;
  primaryTextColor?: string;
  secondaryTextColor?: string;
  mutedTextColor?: string;
  selectedTextColor?: string;
  selectedBackgroundColor?: string;
  todayBackgroundColor?: string;
  rangeBackgroundColor?: string;
  heavyDateGlowColor?: string;
  sayaBorderColor?: string;
  fontFamily?: string;
  headerTitleStyle?: TextStyle;
  dayTextStyle?: TextStyle;
  weekDayTextStyle?: TextStyle;
  monthGridItemStyle?: ViewStyle;
}

export interface CalendarLegendItem {
  color: string;
  label: string;
}
