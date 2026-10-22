# @its-100rabh/react-native-event-calendar

A high-performance, lightweight, customizable event and booking calendar component for React Native and Expo applications.

Originally extracted from **EaseYourEvent**, this package provides single-date and date-range selection, event dot indicators, heavy-date glowing ring animations, auspicious date borders, month-to-year view transitions, customizable weekday and month labels, and complete theme customization with pure React Native StyleSheet rendering.

---

## Features

- 📅 **Month & Year Views:** Smooth navigation with previous/next controls, jump-to-month grid, and year view toggle.
- 🎯 **Selection Modes:** Supports both `"single"` date and `"range"` (start and end date) selection with visual connector ribbons.
- 🔴 **Event Indicators:** Multi-event status dots supporting built-in statuses (`BOOKED`, `AVAILABLE`, `IN_PROGRESS`, `PRESENT`, `LATE`, `ABSENT`) or custom string types and custom colors.
- ✨ **Animated Heavy Date Highlight:** Smooth looping pulse and glowing ring for high-demand or peak dates.
- 🪔 **Saya Dates:** Dedicated border styling for auspicious dates.
- 🎨 **Deep Theming:** Easily customize brand colors, background fills, text colors, fonts, header styles, and day styles.
- 🌐 **Localization & i18n:** Compatible with `date-fns/locale` and custom weekday and month names.
- ⚡ **Pure React Native Styles:** No Tailwind or NativeWind runtime required; works out of the box in React Native CLI and Expo.

---

## Installation

```bash
npm install @its-100rabh/react-native-event-calendar
# or with yarn
yarn add @its-100rabh/react-native-event-calendar
```

> [!NOTE]
> `date-fns` is bundled as a direct dependency of `@its-100rabh/react-native-event-calendar`. You only need to install `date-fns` directly if your application explicitly imports `date-fns` modules (such as custom `Locale` objects).

### Peer Dependencies

Make sure `react` and `react-native` are installed in your React Native or Expo project:

```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.70.0"
  }
}
```

---

## Quick Start

```tsx
import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import {
  Calendar,
  CalendarEvent,
} from "@its-100rabh/react-native-event-calendar";

export default function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const sampleEvents: CalendarEvent[] = [
    { type: "BOOKED", date: new Date(), shift: "MORNING" },
    { type: "AVAILABLE", date: new Date(), shift: "EVENING" },
  ];

  return (
    <View style={styles.container}>
      <Calendar
        initialDate={new Date()}
        defaultSelectedDate={selectedDate}
        events={sampleEvents}
        sayaDates={["2026-11-15", "2026-11-20"]}
        heavyDates={["2026-11-20"]}
        onDateSelect={(date) => {
          setSelectedDate(date);
          console.log("Selected date:", date);
        }}
        onMonthChange={(year, month) => {
          console.log(`Navigated to: ${year}-${month}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F3F3F1",
  },
});
```

---

## Selection Modes

### Single Date Selection

Single date selection is the default mode (`selectionMode="single"`).

```tsx
<Calendar
  selectionMode="single"
  defaultSelectedDate={new Date()}
  onDateSelect={(date) => console.log("Selected:", date)}
/>
```

### Date Range Selection

In range mode (`selectionMode="range"`), tapping consecutive dates selects the start and end of a date span with connector ribbons.

```tsx
import React, { useState } from "react";
import { Calendar } from "@its-100rabh/react-native-event-calendar";

export default function RangeExample() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  );

  return (
    <Calendar
      selectionMode="range"
      defaultStartDate={startDate}
      defaultEndDate={endDate}
      onDateRangeSelect={(start, end) => {
        setStartDate(start);
        setEndDate(end);
        console.log("Selected span:", start, "to", end);
      }}
    />
  );
}
```

---

## Events and Date Indicators

### Multi-Event Dot Indicators

Each day displays up to 3 colored dots below the date number. Supported built-in types include `BOOKED`, `AVAILABLE`, `IN_PROGRESS`, `PRESENT`, `LATE`, and `ABSENT`. You can also supply custom event types with explicit colors:

```tsx
import { Calendar, CalendarEvent } from "@its-100rabh/react-native-event-calendar";

const events: CalendarEvent[] = [
  {
    type: "BOOKED",
    date: new Date(2026, 10, 15),
    shift: "MORNING",
    title: "Grand Banquet Hall",
  },
  {
    type: "SPECIAL_VIP",
    color: "#8B5CF6", // Custom purple dot
    date: new Date(2026, 10, 15),
    title: "VIP Keynote",
  },
];

<Calendar
  events={events}
  getEventDotColor={(event) => event.color || "#EF4444"}
/>
```

### Saya Dates & Heavy Dates

- **`sayaDates`**: Array of formatted `yyyy-MM-dd` date strings. Highlighted with a styled border (typically auspicious dates).
- **`heavyDates`**: Array of formatted `yyyy-MM-dd` date strings. Displays an animated glowing pulse ring for high-demand dates.

```tsx
<Calendar
  sayaDates={["2026-11-08", "2026-11-15", "2026-11-22"]}
  heavyDates={["2026-11-15", "2026-11-24"]}
/>
```

---

## Theming

Customize colors, typography, and borders using the `theme` prop:

```tsx
import { Calendar, CalendarTheme } from "@its-100rabh/react-native-event-calendar";

const customTheme: CalendarTheme = {
  primaryColor: "#0284C7",
  primaryTextColor: "#0F172A",
  secondaryTextColor: "#475569",
  mutedTextColor: "#94A3B8",
  selectedTextColor: "#FFFFFF",
  selectedBackgroundColor: "#0284C7",
  todayBackgroundColor: "rgba(2, 132, 199, 0.12)",
  rangeBackgroundColor: "rgba(2, 132, 199, 0.2)",
  heavyDateGlowColor: "#F59E0B",
  sayaBorderColor: "#0284C7",
  fontFamily: "Inter-Medium",
};

<Calendar
  theme={customTheme}
  legendItems={[
    { color: "#EF4444", label: "Confirmed" },
    { color: "#F59E0B", label: "Pending" },
    { color: "#10B981", label: "Open" },
  ]}
/>
```

---

## Localization & Customization

### First Day of the Week

Set `weekStartsOn` (`0` = Sunday, `1` = Monday, ..., `6` = Saturday):

```tsx
<Calendar weekStartsOn={1} /> // Week starts on Monday
```

### Custom Weekday & Month Names

Override default labels or use `date-fns/locale`:

```tsx
import { hi } from "date-fns/locale";

<Calendar
  locale={hi}
  weekDayNames={["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"]}
  monthNames={[
    "जन", "फर", "मार्च", "अप्रै", "मई", "जून",
    "जुला", "अग", "सितं", "अक्टू", "नवं", "दिसं"
  ]}
/>
```

### Custom Header Arrows

```tsx
<Calendar
  renderLeftHeaderIcon={() => <MyCustomLeftIcon />}
  renderRightHeaderIcon={() => <MyCustomRightIcon />}
/>
```

---

## API Reference

### `<Calendar />` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `initialDate` | `Date` | `new Date()` | Initial reference date for month display |
| `defaultSelectedDate` | `Date \| null` | `initialDate` | Initially selected date in single mode |
| `events` | `CalendarEvent[]` | `[]` | Array of events used to render status indicator dots |
| `sayaDates` | `string[]` | `[]` | Formatted `yyyy-MM-dd` date strings with auspicious border styling |
| `heavyDates` | `string[]` | `[]` | Formatted `yyyy-MM-dd` date strings with animated pulsing ring |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` (Sunday) | Starting day of the week |
| `selectionMode` | `"single" \| "range"` | `"single"` | Date selection mode |
| `onDateSelect` | `(date: Date) => void` | `undefined` | Callback fired when a date is selected in single mode |
| `onDateRangeSelect` | `(start: Date, end: Date) => void` | `undefined` | Callback fired when range start and end dates are selected |
| `defaultStartDate` | `Date \| null` | `null` | Initial start date for range mode |
| `defaultEndDate` | `Date \| null` | `null` | Initial end date for range mode |
| `onMonthChange` | `(year: number, month: number) => void` | `undefined` | Callback fired on month navigation (`month` is 1-indexed, `1` to `12`) |
| `minDate` | `Date` | `undefined` | Disables dates prior to this date |
| `showLegend` | `boolean` | `true` | Toggle the legend beneath the calendar |
| `legendItems` | `CalendarLegendItem[]` | Default legend | Custom colors and labels for legend items |
| `theme` | `CalendarTheme` | Default theme | Theme styling overrides |
| `locale` | `Locale` (date-fns) | `undefined` | Optional `date-fns` locale for header formatting |
| `weekDayNames` | `string[]` | `["Sun", ...]` | Custom 7-day weekday string labels (starting from Sunday) |
| `monthNames` | `string[]` | `["JAN", ...]` | Custom 12-month string labels for year-grid view |
| `renderLeftHeaderIcon` | `() => ReactNode` | Built-in chevron | Custom left navigation arrow renderer |
| `renderRightHeaderIcon` | `() => ReactNode` | Built-in chevron | Custom right navigation arrow renderer |
| `renderDayContent` | `(dayData: CalendarDayData) => ReactNode` | `undefined` | Custom renderer for individual day cells |
| `getEventDotColor` | `(event: CalendarEvent) => string` | `undefined` | Custom color resolver for event dots |
| `style` | `ViewStyle` | `undefined` | Style override for outer calendar container |

---

## Standalone Hook: `useCalendar`

For headless calendar layouts, you can use the `useCalendar` hook directly:

```tsx
import { useCalendar } from "@its-100rabh/react-native-event-calendar";

const {
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
} = useCalendar({
  initialDate: new Date(),
  selectionMode: "single",
});
```

---

## Compatibility

| Platform / Tool | Supported Version |
| :--- | :--- |
| **React** | `>= 18.0.0` |
| **React Native** | `>= 0.70.0` |
| **Expo SDK** | SDK 49, 50, 51, 52, 57+ |
| **TypeScript** | `>= 5.0.0` |

---

## License

MIT © EaseYourEvent
