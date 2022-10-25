import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;


const fetchCountryInput = document.querySelector('input');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

function renderCountryList(country) {
  return `
    <li>
        <img src="${country.flags.svg}" alt="${
    country.name.official
  }" width="150" />
        <h1 class="title">${country.name.official}</h1>
        <p class="text">Capital:<span class="info"> ${country.capital}</span></p>
        <p class="text">Population:<span class="info"> ${country.population}</span></p>
        <p class="text">Languages:<span class="info"> ${Object.values(country.languages).join(
          ''
        )} </span></p>
    </li>
    `;
}

function renderCountryInfo(country) {
  return `
    <li>
      <img
        src="${country.flags.svg}"
         alt="${country.official}"
         width="100"
           />
      <p class="text"><span class="info">${country.name.official}</span></p>
    </li>
    `;
}



function onSearchTextField() {
  const name = fetchCountryInput.value.trim();
    if (name === '') {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
    return;
  }
  fetchCountries(name)
    .then(countries => {
      if (countries.length === 1) {
          const markupList = countries.map(country =>
            renderCountryList(country)
          );
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = markupList.join('');
        
      }

      if (countries.length >= 2 && countries.length <= 10) {
        const markupInfo = countries.map(country => renderCountryInfo(country));
        countryListEl.innerHTML = markupInfo.join('');
        countryInfoEl.innerHTML = '';
      }

      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = '';
        return;
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      countryInfoEl.innerHTML = '';
      countryListEl.innerHTML = '';
      return error;
    });
}

fetchCountryInput.addEventListener(
  'input',
  debounce(onSearchTextField, DEBOUNCE_DELAY)
);