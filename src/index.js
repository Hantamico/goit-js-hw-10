import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountriesByName } from './fetchCountries';

const DEBOUNCE_DELAY = 300;


const inputEl = document.querySelector('input');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(() => {
    const countryName = inputEl.value

    if (countryName === "") {
        return resetMarkup();
    }

    fetchCountriesByName(countryName)
        .then(renderCountries)
        .catch(onFetcherror);
    
},DEBOUNCE_DELAY));





function renderCountries(countries) {

    // If returned 1 country ;
    if (countries.length === 1) {
        return renderCardMarkup(countries);
    }
    // If returned 10 or less countries;
    if (countries.length <= 10 && countries.length > 2) {
        return renderCountryListMarkup(countries);
    }
    // If returned 10 or more countries;
    if (countries.length > 10) { 
        return renderNotifyTooMuchCountries();
    }
    

 };

// Error notice
function onFetcherror(error) {
    Notiflix.Notify.failure("Oops, there is no country with that name");
    console.error(error);
    return;
}

//Reset markup Function
function resetMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

//Render markup for one card
function renderCardMarkup(countries) {
    resetMarkup();
        const countryCard = countries.map(
            ({ name, capital, population, flags, languages }) => {
                return `
            <div class="country-card">
                <div class="heading-block">
                    <img class="country-card-flag" src="${flags.svg}" alt="${name.common} flag">
                    <p class="country-card-heading">${name.official}</p>
                </div>
                <div class="content-block">
                    <p><b>Capital:</b> ${capital}</p>
                    <p><b>Population:</b> ${population}</p>
                    <p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>
                </div>
            </div>
            `
            });
        return countryInfo.innerHTML = countryCard;
};

//Render list of countries
function renderCountryListMarkup(countries) {
    resetMarkup();
    const countryMarkupList = countries
    .map(({name, flags}) => {
    return `
    <div class="country-list-item">
        <img class="country-list-item-flag" src="${flags.svg}" alt="${name.common} flag">
        <p class="list-item-text">${name.common}</p>
    </div>
    `
    }).join("");
    
    countryList.innerHTML = countryMarkupList;
}

// TooMuchCountries notify Render
function renderNotifyTooMuchCountries() {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}