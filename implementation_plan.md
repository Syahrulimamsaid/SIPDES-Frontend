# Two-Tab Presence Report Implementation Plan

Add a 2-tab layout to the Laporan (Report) management page. 
- **Tab 1: Rekap Bulanan** (Existing monthly presence reports).
- **Tab 2: Rekap Periode** (New presence reports grouped by month and user within a custom date range).

---

## User Review Required

> [!IMPORTANT]
> The backend `/report/presence` API only queries presence statistics on a monthly basis (`periode=Date`). For Tab 2, we will determine which months are spanned by the selected date range, fetch the monthly reports for each spanned month in parallel, and merge/flatten the reports. We will then present the rows grouped by month and user.

---

## Open Questions

None.

---

## Proposed Changes

### Operator Laporan Component

#### [MODIFY] [Index.tsx](file:///f:/My%20Project/React/SIPDES-Frontend/src/pages/Operator/Laporan/Index.tsx)

1. **Add Tab State**:
   - Add state `activeTab` with type `"bulanan" | "periode"`.
2. **Add Tab 2 States**:
   - `startDate` and `endDate` date strings (format: `YYYY-MM-DD`). Default `startDate` to the first day of the current month and `endDate` to today's date.
   - `rangeUserId` for filtering a specific user in Tab 2.
   - `rangeReport` data array of monthly presence summaries returned by the report API.
   - `currentRangePage` and `rangeItemsPerPage` for Tab 2 client-side pagination.
3. **Extend Fetching Logic**:
   - When in Tab 2 (`activeTab === "periode"`), find all months in the selected `startDate` to `endDate` range.
   - Fetch the monthly reports via `ReportController.presence(firstDayOfMonth, { userId: rangeUserId })` for all covered months in parallel.
   - Combine the reports, label each item with its Indonesian month-year string (e.g. `"Mei 2026"`), and sort them by month (descending) then user name (ascending).
4. **Update Cards Calculation**:
   - Dynamically compute average percentage, total presence, total late frequency, and total absent days based on the active tab's dataset (`report` for Tab 1, `rangeReport` for Tab 2).
5. **Render Tab Layout**:
   - Render tab buttons ("Rekap Bulanan" and "Rekap Periode") at the top.
   - Conditional rendering of the filters (Month/Year select inputs for Tab 1 vs. Start/End Date DatePickers for Tab 2).
   - Render the respective tables using the standard `<Table>` and pagination layout. Added a "Bulan/Periode" column in Tab 2's table.
6. **Polished Design**:
   - Utilize standard visual styles, responsive grids, and transitions matching the dark/light modes.

---

## Verification Plan

### Automated Tests
- Run `npm run build` or Vite build to verify typescript compiling and bundle compilation.

### Manual Verification
- Test selecting "Rekap Bulanan" and changing Month/Year/User filters to verify it functions as before.
- Test selecting "Rekap Periode", changing Start Date and End Date to span multiple months (e.g. May 1 to June 15), select specific user, and verify the correct monthly entries appear in the table.
- Test pagination and limit controls for both tabs.
- Verify statistics cards calculate correctly for both tabs.
