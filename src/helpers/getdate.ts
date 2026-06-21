import Option from "../interface/OptionInterface";

export class GetDate {
    static getListMonth(): Option[] {
        const months = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];
        return months.map((month, i) => ({
            label: month,
            value: String(i + 1),
        }));
    }

    static getListYear(): Option[] {
        return Array.from(
            { length: new Date().getFullYear() - 2026 + 1 },
            (_, i) => {
                return {
                    label: (2026 + i).toString(),
                    value: (2026 + i).toString()
                }
            },
        );
    }
}