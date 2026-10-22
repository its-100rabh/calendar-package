import React, { useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { format, Locale } from "date-fns";

import CalendarHeader from "./CalendarHeader";
import CalendarWeekDays from "./CalendarWeekDays";
import CalendarGrid from "./CalendarGrid";
import CalendarMonthGrid from "./CalendarMonthGrid";
import CalendarLegend from "./CalendarLegend";
import { useCalendar } from "./hooks/useCalendar";
import {
  CalendarEvent,
  CalendarDayData,
  CalendarTheme,
  CalendarLegendItem,
} from "./types";

export interface CalendarProps {
  initialDate?: Date;
  defaultSelectedDate?: Date | null;
  events?: CalendarEvent[];
  sayaDates?: string[];
  heavyDates?: string[];
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showLegend?: boolean;
  legendItems?: CalendarLegendItem[];
  onDateSelect?: (date: Date) => void;
  onMonthChange?: (year: number, month: number) => void;
  minDate?: Date;
  selectionMode?: "single" | "range";
  onDateRangeSelect?: (start: Date, end: Date) => void;
  defaultStartDate?: Date | null;
  defaultEndDate?: Date | null;
  /** Optional theme styling for the calendar */
  theme?: CalendarTheme;
  /** Optional date-fns locale for month and title formatting */
  locale?: Locale;
  /** Optional custom weekday labels (array of 7 strings starting from Sun) */
  weekDayNames?: string[];
  /** Optional custom month labels (array of 12 strings starting from Jan) */
  monthNames?: string[];
  /** Optional custom header icon renders */
  renderLeftHeaderIcon?: () => React.ReactNode;
  renderRightHeaderIcon?: () => React.ReactNode;
  /** Optional custom day content renderer */
  renderDayContent?: (dayData: CalendarDayData) => React.ReactNode;
  /** Optional custom event dot color resolver */
  getEventDotColor?: (event: CalendarEvent) => string;
  /** Outer container style */
  style?: ViewStyle;
}

export default function Calendar({
  initialDate,
  defaultSelectedDate,
  events,
  sayaDates,
  heavyDates,
  weekStartsOn = 0,
  showLegend = true,
  legendItems,
  onDateSelect,
  onMonthChange,
  minDate,
  selectionMode = "single",
  onDateRangeSelect,
  defaultStartDate,
  defaultEndDate,
  theme,
  locale,
  weekDayNames,
  monthNames,
  renderLeftHeaderIcon,
  renderRightHeaderIcon,
  renderDayContent,
  getEventDotColor,
  style,
}: CalendarProps) {
  const {
    currentMonth,
    days,
    startDate,
    endDate,
    viewMode,
    setSelectedDate,
    setStartDate,
    setEndDate,
    nextMonth,
    previousMonth,
    nextYear,
    previousYear,
    toggleViewMode,
    selectMonth,
  } = useCalendar({
    initialDate,
    defaultSelectedDate,
    events,
    sayaDates,
    heavyDates,
    weekStartsOn,
    minDate,
    selectionMode,
    defaultStartDate,
    defaultEndDate,
  });

  const handleDayPress = (date: Date) => {
    if (selectionMode === "single") {
      setSelectedDate(date);
      if (onDateSelect) {
        onDateSelect(date);
      }
    } else if (selectionMode === "range") {
      if (!startDate || (startDate && endDate)) {
        // Start a new range
        setStartDate(date);
        setEndDate(null);
      } else if (startDate && !endDate) {
        // If the selected date is before the start date, replace the start date
        if (date < startDate) {
          setStartDate(date);
        } else {
          // Set end date and fire callback
          setEndDate(date);
          if (onDateRangeSelect) {
            onDateRangeSelect(startDate, date);
          }
        }
      }
    }
  };

  const notifyMonthChange = (date: Date) => {
    if (onMonthChange) {
      onMonthChange(date.getFullYear(), date.getMonth() + 1);
    }
  };

  const handlePreviousMonth = () => {
    const prev = previousMonth();
    notifyMonthChange(prev);
  };

  const handleNextMonth = () => {
    const next = nextMonth();
    notifyMonthChange(next);
  };

  const handlePreviousYear = () => {
    const prev = previousYear();
    notifyMonthChange(prev);
  };

  const handleNextYear = () => {
    const next = nextYear();
    notifyMonthChange(next);
  };

  const handleSelectMonth = (monthIndex: number) => {
    selectMonth(monthIndex);
    if (onMonthChange) {
      onMonthChange(currentMonth.getFullYear(), monthIndex + 1);
    }
  };

  const isMonthMode = viewMode === "month";

  return (
    <View style={[styles.container, style]}>
      <CalendarHeader
        title={
          isMonthMode
            ? format(currentMonth, "MMMM yyyy", { locale })
            : format(currentMonth, "yyyy", { locale })
        }
        onPrevious={isMonthMode ? handlePreviousMonth : handlePreviousYear}
        onNext={isMonthMode ? handleNextMonth : handleNextYear}
        onTitlePress={toggleViewMode}
        theme={theme}
        renderLeftIcon={renderLeftHeaderIcon}
        renderRightIcon={renderRightHeaderIcon}
      />

      {isMonthMode ? (
        <>
          <CalendarWeekDays
            weekStartsOn={weekStartsOn}
            weekDayNames={weekDayNames}
            theme={theme}
          />
          <CalendarGrid
            days={days}
            onDayPress={handleDayPress}
            theme={theme}
            renderDayContent={renderDayContent}
            getEventDotColor={getEventDotColor}
          />
          {showLegend && (
            <CalendarLegend items={legendItems} theme={theme} />
          )}
        </>
      ) : (
        <CalendarMonthGrid
          onMonthSelect={handleSelectMonth}
          months={monthNames}
          theme={theme}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
  },
});
