const table = document.querySelector('.table')
const tableBody = document.querySelector('.tableBody');
const tableHead = document.querySelector('thead');
const input = document.querySelector('#inputFile');
const deleteBtn = document.querySelector('#delete');
const notice = document.querySelector('.notice')
let defaultCsv = 'DATABase.csv';
let csvFile = null;
let idCell = 0;
const tableDataType = ['fullName','phone','email','age','experience','yearlyIncome','hasChildren','licenseStates','expirationDate','licenseNumber']

init()

function init(){
    fetch(defaultCsv)
        .then(response => response.text())
        .then((result) => {
            parsingFile(result)
            })

    input.addEventListener('change', inputHandler)
}

function parsingFile(data) {
    table.style.display = 'table';
    let dataBase = data.split(/\r?\n|\r/);
    let tableHeadFragment = document.createDocumentFragment();
    let tableFragment = document.createDocumentFragment();
    for(let row = 0; row < dataBase.length; row++){
        let tableRow = document.createElement('tr');
        let rowCells = dataBase[row].split(',');
        if(row === 0){
            let th = document.createElement('th');
            th.innerText = 'ID';
            tableRow.append(th)
            for(let cell = 0; cell <= rowCells.length; cell++){
                let th = document.createElement('th');
                if(cell === rowCells.length){
                    th.innerText = 'Duplicate with';
                    tableRow.append(th)
                } else {
                    th.innerText = rowCells[cell].toLowerCase();
                    tableRow.append(th)
                }
            } 
            tableHeadFragment.append(tableRow)
        } else {
        idCell ++;
        let tableData = document.createElement('td');
        tableData.innerText = idCell;
        tableRow.append(tableData)
        handleSpaces(rowCells)
        for(let cell = 0; cell < rowCells.length; cell++){
            if(rowCells[0].trim() === '' || rowCells[1].trim() === '' || rowCells[2].trim() === ''){
                table.style.display = 'none';
                notice.style.display = 'block';
                return
            }
            let tableData = document.createElement('td');
            if(cell === 1 || cell === 2){
                tableData.setAttribute('data-id', `${idCell}`)
            }
            if(cell === 3 || cell === 4){
                tableData.setAttribute('data-age', `${idCell}`)
            }
            tableData.setAttribute('data-type', `${tableDataType[cell]}`)
            tableData.innerText = rowCells[cell];
            tableRow.append(tableData)
        }
        let dublicateCell = document.createElement('td');
        dublicateCell.setAttribute('id', `${idCell}`);
        tableRow.append(dublicateCell)
        tableFragment.append(tableRow)
        } 
    }
    tableHead.append(tableHeadFragment)
    tableBody.append(tableFragment)
    validateTable()
}

  function validateTable(){
    validateDataUnique(tableDataType[1])
    validateDataUnique(tableDataType[2])
    validatePhone(tableDataType[1])
    validateAge(tableDataType[3])
    validateExpirience(tableDataType[4])
    validateYearlyIncome(tableDataType[5])
    validateHasChildren(tableDataType[6])
    validateLicenseStates(tableDataType[7])
    validateExpirationDate(tableDataType[8])
    licenseNumber(tableDataType[9]) 
}

function inputHandler() {
    notice.style.display = 'none';
    if(this.files[0].type !== 'text/csv'){
        table.style.display = 'none'
        notice.style.display = 'block';
        return
    }
    deleteHandler()
    csvFile = window.URL.createObjectURL(this.files[0]);
    fetch(csvFile)
        .then(response => response.text())
        .then((result) => { 
            parsingFile(result)
            })    
}

function handleRequiredFild(arr, row){
    for(let el of arr){
        if(row[el].trim() === ''){
            table.style.display = 'none';
            notice.style.display = 'block'
        }
    }
}

function handleSpaces(arr){
    arr = arr.map(el => el.trim())
    return arr
}

function validateDataUnique(dataType){
    let column = [...document.querySelectorAll(`[data-type=${dataType}]`)];
    let columnValues = column.map(el => el.innerText.toLowerCase())
    let notUniqueValues = column.filter(el => columnValues.indexOf(el.innerText.toLowerCase()) !== columnValues.lastIndexOf(el.innerText.toLowerCase()))
    for(let el of notUniqueValues){
        for(let i = 0; i < notUniqueValues.length; i++){
            if(el.innerText.toLowerCase() === notUniqueValues[i].innerText.toLowerCase() && el.dataset.id !== notUniqueValues[i].dataset.id){
                document.getElementById(`${el.dataset.id}`).innerText = notUniqueValues[i].dataset.id
            }
        }
    }
}

function validatePhone(dataType) {
    let column = [...document.querySelectorAll(`[data-type=${dataType}]`)];
    for (let cell of column){
        if(!Number.isInteger(+cell.innerText) || cell.innerText.length > 12 || cell.innerText.length < 10){
            cell.classList.add('warning')
        }
        if(cell.innerText.slice(0,2) !== '+1' && cell.innerText.length < 12){
            if(cell.innerText.length === 10){
                cell.innerText = '+1' + cell.innerText
            } else if(cell.innerText.length === 11 && cell.innerText.slice(0,1) === '1'){
                cell.innerText = '+' + cell.innerText
            }
        } else if(cell.innerText.length === 12 && cell.innerText.slice(0,2) !== '+1'){
            cell.classList.add('warning')
        }
    }
}

function validateAge(dataType) {
    let column = [...document.querySelectorAll(`[data-type=${dataType}]`)];
    for (let cell of column){
        if(!Number.isInteger(+cell.innerText) || cell.innerText < 21){
            cell.classList.add('warning')
        }
    }
}
   
function validateExpirience(dataType) {
    let column = [...document.querySelectorAll(`[data-type=${dataType}]`)];
    for (let cell of column){
        let age = document.querySelector(`[data-age='${cell.dataset.age}']`)
        let validExpirience = age.innerText - 21
        if(cell.innerText < 0 || cell.innerText > validExpirience){
            cell.classList.add('warning')
        }
    }
}

function validateYearlyIncome(dataType) {
    let column = [...document.querySelectorAll(`[data-type=${dataType}]`)];
    for (let cell of column){
        cell.innerText = (+cell.innerText).toFixed(2)
        if(cell.innerText > 1000000){
            cell.classList.add('warning')
        } 
        
    }
}

function validateHasChildren(dataType){
    let column = [...document.querySelectorAll(`[data-type=${dataType}]`)];
    for (let cell of column){
        if(cell.innerText === ''){
            cell.innerText = 'false'
        } else if(cell.innerText !== 'true' && cell.innerText !== 'false'){
            cell.classList.add('warning')
        }
    }
}

function validateLicenseStates(dataType) {
    let column = [...document.querySelectorAll(`[data-type=${dataType}]`)];
    for (let cell of column){
        if(cell.innerText.includes('|')){
            cell.innerText = cell.innerText.split('|').join(', ')
        } 
    }
}

function validateExpirationDate(dataType) {
    let column = [...document.querySelectorAll(`[data-type=${dataType}]`)];
    let dateNow = new Date;
    for (let cell of column){
        let incomeDate = new Date(cell.innerText);
        let patternSlash = /^(0[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/([0-9]{4})$/;
        let patternDash = /^\d{4}-(0[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/;
        if (!patternSlash.test(cell.innerText) && !patternDash.test(cell.innerText) || incomeDate < dateNow) {
            cell.classList.add('warning')
        }
    }
}

function licenseNumber(dataType) {
    let column = [...document.querySelectorAll(`[data-type=${dataType}]`)];
    let validFormat = /^[A-Za-z0-9]{6}$/
    for (let cell of column){
        if(!validFormat.test(cell.innerText)){
            cell.classList.add('warning')
        }
    }
}

function deleteHandler() {
    idCell = 0;
    csvFile = null;
    let tableContent = document.querySelectorAll('tr');
    for(let tr of tableContent){
        tr.remove()
    }
}





