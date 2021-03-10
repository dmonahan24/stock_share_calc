


//Function to get the latest closing share price from IEX Cloud
function getClosingPrice () {
    for (let items of portfolio) {
        items['sharePrice'] = parseFloat((Math.random() * 100).toFixed(2));
        items['currentYield'] = parseFloat((Math.random() * 0.15 * 100).toFixed(2)) + ' %';
    }
/*
    for (let items of portfolio) {
        let urlClose = {YOUR API URL HERE};
        fetch(urlClose)
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(json => {
            console.log(json);
            var close = json;
            items["sharePrice"] = close;
        })
        .catch(error => {
            console.error(JSON.parse(error));
        })
        let urlYield = {YOUR API URL HERE};
        fetch(urlYield)
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(json => {
            console.log(json);
            var yield = json;
            if (yield >= 0) {
                items["currentYield"] = (yield * 100).toFixed(2) + ' %';
            } else {
                items["currentYield"] = 'N/A';
            }

        })
        .catch(error => {
            items["currentYield"] = 'N/A';
            //console.error(JSON.parse(error));
        })
    }
    */
}

// Call function to update portfolio object
getClosingPrice();



// Function to generate the table headers
function generateTableHead(table, headers) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of headers) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

//Function to iterate through array and populate the table
function generateTable(table, data) {
    let tbody = table.createTBody();
    tbody.className = ".styled-table";
    for (let element of data) {
        let row = tbody.insertRow();
        for (key in element) {
            if (key == "symbol") {
                let cell = row.insertCell();
                let text = document.createTextNode(element[key]);  
                cell.appendChild(text);
                cell.className = ".styled-table";
                cell.id = "symbol";
            } else if (key == "weight") {
                let cell = row.insertCell();
                let text = document.createTextNode(element[key].toFixed(1) + " %");  
                cell.appendChild(text);
                cell.className = ".styled-table";
                cell.id = "weight";
            } else if (key == "sharePrice") {
                let cell = row.insertCell();
                if (element[key] != ''){
                    let text = document.createTextNode("$ " + commaSeparators(element[key].toFixed(2)));
                    cell.appendChild(text);
                } else {
                    let text = document.createTextNode('');
                    cell.appendChild(text);
                }
                cell.className = ".styled-table";
                cell.id = "sharePrice";
            } else if (key == "shares") {
                let cell = row.insertCell();
                let text = document.createTextNode(element[key]);  
                cell.appendChild(text);
                cell.className = ".styled-table";
                cell.id = "shares";
            } else if (key == "cost") {
                let cell = row.insertCell();
                let text = document.createTextNode(element[key]);  
                cell.appendChild(text);
                cell.className = ".styled-table";
                cell.id = "cost";
            } else if (key == "currentYield") {
                let cell = row.insertCell();
                let text = document.createTextNode(element[key]);  
                cell.appendChild(text);
                cell.className = ".styled-table";
                cell.id = "currentYield";
            } else {
                let cell = row.insertCell();
                let text = document.createTextNode(element[key]);  
                cell.appendChild(text);
                cell.className = ".styled-table";
                cell.id = "other";
            }
        }
    }
}

//Function to calculate shares purchased on call
function calculateShares() {
    var portAmount = document.getElementById("portAmount").value;
    let totalCost = 0;
    for (let item of portfolio) {
        if (item['sharePrice'] > 0) {
        let shares = Math.ceil((item["weight"] / 100) * portAmount / parseFloat(item["sharePrice"]));
        item["shares"] = commaSeparators(shares);
        let cost = parseFloat(shares) * parseFloat(item["sharePrice"]);
        item["cost"] = "$ " + commaSeparators(cost.toFixed(2));
        totalCost += parseFloat(cost);
        }

    }
    let cash = parseFloat(portAmount) - parseFloat(totalCost);
    let percent = (cash / portAmount) * 100;

    document.getElementById("cashOnHand").innerText = 
    "Cash on Hand: $" + commaSeparators(cash.toFixed(2)) 
    + " which is " + percent.toFixed(1)
    + "% of your portfolio.";
}


//Edit later to parse keys and capitalize/splitwords at capitalizations
let table = document.querySelector("table");
// let data = Object.keys(portfolio[0]);
let headers = ["Symbol", "Weight", "Share Price", "Shares", "Cost", "Current Yield"];


function calculateTable() {
    let notNaN = document.getElementById("portAmount").value;
    if (notNaN > 0) {
    document.getElementById("portfolioTable").innerHTML = "";
    document.getElementById("disclaimer").innerHTML = 
    "This percentage may bring the total below than 100% and is"
    + "<br />due to rounding up to whole share purchase amounts"
    + "<br /> instead of fractional shares for the calculation."
    calculateShares();
    generateTableHead(table, headers);
    generateTable(table, portfolio);
    } else return false;
}

function clearTable() {
    document.getElementById("portAmount").value = '';
    document.getElementById("portfolioTable").innerHTML = "";
    document.getElementById("cashOnHand").innerText = "Cash on Hand:";
    document.getElementById("disclaimer").innerText = "";
    for (let items of portfolio) {
        items['shares'] = '';
        items['cost'] = '';
    }
    generateTableHead(table, headers);
    generateTable(table, portfolio);
}

function commaSeparators(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

function exportTableToExcel(tableID, filename = '') {
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    2
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType3
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    } else {
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
        downloadLink.download = filename;
        downloadLink.click();
    }
}

generateTableHead(table, headers);
generateTable(table, portfolio);


//Make table and buttons stick to one width
//Auto-populate headers from Keys
//Add Cash Row to Table
