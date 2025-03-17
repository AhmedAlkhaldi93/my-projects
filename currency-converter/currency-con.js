const clickAddRate = document.getElementById("add-rate");
const clickConvert = document.getElementById("convert");
const searchRate = document.getElementById("search-rate");
const addNewRateTable = document.getElementById("addRateTable");

const marketWatch = [];


function printTable(){                    // This function refresh my rates table
    addNewRateTable.innerHTML = "";
    for(let i=0; i < marketWatch.length; i++){
        const numberOfRates = Object.keys(marketWatch[i].rates).length;
        for(let x=0; x < numberOfRates; x++){
            const addRowTable = document.createElement("tr");
            const key = Object.keys(marketWatch[i].rates)[x];
            addRowTable.innerHTML = `<td>${marketWatch[i].base}</td><td>${key}</td><td>${marketWatch[i].rates[key]}</td>`;
            addNewRateTable.appendChild(addRowTable);
        }
    }

}


// How to Add New Currency Rate
clickAddRate.addEventListener("click", function(event){
    event.preventDefault(); // When I click on the button by default the browser will refresh the page so this line will cancel the default browser operation
    const firstAddRateName = document.getElementById("currency-from");
    const text1 = firstAddRateName.value.toUpperCase(); // The first currency name
    const secondAddRateName = document.getElementById("currency-to");
    const text2 = secondAddRateName.value.toUpperCase(); // The second currency name
    const rateValue = document.getElementById("rate");
    const rateValueIs = Number(rateValue.value); // The rate value
    const theDate = new Date().toLocaleDateString('en-GB');

    for(let i=0; i < marketWatch.length; i++){   // check if the first currency is exist or not
        if(marketWatch[i].base === text1){   
            marketWatch[i].rates[text2] = rateValueIs;
            // Here is how to reset the input fields to be empty
            firstAddRateName.value = "";
            secondAddRateName.value = "";
            rateValue.value = "";
            return printTable();
        }
    }

    marketWatch.push({                          // if dose not exist create new object
        base : text1,
        date : theDate,
        rates : {
            [secondAddRateName.value.toUpperCase()] : rateValueIs,
        }
    });
    // Here is how to reset the input fields to be empty
    firstAddRateName.value = "";
    secondAddRateName.value = "";
    rateValue.value = "";
    return printTable();

});


// Convert currencies
clickConvert.addEventListener("click", function(event){
    event.preventDefault(); // When I click on the button by default the browser will refresh the page so this line will cancel the default browser operation
    const firstCurrency = document.getElementById("from-currency");
    const firstCurValue = firstCurrency.value.toUpperCase(); // The first currency name
    const secondCurrency = document.getElementById("to-currency");
    const secondCurValue = secondCurrency.value.toUpperCase(); // The second currency name
    const amountId = document.getElementById("amount");
    const amount = Number(amountId.value);

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
                    return alert("The total amount is " + totalAmount + " " +key);
                }
            }
        }
    }

});


// Search for a currency pair
searchRate.addEventListener("keyup", function() {
    const searchValue = searchRate.value.toUpperCase().trim();
    const tr = addNewRateTable.getElementsByTagName("tr");
    
    for(let i=0; i < tr.length; i++){
        const td1 = tr[i].getElementsByTagName("td")[0];
        const td2 = tr[i].getElementsByTagName("td")[1];

        if(searchValue === td1.textContent || searchValue === td2.textContent || searchValue === ""){
            tr[i].style.display = "";                     // Show the row
        }else{
            tr[i].style.display = "none";
        }

    }
});
