import { useEffect, useState } from "react";
import "./App.css";

const currencies = ['USD', 'EUR', 'AZN', 'TRY', 'RUB', 'GEL'];
const baseUrl = 'https://api.apilayer.com/exchangerates_data';
const  myHeaders = new Headers();
myHeaders.append("apikey", "CuML0QPFsTyFWHowlHjXgI1qMLPbcNpF");
const requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

function App() {
  const [fromCurrency, setFromCurrency] = useState(currencies[0]);
  const [toCurrency, setToCurrency] = useState(currencies[1]);
  const [amount, setAmount] = useState(1);
  const [convertedValue, setConvertedValue] = useState(0);
  const [rates, setRates] = useState();
  const [loading, setLoading] = useState(false);

  const fetchConvertedValue = () => {
    setLoading(true);
    setConvertedValue(0)
    fetch(`${baseUrl}/convert?to=${toCurrency}&from=${fromCurrency}&amount=${amount}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        const value = result.result;
        setConvertedValue(value);
      })
      .catch(error => console.log('error', error))
      .finally(() => setLoading(false));
  };

  const fetchExchangeRates = () => {
    setRates(undefined);
    fetch(`${baseUrl}/latest?symbols=${currencies}&base=${fromCurrency}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setRates(result.rates);
      })
      .catch(error => console.log('error', error));
  }

  const swapCurrency = () => {
    const temporary = toCurrency;
    setToCurrency(fromCurrency);
    setFromCurrency(temporary);
  }

  useEffect(() => {
    if (!amount) {
      setConvertedValue(0);
    } 
  }, [amount]);

  useEffect(() => {
    if (fromCurrency) {
      fetchExchangeRates();
    }
  }, [fromCurrency]);

  useEffect(() => {
    if (toCurrency && fromCurrency && amount) {
      fetchConvertedValue();
    }
  }, [toCurrency, fromCurrency, amount]);

  return (
    <div className="App">
      <div className="converter_wrapper">

        <div className="converted_currencies">
          <select name='fromCurrency' value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencies.map((currencyOption) => (
              <option key={currencyOption} value={currencyOption}>{currencyOption}</option>
            ))}
          </select>

          <button onClick={swapCurrency}>Swap</button>

          <select name='toCurrency' value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencies.map((currencyOption) => (
              <option key={currencyOption} value={currencyOption}>{currencyOption}</option>
            ))}
          </select>
          
        </div>
        <div className="amount">
          <div className="amount_wrapper">
            <p>Amount</p>
            <div>
              <input value={amount} onChange={e => setAmount(e.target.value)} type="text" name="" id="" />
              <button>∞</button>
            </div>
            {loading ? 'Loading' : <span>{convertedValue} {toCurrency}</span> }
          </div>
        </div>
        <div className="all_curr">
          <ul>
            {
              rates && Object.keys(rates).map(curr => {
                if (curr === fromCurrency) return null;
                return <li key={curr}>
                  <div>
                    {curr}
                  </div>
                  <div>
                    {rates[curr]}
                  </div>
                </li>
              })
            }
          </ul>
        </div>

      </div>
    </div>
  );
}

export default App;
