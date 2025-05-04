import styles from '../../styles/Component Styles/BookingBar.module.css';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isAfter, isBefore } from 'date-fns';
import { bg } from 'date-fns/locale';
import React, { useState, useEffect, useRef } from 'react';




const BookingBar = ({ prefillCheckin }) => {
  const guestRef = useRef(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (guestRef.current && !guestRef.current.contains(event.target)) {
        setShowGuestOptions(false);
      }
    };

    if (showGuestOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showGuestOptions]);
  
  useEffect(() => {
    if (prefillCheckin) {
      const parsedDate = new Date(prefillCheckin);
      if (!isNaN(parsedDate)) {
        setCheckIn(parsedDate);
      }
    }
  }, [prefillCheckin]);
  

  const generateDays = (monthDate) => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    return eachDayOfInterval({ start, end });
  };

  const monthsToShow = [new Date(), addMonths(new Date(), 1)];

  const handleDayClick = (date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else if (isAfter(date, checkIn)) {
      setCheckOut(date);
      setShowCalendar(false);
    }
  };

  const isInRange = (date) => {
    if (checkIn && hoveredDate && !checkOut) {
      return isAfter(date, checkIn) && isBefore(date, hoveredDate);
    }
    return false;
  };

  return (
    <div className={styles.bookingBarWrapper}>
      <div className={styles.bookingRow}>
        <div className={styles.field} onClick={() => {
          setShowCalendar(!showCalendar);
          setShowGuestOptions(false); // 👈 close guests when opening calendar
        }}>
          <label>Настаняване</label>
          <div className={styles.dateValue}>
            {checkIn ? format(checkIn, 'dd MMM yyyy', { locale: bg }) : 'Изберете'}
          </div>

        </div>
        <div className={styles.field} onClick={() => {
          if (checkIn) {
            setShowCalendar(!showCalendar);
            setShowGuestOptions(false); // 👈 same here
          }
        }}>
          <label>Напускане</label>
          <div className={styles.dateValue}>
            {checkOut ? format(checkOut, 'dd MMM yyyy', { locale: bg }) : 'Изберете'}
          </div>

        </div>
        <div className={styles.field} onClick={() => {
          setShowGuestOptions(!showGuestOptions);
          setShowCalendar(false); // 👈 close calendar when opening guests
        }}>
          <label>Гости</label>
          <div>{guests.adults} Възрастни, {guests.children} Деца</div>
        </div>
        <button className={styles.bookButton}>Запази</button>
      </div>

      {showCalendar && (
        <div className={styles.calendarWrapper}>
          {monthsToShow.map((month, idx) => (
            <div className={styles.calendarMonth} key={idx}>
              <div className={styles.monthHeader}>{format(month, 'MMMM yyyy', { locale: bg })}</div>
              <div className={styles.dayGrid}>
                {generateDays(month).map((day) => (
                  <div
                    key={day}
                    className={`
                      ${styles.dayCell}
                      ${isSameDay(day, checkIn) ? styles.checkIn : ''}
                      ${isSameDay(day, checkOut) ? styles.checkOut : ''}
                      ${isInRange(day) ? styles.inRange : ''}
                    `}
                    onMouseEnter={() => setHoveredDate(day)}
                    onClick={() => handleDayClick(day)}
                  >
                    {format(day, 'd')}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showGuestOptions && (
        <div className={styles.guestOptions} ref={guestRef}>
          <div className={styles.guestRow}>
            <label>Възрастни</label>
            <div className={styles.stepper}>
              <button
                onClick={() =>
                  setGuests((prev) => ({
                    ...prev,
                    adults: Math.max(1, prev.adults - 1),
                  }))
                }
              >
                -
              </button>
              <span>{guests.adults}</span>
              <button
                onClick={() =>
                  setGuests((prev) => {
                    const total = prev.adults + prev.children;
                    if (prev.adults < 6 && total < 6) {
                      return { ...prev, adults: prev.adults + 1 };
                    }
                    return prev;
                  })
                }
                disabled={guests.adults >= 6 || guests.adults + guests.children >= 6}
              >
                +
              </button>
            </div>
          </div>
          <div className={styles.guestRow}>
            <label>Деца</label>
            <div className={styles.stepper}>
              <button
                onClick={() =>
                  setGuests((prev) => ({
                    ...prev,
                    children: Math.max(0, prev.children - 1),
                  }))
                }
              >
                -
              </button>
              <span>{guests.children}</span>
              <button
                onClick={() =>
                  setGuests((prev) => {
                    const total = prev.adults + prev.children;
                    if (prev.children < 5 && total < 6) {
                      return { ...prev, children: prev.children + 1 };
                    }
                    return prev;
                  })
                }
                disabled={guests.children >= 5 || guests.adults + guests.children >= 6}
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.guestRow}>
            <label>Бебета</label>
            <div className={styles.stepper}>
              <button
                onClick={() =>
                  setGuests((prev) => ({
                    ...prev,
                    infants: Math.max(0, prev.infants - 1),
                  }))
                }
              >
                -
              </button>
              <span>{guests.infants}</span>
              <button
                onClick={() =>
                  setGuests((prev) =>
                    prev.infants < 5
                      ? { ...prev, infants: prev.infants + 1 }
                      : prev
                  )
                }
                disabled={guests.infants >= 5}
              >
                +
              </button>
            </div>
          </div>
          <div className={styles.petsDisabled}>
            <input type="checkbox" disabled /> <label>Домашни Любимци</label>
            <div className={styles.infoText}>Не позволяваме домашни любимци все още.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingBar;
