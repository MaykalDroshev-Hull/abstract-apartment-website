import { useEffect, useState } from "react";
import styles from "../styles/Page Styles/PriceList.module.css";
import Meta from '@/components/Page Components/Meta'
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

const currencies = [
    { code: "EUR", symbol: "€", rate: 1 },
    { code: "BGN", symbol: "лв", rate: 1.95 },
    { code: "GBP", symbol: "£", rate: 0.86 },
    { code: "CHF", symbol: "Fr", rate: 0.98 },
    { code: "SEK", symbol: "kr", rate: 11.2 },
    { code: "NOK", symbol: "kr", rate: 11.5 },
    { code: "DKK", symbol: "kr", rate: 7.45 },
    { code: "PLN", symbol: "zł", rate: 4.6 },
];

const PriceList = () => {
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
    const [showCurrencies, setShowCurrencies] = useState(false);
    const { t } = useTranslation('common');

    const months = [
        {
            name: t('months.may.name'),
            price: 110,
            reasons: [
                t('months.may.reasons.0'),
                t('months.may.reasons.1'),
                t('months.may.reasons.2')
            ]
        },
        {
            name: t('months.june.name'),
            price: 130,
            reasons: [
                t('months.june.reasons.0'),
                t('months.june.reasons.1'),
                t('months.june.reasons.2')
            ]
        },
        {
            name: t('months.july.name'),
            price: 160,
            reasons: [
                t('months.july.reasons.0'),
                t('months.july.reasons.1'),
                t('months.july.reasons.2')
            ]
        },
        {
            name: t('months.august.name'),
            price: 160,
            reasons: [
                t('months.august.reasons.0'),
                t('months.august.reasons.1'),
                t('months.august.reasons.2')
            ]
        },
        {
            name: t('months.september.name'),
            price: 130,
            reasons: [
                t('months.september.reasons.0'),
                t('months.september.reasons.1'),
                t('months.september.reasons.2')
            ]
        },
        {
            name: t('months.october.name'),
            price: 100,
            reasons: [
                t('months.october.reasons.0'),
                t('months.october.reasons.1'),
                t('months.october.reasons.2')
            ]
        }
    ];
    const router = useRouter();

    return (
        <>
            <Meta title={t('pricelist.metaTitle')} />

            <div className={styles.container}>
                <div className={`${styles.currencySelector} ${showCurrencies ? styles.show : ""}`}>
                    {currencies.map((currency) => (
                        <button
                            key={currency.code}
                            onClick={() => {
                                setSelectedCurrency(currency);
                                setShowCurrencies(false);
                            }}
                            className={`${styles.currencyButton} ${selectedCurrency.code === currency.code ? styles.active : ''}`}
                        >
                            {currency.code}
                        </button>
                    ))}
                </div>

                <button
                    className={styles.floatingButton}
                    onClick={() => setShowCurrencies(!showCurrencies)}
                >
                    <b>$</b>
                </button>

                <h2 className={styles.title}>{t('pricelist.title')}</h2>

                <div className={styles.monthsList}>
                    {months.map((month, index) => (
                        <div key={index} className={styles.monthBox}>
                            <div className={styles.monthHeader}>{month.name}</div>
                            <div className={styles.price}>
                                € {month.price} / {t('pricelist.perNight')}
                                {selectedCurrency.code !== "EUR" && (
                                    <span className={styles.convertedPrice}>
                                        ({Math.round(month.price * selectedCurrency.rate)} {selectedCurrency.symbol})
                                    </span>
                                )}
                            </div>
                            <ul className={styles.reasonList}>
                                {month.reasons.map((reason, idx) => (
                                    <li key={idx}>{reason}</li>
                                ))}
                            </ul>
                            <button
                                className={styles.availableButton}
                                onClick={() => router.push(`/AvailableDates?month=${month.name}`)}
                            >
                                {t('pricelist.availableDates')} {month.name}
                            </button>
                        </div>
                    ))}
                </div>

                <div className={styles.policiesSection}>
                    <h2 className={styles.policiesTitle}>{t('pricelist.policiesTitle')}</h2>
                    <ul className={styles.policyList}>
                        <li><strong>{t('pricelist.checkIn')}:</strong> {t('pricelist.checkInTime')}</li>
                        <li><strong>{t('pricelist.checkOut')}:</strong> {t('pricelist.checkOutTime')}</li>
                        <li><strong>{t('pricelist.smoking')}:</strong> {t('pricelist.smokingPolicy')}</li>
                        <li><strong>{t('pricelist.pets')}:</strong> {t('pricelist.petsPolicy')}</li>
                        <li><strong>{t('pricelist.minStay')}:</strong> {t('pricelist.minStayNights')}</li>
                        <li><strong>{t('pricelist.stayDiscountTitle')}:</strong> {t('pricelist.stayDiscountPolicy')}</li>
                        <li><strong>{t('pricelist.depositTitle')}:</strong> {t('pricelist.depositPolicy')}</li>
                    </ul>
                </div>
            </div>

        </>
    );
};

export default PriceList;
export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}