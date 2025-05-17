import styles from '../../styles/Component Styles/BookingBar.module.css';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isAfter, isBefore } from 'date-fns';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { enUS, bg } from 'date-fns/locale';


const BookingBar = ({ prefillCheckin }) => {
  const guestRef = useRef(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'bg' ? bg : enUS;

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

  const { t } = useTranslation('common');

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
  const router = useRouter();

  const handleBookClick = () => {
    const locale = router.locale || 'en';

    const checkInStr = checkIn ? format(checkIn, 'yyyy-MM-dd') : '';
    const checkOutStr = checkOut ? format(checkOut, 'yyyy-MM-dd') : '';

    const guestDetails = `${guests.adults} ${t('booking.adults')}, ${guests.children} ${t('booking.children')}, ${guests.infants} ${t('booking.infants')}`;

    router.push({
      pathname: '/contact',
      query: {
        checkIn: checkInStr,
        checkOut: checkOutStr,
        guests: guestDetails,
      },
    });
  };
  return (
    <div className={styles.bookingBarWrapper}>
      <div className={styles.bookingRow}>
        <div className={styles.field} onClick={() => {
          setShowCalendar(!showCalendar);
          setShowGuestOptions(false); // 👈 close guests when opening calendar
        }}>
          <label>{t('booking.checkin')}</label>
          <div className={styles.dateValue}>
            {checkIn ? format(checkIn, 'dd MMM yyyy', { locale: currentLocale }) : t('booking.select')}
          </div>

        </div>
        <div className={styles.field} onClick={() => {
          if (checkIn) {
            setShowCalendar(!showCalendar);
            setShowGuestOptions(false); // 👈 same here
          }
        }}>
          <label>{t('booking.checkout')}</label>
          <div className={styles.dateValue}>
            {checkOut ? format(checkOut, 'dd MMM yyyy', { locale: currentLocale }) : t('booking.select')}
          </div>

        </div>
        <div className={styles.field} onClick={() => {
          setShowGuestOptions(!showGuestOptions);
          setShowCalendar(false); // 👈 close calendar when opening guests
        }}>
          <label>{t('booking.guests')}</label>
          <div>{guests.adults} {t('booking.adults')}, {guests.children} {t('booking.children')}</div>
        </div>
        <button className={styles.bookButton} onClick={handleBookClick}>{t('booking.book')}</button>
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
            <label>{t('booking.children')}</label>
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
            <label>{t('booking.children')}</label>
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
            <label>{t('booking.infants')}</label>
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
            <input type="checkbox" disabled /> <label>{t('booking.pets')}</label>
            <div className={styles.infoText}>{t('booking.noPets')}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingBar;
