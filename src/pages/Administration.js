import { useState, useEffect } from 'react';
import styles from '../styles/Page Styles/Administration.module.css';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  isBefore,
} from 'date-fns';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';



const Administration = () => {
  const [dates, setDates] = useState([]);
  const [bookedDates, setBookedDates] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    const today = new Date();
    const generatedDates = [];
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + 5);

    for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      generatedDates.push(dateStr);
    }
    setDates(generatedDates);
  }, []);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const res = await fetch('/api/load-bookings');
        const data = await res.json();
        if (data.success) {
          setBookedDates(data.bookedDates);
        }
      } catch (err) {
        console.error('Failed to load bookings:', err);
      }
    };

    fetchBookedDates();
  }, []);

  const toggleBooked = (date) => {
    setBookedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const handleSave = async () => {
  try {
    const bookingsToSave = dates.map((date) => ({
      date,
      isBooked: bookedDates[date] || false,
    }));

    const response = await fetch('/api/save-bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookings: bookingsToSave }),
    });

    const result = await response.json();

    if (result.success) {
      alert('Запазено!');
    } else {
      const message = result.error || 'Failed to save booking data.';
      alert(`Грешка: ${message}`);
    }
  } catch (err) {
    alert(`Network error: ${err.message}`);
  }
};


  const getCalendarData = () => {
    const calendarMap = {};
    dates.forEach((dateStr) => {
      const date = new Date(dateStr);
      const key = format(date, 'MMMM yyyy');
      if (!calendarMap[key]) {
        const monthStart = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
        const monthEnd = endOfMonth(date);
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
        calendarMap[key] = days;
      }
    });
    return calendarMap;
  };

  const calendarData = getCalendarData();

  const handleLogin = () => {
    const envUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const envPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (usernameInput === envUsername && passwordInput === envPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect credentials');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <h1>Вход за Настройване</h1>
        <input
          type="text"
          placeholder="Потребителско Име"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
        />
        <input
          type="password"
          placeholder="Парола"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className={styles.calendarContainer}>
<h1 className={styles.heading}>Настройка на дати</h1>

      {Object.entries(calendarData).map(([month, days]) => (
        <div key={month} className={styles.monthSection}>
          <h2>{month}</h2>
          <div className={styles.calendarGrid}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className={styles.dayHeader}>{d}</div>
            ))}
            {days.map((day) => {
              const dayStr = day.toISOString().split('T')[0];
              const isPast = isBefore(day, new Date());
              return (
                <div key={dayStr} className={styles.dayCell}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={bookedDates[dayStr] || false}
                      onChange={() => toggleBooked(dayStr)}
                      disabled={isPast}
                    />
                    <span className={styles.dayLabel}>{day.getDate()}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}

<div className={styles.buttonContainer}>
  <button className={styles.saveButton} onClick={handleSave}>Запази</button>
</div>
    </div>
  );
};

export default Administration;
export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}