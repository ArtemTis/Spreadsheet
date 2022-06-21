let table = document.getElementById('table');

let editingTd;

table.onclick = function (event) {
    let textArea = document.querySelector('textarea');
    // 3 возможных цели
    let target = event.target.closest('.edit-cancel,.edit-ok,td');

    if (!table.contains(target) || target.className == 'column' || target.className == 'string' || target.className == 'add' || target.className == 'string') return;

    if (target.className == 'edit-cancel') {
        finishTdEdit(editingTd.elem, false);
    } else if (target.className == 'edit-ok') {
        finishTdEdit(editingTd.elem, true, textArea.style.height, textArea.style.width);
    } else if (target.nodeName == 'TD') {
        if (editingTd) return;

        makeTdEditable(target);
    }

};

function makeTdEditable(td) {

    editingTd = {
        elem: td,
        data: td.innerHTML
    };

    td.classList.add('edit-td'); // td в состоянии редактирования, CSS применятся к textarea внутри ячейки

    let textArea = document.createElement('textarea');
    textArea.style.width = td.clientWidth + 'px';
    textArea.style.height = td.clientHeight + 'px';
    textArea.className = 'edit-area';

    textArea.value = td.innerHTML;
    td.innerHTML = '';
    td.appendChild(textArea);
    textArea.focus();

    td.insertAdjacentHTML("beforeEnd",
        '<div class="edit-controls"><button class="edit-ok">OK</button><button class="edit-cancel">ЗАКРЫТЬ</button></div>'
    );

}


function finishTdEdit(td, isOk, height, width) {

    var Regex = /^[^a-zA-Z]*$/;

    if (isOk) {
        if (td.firstChild.value.trim()[0] == '=' && Regex.test(td.firstChild.value.trim())) {
            td.innerHTML = eval(td.firstChild.value.trim().substring(1));
        }
        else if (td.firstChild.value.trim()[0] == '=' && !Regex.test(td.firstChild.value.trim())) {
            td.innerHTML = region(td.firstChild.value.replace(/\n/g, "<br />").trim().substring(1));
        }
        // else if (td.firstChild.value.trim()[0] == '#' && td.firstChild.value.trim().slice(1, 4) == 'sum') {
        //     td.innerHTML = summ(td.firstChild.value.replace(/\n/g, "<br />").trim().substring(5));
        //     console.log(1);
        // }
        else {
            td.innerHTML = td.firstChild.value.replace(/\n/g, "<br />").trim();
            let tdHeight = height.slice(0, -2);
            let tdWidth = width.slice(0, -2);
            td.style.height = +tdHeight + 1 + 'px';
            td.style.width = +tdWidth + 1 + 'px';
            td.style.minWidth = +tdWidth + 1 + 'px';
        }

    } else {
        td.innerHTML = editingTd.data;
    }

    td.classList.remove('edit-td');
    editingTd = null;

}

function summ(value) {

    const tdArray = document.querySelectorAll('.contain');
    let res = [];

    while (res.length <= 4) {
        tdArray.forEach(td => {
            td.addEventListener('click', (e) => {
                res.push(e.target.dataset.id);
                console.log(e.target.dataset.id);
                console.log(res);

                let str = res.join(';').toUpperCase();
                console.log(str);
                return str;

            })
        })
    }

    //return res;   .split(/(?:+|-|\/|*)+/)
}

function region(value) {
    const USD = document.querySelector('.USD > h4');
    const EUR = document.querySelector('.EUR > h4');

    let result;
    let replace = value;

    let arr = value.toLowerCase().split(/[+\-,\*,\/]+/);

    arr.forEach(elem => {
        if (!/^[^a-zA-Z]*$/.test(elem.trim()) && !(elem == 'usd') && !(elem == 'eur')) {
            if ((document.querySelector('.contain[data-id="' + elem + '"]').innerHTML) != '' &&
             !isNaN(document.querySelector('.contain[data-id="' + elem + '"]').innerHTML) ||
              document.querySelector('.contain[data-id="' + elem + '"]').innerHTML.toLocaleLowerCase() == 'usd' ||
               document.querySelector('.contain[data-id="' + elem + '"]').innerHTML.toLocaleLowerCase() == 'eur')
                {
                    if (document.querySelector('.contain[data-id="' + elem + '"]').innerHTML.toLocaleLowerCase() == 'usd') {
                        replace = replace.replace(elem, USD.textContent.slice(-12, -5).replace(',', '.'));
                    }
                    if (document.querySelector('.contain[data-id="' + elem + '"]').innerHTML.toLocaleLowerCase() == 'eur') {
                        replace = replace.replace(elem, EUR.textContent.slice(-12, -5).replace(',', '.'));
                    }
                replace = replace.replace(elem, document.querySelector('.contain[data-id="' + elem + '"]').innerHTML);
            }
            else{
                replace = replace.replace(elem, 0);
            }    
        }
        if (elem == 'usd'){
            replace = replace.replace(elem, USD.textContent.slice(-12, -5).replace(',', '.'));
        }
        if (elem == 'eur') {
            replace = replace.replace(elem, EUR.textContent.slice(-12, -5).replace(',', '.'));
        }
    })

    result = eval(replace);

    return Math.trunc(result * 10000) / 10000;
}

function solution(value) {
    //let arr =value.split(/[+,-,;,:,*,/]/);

    let result;

    if (value.includes('+')) {
        let arr = value.split('+');
        result = arr.reduce((res, elem) => {
            res += Number(elem);
            return res;
        }, 0);
    }

    if (value.includes('-')) {
        let arr = value.split('-');
        result = arr.reduce((res, elem) => {
            res -= Number(elem);
            return res;
        });
    }

    if (value.includes('*')) {
        let arr = value.split('*');
        result = arr.reduce((res, elem) => {
            res *= Number(elem);
            return res;
        });
    }

    if (value.includes('/')) {
        let arr = value.split('/');
        result = arr.reduce((res, elem) => {
            res /= Number(elem);
            return res;
        });
    }

    return result;
}

function add() {
    const btnColumn = document.querySelector('.add-column');
    const btnRow = document.querySelector('.add-row');

    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let currentRow = 20;
    let currentColumn = 15;
    let id;

    btnColumn.addEventListener('click', () => {

        ++currentColumn;

        let first = Math.floor(currentColumn / 26);

        if (currentColumn > 15 && currentColumn <= 26) {
            id = alphabet[currentColumn - 1].toLowerCase();
        }
        else if ((currentColumn / 26 > 1) && first <= 26) {

            if (currentColumn == 26 * first) {
                id = alphabet[first - 2] + 'Z';
            }
            else {
                id = (alphabet[first - 1] + alphabet[(currentColumn - 26 * first) - 1]).toLowerCase();
            }

        }

        const tr = document.querySelectorAll('tr');

        tr[0].insertAdjacentHTML('beforeend', `
            <td class="column">${id.toUpperCase()}</td>
        `)

        let elements = Array.from(tr);
        elements.shift();

        elements.forEach((elem, index) => {

            elem.insertAdjacentHTML('beforeend', `
                <td class="contain" data-id="${id}${index + 1}"></td>
            `)

        })
    })

    btnRow.addEventListener('click', () => {

        table.insertAdjacentHTML('beforeend', `
        <tr class="new">
            <td class="string">${++currentRow}</td>
            <td class="contain" data-id="a${currentRow}"></td>
            <td class="contain" data-id="b${currentRow}"></td>
            <td class="contain" data-id="c${currentRow}"></td>
            <td class="contain" data-id="d${currentRow}"></td>
            <td class="contain" data-id="e${currentRow}"></td>
            <td class="contain" data-id="f${currentRow}"></td>
            <td class="contain" data-id="g${currentRow}"></td>
            <td class="contain" data-id="h${currentRow}"></td>
            <td class="contain" data-id="i${currentRow}"></td>
            <td class="contain" data-id="j${currentRow}"></td>
            <td class="contain" data-id="k${currentRow}"></td>
            <td class="contain" data-id="l${currentRow}"></td>
            <td class="contain" data-id="m${currentRow}"></td>
            <td class="contain" data-id="n${currentRow}"></td>
            <td class="contain" data-id="o${currentRow}"></td>
        </tr>
        `)

        const newRow = document.querySelectorAll('.new');
        for (let i = 0; i < currentColumn - 15; i++) {
            newRow[newRow.length - 1].insertAdjacentHTML('beforeend', `
            <td class="contain" data-id="${id}${currentRow}"></td>
            `)
        }
    })
}

add();

function changeTheme() {

    const input = document.getElementById('theme');
    const str = document.querySelectorAll('.string');
    const col = document.querySelectorAll('.column');
    const textArea = document.querySelector('.edit-area');

    const td = [...str, ...col];

    input.addEventListener('click', () => {

        if (input.checked) {
            document.body.style.backgroundColor = '#2a2a2a';
            document.body.style.color = 'white';
            table.style.backgroundColor = '#565656';

            td.forEach(elem => {
                elem.setAttribute("style", "background-color:#2a2a2a");
            })
        }

        if (!input.checked) {
            document.body.style.backgroundColor = 'white';
            document.body.style.color = 'black';
            table.style.backgroundColor = '#fafcfc';

            td.forEach(elem => {
                elem.removeAttribute("style");
            })
        }
    })

}

changeTheme();

function currencyParser() {
    //https://www.cbr-xml-daily.ru/daily_json.js
    fetch('https://iss.moex.com/iss/statistics/engines/currency/markets/selt/rates.json?iss.meta=off')
        .then((response) => {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status);
            }
            return response.json();
        })
        .then((json) => {
            // Текущий курс доллара и евро ЦБРФ

            let trendUSD = json.cbrf.data[0][json.cbrf.columns.indexOf('CBRF_USD_LASTCHANGEPRCNT')];
            let trendEUR = json.cbrf.data[0][json.cbrf.columns.indexOf('CBRF_EUR_LASTCHANGEPRCNT')];

            let USD = json.cbrf.data[0][json.cbrf.columns.indexOf('CBRF_USD_LAST')];
            let EUR = json.cbrf.data[0][json.cbrf.columns.indexOf('CBRF_EUR_LAST')];

            let USDcontainer = document.querySelector('.USD');
            let EURcontainer = document.querySelector('.EUR');

            USDcontainer.innerHTML = USDcontainer.innerHTML.replace('00,0000', `${USD}`.replace('.', ','));
            USDcontainer.innerHTML += trend(trendUSD);

            EURcontainer.innerHTML = EURcontainer.innerHTML.replace('00,0000', `${EUR}`.replace('.', ','));
            EURcontainer.innerHTML += trend(trendEUR);

            function trend(change) {
                if (change > 0) return ' ▲';
                if (change < 0) return ' ▼';
                return '';
            }


        })
        .catch((error) => {
            console.error(error);
        });

}

currencyParser();