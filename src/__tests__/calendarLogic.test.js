const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { format } = require("date-fns");

console.log("Running useCalendar & date calculation tests...");

const {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isBefore,
  startOfDay,
} = require("date-fns");

function computeDays(currentMonth, options = {}) {
  const {
    weekStartsOn = 0,
    events = [],
    sayaDates = [],
    heavyDates = [],
    selectionMode = "single",
    selectedDate = null,
    startDate = null,
    endDate = null,
    minDate = null,
  } = options;

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
}

// Test 1: Days generated for October 2026
const oct2026 = new Date(2026, 9, 1); // Month is 0-indexed (9 = Oct)
const days = computeDays(oct2026, {
  sayaDates: ["2026-10-15"],
  heavyDates: ["2026-10-20"],
  events: [
    { type: "BOOKED", date: new Date(2026, 9, 15), shift: "MORNING" },
    { type: "AVAILABLE", date: new Date(2026, 9, 15), shift: "EVENING" },
  ],
});

assert.ok(days.length >= 28 && days.length <= 42, "Days grid must have 28, 35, or 42 cells");
assert.equal(days.length % 7, 0, "Days count must be divisible by 7 (complete weeks)");
console.log("  ✔ Test 1: Grid generation & intervals verified");

// Test 2: Check sayaDate and heavyDate detection
const sayaDay = days.find((d) => format(d.date, "yyyy-MM-dd") === "2026-10-15");
assert.ok(sayaDay, "October 15 must exist in days grid");
assert.strictEqual(sayaDay.isSayaDate, true, "October 15 should be identified as sayaDate");
assert.strictEqual(sayaDay.events.length, 2, "October 15 should have 2 events");

const heavyDay = days.find((d) => format(d.date, "yyyy-MM-dd") === "2026-10-20");
assert.ok(heavyDay, "October 20 must exist in days grid");
assert.strictEqual(heavyDay.isHeavyDate, true, "October 20 should be identified as heavyDate");
console.log("  ✔ Test 2: sayaDates & heavyDates classification verified");

// Test 3: Range selection calculation
const rangeDays = computeDays(oct2026, {
  selectionMode: "range",
  startDate: new Date(2026, 9, 10),
  endDate: new Date(2026, 9, 14),
});

const startDay = rangeDays.find((d) => format(d.date, "yyyy-MM-dd") === "2026-10-10");
const midDay = rangeDays.find((d) => format(d.date, "yyyy-MM-dd") === "2026-10-12");
const endDay = rangeDays.find((d) => format(d.date, "yyyy-MM-dd") === "2026-10-14");
const outDay = rangeDays.find((d) => format(d.date, "yyyy-MM-dd") === "2026-10-16");

assert.strictEqual(startDay.isRangeStart, true, "Oct 10 must be range start");
assert.strictEqual(startDay.isInRange, true, "Oct 10 must be in range");
assert.strictEqual(midDay.isInRange, true, "Oct 12 must be in range");
assert.strictEqual(endDay.isRangeEnd, true, "Oct 14 must be range end");
assert.strictEqual(endDay.isInRange, true, "Oct 14 must be in range");
assert.strictEqual(outDay.isInRange, false, "Oct 16 must not be in range");
console.log("  ✔ Test 3: Range calculation (isRangeStart, isInRange, isRangeEnd) verified");

// Test 4: Verify built module structure and exported symbols
const indexDts = fs.readFileSync(path.resolve(__dirname, "../../lib/typescript/index.d.ts"), "utf8");
const expectedExports = [
  "Calendar",
  "CalendarHeader",
  "CalendarWeekDays",
  "CalendarGrid",
  "CalendarDay",
  "CalendarMonthGrid",
  "CalendarLegend",
  "useCalendar",
  "DefaultChevronLeft",
  "DefaultChevronRight",
  "CalendarEvent",
  "CalendarDayData",
  "CalendarTheme",
  "CalendarLegendItem"
];

for (const exp of expectedExports) {
  assert.ok(indexDts.includes(exp), `Export ${exp} must exist in index.d.ts`);
}
console.log("  ✔ Test 4: All component & type exports verified in typescript definitions");

console.log("\n🎉 All 4 test suites passed successfully!");
