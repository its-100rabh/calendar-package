import { useState, useMemo } from "react";
import {
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfDay,
  isBefore,
  format,
} from "date-fns";
import { CalendarDayData, CalendarEvent } from "../types";

export interface UseCalendarProps {
  initialDate?: Date;
  defaultSelectedDate?: Date | null;
  events?: CalendarEvent[];
  sayaDates?: string[];
  heavyDates?: string[];
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 is Sunday
  minDate?: Date;
  selectionMode?: "single" | "range";
  defaultStartDate?: Date | null;
  defaultEndDate?: Date | null;
}

export function useCalendar({
  initialDate = new Date(),
  defaultSelectedDate = initialDate,
  events = [],
  sayaDates = [],
  heavyDates = [],
  weekStartsOn = 0,
  minDate,
  selectionMode = "single",
  defaultStartDate = null,
  defaultEndDate = null,
}: UseCalendarProps = {}) {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(initialDate));
  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultSelectedDate);
  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate);
  const [viewMode, setViewMode] = useState<"month" | "year">("month");

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

  const toggleViewMode = () => setViewMode((prev) => (prev === "month" ? "year" : "month"));

  const selectMonth = (monthIndex: number): Date => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthIndex);
    setCurrentMonth(newDate);
    setViewMode("month");
    return newDate;
  };

  const nextMonth = (): Date => {
    const next = addMonths(currentMonth, 1);
    setCurrentMonth(next);
    return next;
  };

  const previousMonth = (): Date => {
    const prev = subMonths(currentMonth, 1);
    setCurrentMonth(prev);
    return prev;
  };
  
  const nextYear = (): Date => {
    const next = addYears(currentMonth, 1);
    setCurrentMonth(next);
    return next;
  };

  const previousYear = (): Date => {
    const prev = subYears(currentMonth, 1);
    setCurrentMonth(prev);
    return prev;
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(startOfMonth(today));
    setSelectedDate(today);
  };

  const days: CalendarDayData[] = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn });

    const intervalDays = eachDayOfInterval({ start, end });
    const today = new Date();
    const sayaDateSet = new Set(sayaDates);
    const heavyDateSet = new Set(heavyDates);

    return intervalDays.map((date) => {
      const dayEvents = events.filter((e) => isSameDay(e.date, date));
      const isDisabled = minDate ? isBefore(startOfDay(date), startOfDay(minDate)) : false;
      const dateKey = format(date, "yyyy-MM-dd");

      let isRangeStart = false;
      let isRangeEnd = false;
      let isInRange = false;

      if (selectionMode === "range" && startDate) {
        if (isSameDay(date, startDate)) isRangeStart = true;
        if (endDate) {
          if (isSameDay(date, endDate)) isRangeEnd = true;
          if (!isBefore(startOfDay(date), startOfDay(startDate)) && !isBefore(startOfDay(endDate), startOfDay(date))) {
            isInRange = true;
          }
        } else {
          isInRange = isRangeStart;
        }
      }

      return {
        date,
        isToday: isSameDay(date, today),
        isSelected: selectionMode === "single" && selectedDate ? isSameDay(date, selectedDate) : false,
        isCurrentMonth: isSameMonth(date, currentMonth),
        disabled: isDisabled,
        events: dayEvents,
        isSayaDate: sayaDateSet.has(dateKey),
        isHeavyDate: heavyDateSet.has(dateKey),
        isRangeStart,
        isRangeEnd,
        isInRange,
      };
    });
  }, [currentMonth, selectedDate, events, sayaDates, heavyDates, weekStartsOn, minDate, selectionMode, startDate, endDate]);

  return {
    month,
    year,
    currentMonth,
    days,
    selectedDate,
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
    goToToday,
    toggleViewMode,
    selectMonth,
    setCurrentMonth,
  };
}
