const clickAddRate = document.getElementById("add-rate");
const clickConvert = document.getElementById("convert");
const searchRate = document.getElementById("search-rate");
const addNewRateTable = document.getElementById("addRateTable");
const clickAddAlert = document.getElementById("add-alert");
const addTrackerTable = document.getElementById("addTrackedCur");
const dialog = document.getElementById("boxAlert");
const dialogText = document.getElementById("dialogText");


const marketWatch = [];
const alertArray = [];
const openPriceArr = [];   // ex --> pushing  ["USD","EUR", 10]
const trackingPriceTable = [];


// Get updated rates form an external source  (using API)
async function getRates() {
    const dataRow = await fetch("https://api.currencyfreaks.com/v2.0/rates/latest?apikey=0c25017fdad747739d3a5f98c37cf903");
    const data = await dataRow.json();
    console.log(data);
    marketWatch.length = 0;
    marketWatch.push(data);
}

setInterval(() => {
    getRates();
    searchCurrency();
},10000);


// This function refresh my rates table
function printTable(table){
    addNewRateTable.innerHTML = "";
    for(let i=0; i < table.length; i++){
        const numberOfRates = Object.keys(table[i].rates).length;
        for(let x=0; x < numberOfRates; x++){
            const addRowTable = document.createElement("tr");
            const key = Object.keys(table[i].rates)[x];
            addRowTable.innerHTML = `<td>${table[i].base}</td><td>${key}</td><td>${table[i].rates[key]}</td>`;
            addNewRateTable.appendChild(addRowTable);
        }
    }
}


// Here add OR change rates manually
clickAddRate.addEventListener("click", function(event){
    event.preventDefault(); // When I click on the button by default the browser will refresh the page so this line will cancel the default browser operation
    const firstAddRateName = document.getElementById("currency-from");
    const text1 = firstAddRateName.value.toUpperCase().trim(); // The first currency name
    const secondAddRateName = document.getElementById("currency-to");
    const text2 = secondAddRateName.value.toUpperCase().trim(); // The second currency name
    const rateValue = document.getElementById("rate");
    const rateValueIs = Number(rateValue.value); // The rate value
    const theDate = new Date().toLocaleDateString('en-GB');


    if (!text1 || !text2 || !rateValueIs) {      // here we check if all required fields are filled or not
        const text = "Please enter all required fields!";
        return openDialog(text);
    }
    
    for(let i=0; i < marketWatch.length; i++){   // check if the first currency is exist or not
        if(marketWatch[i].base === text1){   
            marketWatch[i].rates[text2] = rateValueIs;       // This is how to add a new rate or update it if it exists
            // Here is how to reset the input fields to be empty
            firstAddRateName.value = "";
            secondAddRateName.value = "";
            rateValue.value = "";
            return  searchCurrency();
        }
    }

    marketWatch.push({                          // if dose not exist create new object
        base : text1,
        date : theDate,
        rates : {
            [text2] : rateValueIs,
        }
    });
    // Here is how to reset the input fields to be empty
    firstAddRateName.value = "";
    secondAddRateName.value = "";
    rateValue.value = "";
    return   searchCurrency();
});



// Convert currencies

clickConvert.addEventListener("click", function(event){
    event.preventDefault(); // When I click on the button by default the browser will refresh the page so this line will cancel the default browser operation
    const firstCurrency = document.getElementById("from-currency");
    const firstCurValue = firstCurrency.value.toUpperCase().trim(); // The first currency name
    const secondCurrency = document.getElementById("to-currency");
    const secondCurValue = secondCurrency.value.toUpperCase().trim(); // The second currency name
    const amountId = document.getElementById("amount");
    const amount = Number(amountId.value);

    if (!firstCurValue || !secondCurValue || !amount) {      // here we check if all required fields are filled or not
        const text = "Please enter all required fields!";
        return openDialog(text);
    }

    for(let i=0; i < marketWatch.length; i++){
        let totalAmount = undefined;
        if(marketWatch[i].base === firstCurValue){
            const numberOfRates = Object.keys(marketWatch[i].rates).length;
            for(let x=0; x < numberOfRates; x++){
                const key = Object.keys(marketWatch[i].rates)[x];
                if(secondCurValue === key){
                    totalAmount = amount * (marketWatch[i].rates[key]);
                    firstCurrency.value = "";
                    secondCurrency.value = "";
                    amountId.value = "";
                    const text = "The total amount is " + totalAmount.toFixed(3) + " " +key;
                    return openDialog(text);
                }
            }
        }
    }
    
});


// Search for firstCurValue currency pair

// searchRate.addEventListener("keyup", function() {
//     const searchValue = searchRate.value.toUpperCase().trim();
//     const tr = addNewRateTable.getElementsByTagName("tr");
    
//     for(let i=0; i < tr.length; i++){
//         const td1 = tr[i].getElementsByTagName("td")[0];
//         const td2 = tr[i].getElementsByTagName("td")[1];

//         if(td1.textContent.includes(searchValue) || td2.textContent.includes(searchValue) || searchValue === ""){
//             tr[i].style.display = "";                     // Show the row
//         }else{
//             tr[i].style.display = "none";
//         }
//     }
// });




// Search rates using map & filter functions

// searchRate.addEventListener("keyup", function() {
//     const searchValue = searchRate.value.toUpperCase().trim();
//     if(searchValue === ""){
//         return printTable(marketWatch);
//     }else{
//     const searchArray = marketWatch.map(entry => ({             // To return object we should use ({...})
//         base: entry.base,
//         date: entry.date,
//         rates: Object.fromEntries( // .fromEntries -> Change array to object   and   .entries -> change object to array [key, value]
//             Object.entries(entry.rates).filter(([key]) => key.includes(searchValue) || entry.base.includes(searchValue))
//         )
//     })).filter(entry => Object.keys(entry.rates).length > 0);

//     return printTable(searchArray);
//     }
// });



// Search rates using forEach()
function searchCurrency(){
    const searchValue = searchRate.value.toUpperCase().trim();

    if (searchValue === "") {
        printTable(marketWatch);
        return;  // return to avoid use of else {} block (reduces indentation)
    }

    const matchingRates = [];
    marketWatch.forEach(item => {
        const ratesAsArray = Object.entries(item.rates);
        ratesAsArray.forEach((rate) => {
            if (item.base.includes(searchValue) || rate[0].includes(searchValue)) {
                matchingRates.push({
                    base: item.base,
                    date: item.date,
                    rates: { [rate[0]]: rate[1] }
                });
            }
        })
    });
    printTable(matchingRates);
}
searchRate.addEventListener("keyup", searchCurrency);




// Here we ara going to show an announcement when the market open or/and close

setInterval(function(){
    const timeNow = new Date();
    if(timeNow.getHours() === 9 && timeNow.getMinutes() === 0){
        const text = "Market is open now..";
        return openDialog(text);
    }else if(timeNow.getHours() === 17 && timeNow.getMinutes() === 0){
        const text = "Market is close now..";
        return openDialog(text);

    }
}, 30000);



// Here I'm going to create an alert table and set an alert if the price reaches the target

clickAddAlert.addEventListener("click", function(event){
    event.preventDefault();
    const firstCurrencyId = document.getElementById("first-currency");
    const firstCurAlert = firstCurrencyId.value.toUpperCase().trim();
    const secondCurrencyId = document.getElementById("second-currency");
    const secondCurAlert = secondCurrencyId.value.toUpperCase().trim();
    const alertId = document.getElementById("alert-rate");
    const alertValue = Number(alertId.value);

    if (!firstCurAlert || !secondCurAlert || !alertValue) {      // here we check if all required fields are filled or not
        const text = "Please enter all required fields!";
        return openDialog(text); 
    }


    if(alertArray.length > 0){
        for(let i = 0; i < alertArray.length; i++){             // Here we checked if currency pair exists or not
            if(alertArray[i][0] === firstCurAlert && alertArray[i][1] === secondCurAlert && alertArray[i][2] === alertValue){
                const text = "The currency pair exists..";
                firstCurrencyId.value = "";
                secondCurrencyId.value = "";
                alertId.value = "";
                return openDialog(text);
            }
        };
    }   
    alertArray.push([firstCurAlert, secondCurAlert, alertValue]);
    firstCurrencyId.value = "";
    secondCurrencyId.value = "";
    alertId.value = "";
});

setInterval(function(){
    for(let i = 0; i < alertArray.length; i++){     // Here we see if the price has reached to the target or not 
        marketWatch.forEach((item) => {
            const ratesAsArray = Object.entries(item.rates);
            ratesAsArray.forEach((rate) => {
                if(item.base === alertArray[i][0] && rate[0] === alertArray[i][1]){
                    if(rate[1] >= alertArray[i][2]){
                        const text = item.base + " " + rate[0] + " exchange rate has reached " + alertArray[i][2];
                        openDialog(text); 
                        alertArray.splice(i, 1);
                    }
                }
            });
        }); 
    };
}, 1000);



// Here we create a currency tracking table

setInterval(function(){
    const timeNow = new Date();
    if(timeNow.getHours() === 12 && timeNow.getMinutes() === 13){      // Reset the opening price
        openPriceArr.length = 0;
        marketWatch.forEach(item => {
            const ratesAsArray = Object.entries(item.rates);
            ratesAsArray.forEach((rate) => {
                openPriceArr.push([item.base, rate[0], rate[1]]);
            });

        });
    }
},30000);

setInterval(() => {
    if(openPriceArr)
        trackingPriceTable.length = 0;
        for (let i = 0; i < openPriceArr.length; i++) {            // Here we are going to calculate the percentage of rates 
            marketWatch.forEach((item) => {
                if(item.base === openPriceArr[i][0]){
                    const ratesArr = Object.entries(item.rates);
                    ratesArr.forEach((rate) =>{
                        if(rate[0] === openPriceArr[i][1]){
                            const roc = ((rate[1] - openPriceArr[i][2]) / openPriceArr[i][2]) * 100;
                            trackingPriceTable.push([item.base, rate[0], rate[1], roc]);
                        }
                    });
                }
            });
        }
        
        addTrackerTable.innerHTML = "";
        for (let i = 0; i < trackingPriceTable.length; i++) {    // Here print the table
            const addTrackedRow = document.createElement("tr");
            addTrackedRow.innerHTML = `<td>${trackingPriceTable[i][0]}</td><td>${trackingPriceTable[i][1]}</td><td>${trackingPriceTable[i][2]}</td><td>${trackingPriceTable[i][3].toFixed(2)} %</td>`;
            addTrackerTable.appendChild(addTrackedRow);    
        }
}, 1000);


function openDialog(text){         // this function to show the results inside box
    dialogText.textContent = text;
    dialog.show(); 
}