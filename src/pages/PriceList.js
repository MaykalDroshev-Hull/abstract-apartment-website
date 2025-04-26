import { useEffect, useState } from "react";
import styles from "../styles/Page Styles/PriceList.module.css";

const months = [
    { name: "Май", price: 120, reasons: ["- Най-хубавото време за почивка", "- По-ниски цени", "- По-малко туристи"] },
    { name: "Юни", price: 140, reasons: ["- Топло време", "- Идеално за море", "- Все още спокойно"] },
    { name: "Юли", price: 170, reasons: ["- Горещо лято", "- Много събития", "- Перфектно за семейства"] },
    { name: "Август", price: 170, reasons: ["- Пикът на лятото", "- Празници и фестивали", "- Топло море"] },
    { name: "Септември", price: 140, reasons: ["- Топло море", "- По-спокойна атмосфера", "- По-ниски цени"] },
];

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

    return (
        <div className={styles.container}>
            <div className={`${styles.currencySelector} ${showCurrencies ? styles.show : ""}`}>
                {currencies.map((currency) => (
                    <button
                        key={currency.code}
                        onClick={() => {
                            setSelectedCurrency(currency);
                            setShowCurrencies(false); // close after selecting
                        }}
                        className={`${styles.currencyButton} ${selectedCurrency.code === currency.code ? styles.active : ''}`}
                    >
                        {currency.code}
                    </button>
                ))}
            </div>

            {/* Floating button for mobile */}
            <button 
                className={styles.floatingButton} 
                onClick={() => setShowCurrencies(!showCurrencies)}
            >
                <b>$</b>
            </button>

            <h2 className={styles.title}>Ценова Листа</h2>

            <div className={styles.monthsList}>
                {months.map((month, index) => (
                    <div key={index} className={styles.monthBox}>
                        <div className={styles.monthHeader}>{month.name}</div>
                        <div className={styles.price}>
                            € {month.price} / нощувка
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
                        <button className={styles.availableButton}>
                            Свободни дати {month.name}
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.policiesSection}>
                <h2 className={styles.policiesTitle}>Политики и условия</h2>
                <ul className={styles.policyList}>
                    <li><strong>Депозит:</strong> 30% от стойността на престоя при резервация.</li>
                    <li><strong>Пълно плащане:</strong> До 7 дни преди пристигане.</li>
                    <li><strong>Отмяна:</strong> Безплатна отмяна до 30 дни преди пристигане. След това депозитът не се възстановява.</li>
                    <li><strong>Настаняване:</strong> След 15:00 часа.</li>
                    <li><strong>Освобождаване:</strong> До 11:00 часа.</li>
                    <li><strong>Тютюнопушене:</strong> Забранено във всички помещения.</li>
                    <li><strong>Домашни любимци:</strong> По предварително запитване.</li>
                    <li><strong>Минимален престой:</strong> 3 нощувки.</li>
                </ul>
            </div>
        </div>
    );
};

export default PriceList;
