import { useState, useEffect } from "react";
import {
    format,
    addMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isToday
} from "date-fns";
import { parseISO } from "date-fns";
import { useRouter } from "next/router";
import { enUS, bg } from "date-fns/locale";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styles from "../styles/Page Styles/AvailableDates.module.css";
import Meta from "@/components/Page Components/Meta";
import PageTitle from "@/components/Page Components/PageTitle";

const generateDays = (startDate, months = 1) => {
    const days = [];
    for (let i = 0; i < months; i++) {
        const firstDay = startOfMonth(addMonths(startDate, i));
        const lastDay = endOfMonth(firstDay);
        days.push(eachDayOfInterval({ start: firstDay, end: lastDay }));
    }
    return days;
};

const AvailableDates = () => {
    const [availableDates, setAvailableDates] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t } = useTranslation("common");
    const { i18n } = useTranslation();
    const selectedMonth = router.query.month;

    useEffect(() => {
        const loadDates = async () => {
            try {
                console.log("Attempting to fetch booking data...");
                const res = await fetch("/api/load-bookings");

                if (!res.ok) {
                    console.error("Network response was not ok:", res.status);
                    return;
                }

                const result = await res.json();
                console.log("Data fetched from /api/load-bookings:", result);

                if (result.success) {
                    const dates = Object.entries(result.bookedDates)
                        .map(([date]) => date);

                    console.log("Available dates:", dates);
                    setAvailableDates(dates);
                } else {
                    console.warn("Server responded with error:", result.error);
                }
            } catch (error) {
                console.error("Error loading booking data:", error);
            }
        };

        loadDates();
    }, []);

    useEffect(() => {
        if (selectedMonth) {
            const locale = i18n.language === "bg" ? bg : enUS;
            const monthNames = Array.from({ length: 12 }, (_, i) =>
                format(new Date(2025, i, 1), "LLLL", { locale })
            );

            const monthIndex = monthNames.findIndex(
                name => name.toLowerCase() === selectedMonth.toLowerCase()
            );

            if (monthIndex >= 0) {
                const newMonth = new Date(new Date().getFullYear(), monthIndex, 1);
                setCurrentMonth(newMonth);
            }
        }
    }, [selectedMonth, i18n.language]);

    const days = generateDays(currentMonth);

    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handlePrevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));

    const isAvailable = (date) => {
        return !availableDates.includes(format(date, "yyyy-MM-dd"));
    };

    const handleDateClick = (date) => {
        const formattedDate = format(date, "yyyy-MM-dd");
        setLoading(true);
        setTimeout(() => {
            router.push(`/?checkin=${formattedDate}`);
        }, 1500);
    };

    return (
        <>
            <Meta title={t("available.title")} />
            <div className={styles.calendarContainer}>
                <div className={styles.calendarHeader}>
                    <button className={styles.calendarButton} onClick={handlePrevMonth}>&lt;</button>
                    <h2 className={styles.header}>
                        {format(currentMonth, "MMMM yyyy", { locale: i18n.language === "bg" ? bg : enUS })}
                    </h2>
                    <button className={styles.calendarButton} onClick={handleNextMonth}>&gt;</button>
                </div>

                {days.map((monthDays, index) => (
                    <div
                        key={index}
                        id={format(monthDays[0], "LLLL", { locale: i18n.language === "bg" ? bg : enUS })}
                        className={styles.monthContainer}
                    >
                        <div className={styles.weekdays}>
                            {t("available.weekdays", { returnObjects: true }).map((day, i) => (
                                <div key={i} className={styles.weekday}>{day}</div>
                            ))}
                        </div>

                        <div className={styles.dayGrid}>
                            {(() => {
                                const firstDayOfMonth = monthDays[0];
                                const weekdayIndex = (firstDayOfMonth.getDay() + 6) % 7;
                                const placeholders = Array.from({ length: weekdayIndex });

                                return (
                                    <>
                                        {placeholders.map((_, i) => (
                                            <div key={`empty-${i}`} className={styles.emptyDay}></div>
                                        ))}
                                        {monthDays.map((day) => {
                                            const isPastDay = day < new Date(new Date().setHours(0, 0, 0, 0));
                                            return (
                                                <div
                                                    key={day.toString()}
                                                    className={`
                            ${styles.day}
                            ${isAvailable(day) ? styles.available : ""}
                            ${isToday(day) ? styles.today : ""}
                            ${isPastDay ? styles.pastDay : ""}
                          `}
                                                    onClick={() => isAvailable(day) && handleDateClick(day)}
                                                >
                                                    {format(day, "d")}
                                                </div>
                                            );
                                        })}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.legendContainer}>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.todayColor}`}></div>
                    <span>{t("available.legend.today")}</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.availableColor}`}></div>
                    <span>{t("available.legend.available")}</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.unavailableColor}`}></div>
                    <span>{t("available.legend.unavailable")}</span>
                </div>
            </div>

            {loading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingPopup}>
                        <div className={styles.spinner}></div>
                        <p>{t("available.loading")}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default AvailableDates;

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
        },
    };
}
