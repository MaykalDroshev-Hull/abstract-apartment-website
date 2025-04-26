import { useState, useEffect } from "react";
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { bg } from "date-fns/locale"; // Bulgarian locale
import styles from "../styles/Page Styles/AvailableDates.module.css"; // Your styles
import { parseISO } from "date-fns"; // For converting date strings to Date objects

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
    const [currentMonth, setCurrentMonth] = useState(new Date()); // Tracks current month to display

    // Load booking data from the XML file
    useEffect(() => {
        const loadDates = async () => {
            try {
                const res = await fetch("/Data/booking.xml");
                const text = await res.text();

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(text, "application/xml");
                const bookings = Array.from(xmlDoc.getElementsByTagName("booking"));

                const dates = bookings
                    .filter(booking => booking.getElementsByTagName("isBooked")[0].textContent === "false")
                    .map(booking => booking.getElementsByTagName("date")[0].textContent);

                setAvailableDates(dates);
            } catch (error) {
                console.error("Error loading booking data:", error);
            }
        };

        loadDates();
    }, []);

    const days = generateDays(currentMonth);

    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const handlePrevMonth = () => {
        setCurrentMonth(addMonths(currentMonth, -1));
    };

    const isAvailable = (date) => {
        return availableDates.includes(format(date, "yyyy-MM-dd"));
    };

    return (
        <div className={styles.calendarContainer}>
            <div className={styles.calendarHeader}>
                <button className={styles.calendarButton} onClick={handlePrevMonth}>&lt;</button>
                <h2 className={styles.header}>{format(currentMonth, "MMMM yyyy", { locale: bg })}</h2>
                <button className={styles.calendarButton} onClick={handleNextMonth}>&gt;</button>

            </div>
            {days.map((monthDays, monthIndex) => (
                <div key={monthIndex} className={styles.monthContainer}>
                    <div className={styles.weekdays}>
                        {["П", "В", "С", "Ч", "П", "С", "Н"].map((day) => (
                            <div key={day} className={styles.weekday}>
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className={styles.dayGrid}>
                        {monthDays.map((day) => (
                            <div
                                key={day}
                                className={`${styles.day} ${isAvailable(day) ? styles.available : ''} ${isToday(day) ? styles.today : ''}`}
                            >
                                {format(day, "d")}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AvailableDates;
