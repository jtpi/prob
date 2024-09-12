//npx create-react-app currency-swap
//cd currency-swap
//npm install axios react-hook-form react-select tailwindcss
//npx tailwindcss init






import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

const Pro2 = () => {
  const [tokens, setTokens] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);
  const { register, handleSubmit, setValue, errors } = useForm();

  useEffect(() => {
    axios.get('https://interview.switcheo.com/prices.json')
      .then((response) => {
        const tokenData = Object.entries(response.data).map(([symbol, priceData]) => ({
          label: symbol,
          value: symbol,
          price: priceData.price,
          icon: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg`,
        }));
        setTokens(tokenData);
      })
      .catch((error) => console.error('Error fetching token prices:', error));
  }, []);

  const handleSwap = (data) => {
    const { fromCurrency, toCurrency, amount } = data;
    const fromToken = tokens.find(t => t.value === fromCurrency);
    const toToken = tokens.find(t => t.value === toCurrency);

    if (fromToken && toToken && fromToken.price && toToken.price) {
      const rate = fromToken.price / toToken.price;
      setExchangeRate(rate * amount);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">Currency Swap</h2>
      <form onSubmit={handleSubmit(handleSwap)} className="space-y-4">
        <div>
          <label className="block mb-2">From Currency</label>
          <Select
            options={tokens}
            getOptionLabel={(token) => (
              <div className="flex items-center">
                <img src={token.icon} alt={token.label} className="w-6 h-6 mr-2" />
                {token.label}
              </div>
            )}
            getOptionValue={(token) => token.value}
            name="fromCurrency"
            ref={register({ required: true })}
            onChange={(option) => setValue('fromCurrency', option.value)}
          />
          {errors.fromCurrency && <p className="text-red-500 text-sm">Please select a currency</p>}
        </div>

        <div>
          <label className="block mb-2">To Currency</label>
          <Select
            options={tokens}
            getOptionLabel={(token) => (
              <div className="flex items-center">
                <img src={token.icon} alt={token.label} className="w-6 h-6 mr-2" />
                {token.label}
              </div>
            )}
            getOptionValue={(token) => token.value}
            name="toCurrency"
            ref={register({ required: true })}
            onChange={(option) => setValue('toCurrency', option.value)}
          />
          {errors.toCurrency && <p className="text-red-500 text-sm">Please select a currency</p>}
        </div>

        <div>
          <label className="block mb-2">Amount</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            name="amount"
            ref={register({ required: true, min: 0.01 })}
            placeholder="Enter amount"
          />
          {errors.amount && <p className="text-red-500 text-sm">Please enter a valid amount</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Swap
        </button>

        {exchangeRate && (
          <p className="mt-4 text-center text-lg">
            You will receive: <strong>{exchangeRate.toFixed(4)}</strong> units
          </p>
        )}
      </form>
    </div>
  );
};

export default Pro2;