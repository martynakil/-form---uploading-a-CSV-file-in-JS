

const ulExcursionEl = document.querySelector('.panel__excurions')
const InputEl = document.querySelector('.uploader__input');


const ulPanel = document.querySelector('.panel__summary');

function parseString(text) {
    return text.substr(1, text.length - 2);
}

const basket = [];

InputEl.addEventListener('change', function (e) {

    e.preventDefault()
    console.log(e, 'change');

    const file = e.target.files[0];

    console.log(file);
    if (file && file.name.includes('csv')) {

    
        const reader = new FileReader();
    

        reader.onload = function (readerEvent) {
            const content = readerEvent.target.result;
            console.log(content)
            const lines = content.split(/[\r\n]+/gm);
            console.log(lines)
       
            lines.forEach(function (line) {



                const column = line.split(/\,(?=\")|\s(?=\")/gm);
                console.log(column)


                const product = {
                    id: parseString(column[0]),
                    title: parseString(column[1]),
                    description: parseString(column[2]),
                    adultPrice: parseFloat(parseString(column[3])),
                    childPrice: parseFloat(parseString(column[4])),
                }

                console.log(product);

                const proto = document.querySelector('.excurions__item--prototype');
                proto.style.display = 'none';


                const prototypeItem = proto.cloneNode(true);
                prototypeItem.style.display = 'block';
                console.log(prototypeItem)
              

                const headerItem = prototypeItem.querySelector('.excursions__header')
            
                const h1Item = prototypeItem.querySelector('.excursions__title');
        
                const pItem = prototypeItem.querySelector('.excursions__description');
          

                ulExcursionEl.appendChild(prototypeItem)

                h1Item.innerText = product.title;
                pItem.innerText = product.description;


                const inputsList = prototypeItem.querySelectorAll('input');
                const pricesList = prototypeItem.querySelectorAll('.excursions__price');

                pricesList[0].innerText = product.adultPrice;
                pricesList[1].innerText = product.childPrice;


                const form = prototypeItem.querySelector('form');
                form.addEventListener('submit', function (event) {
                    event.preventDefault();

                    product.adultNumber = parseInt(inputsList[0].value);
                    product.childNumber = parseInt(inputsList[1].value);



                   
                    if (isNaN(inputsList[0].value) || isNaN(inputsList[1].value) || inputsList[0].value === "" || inputsList[1].value === "") {
                        alert('enter a number!')
                        summaryTotalPrice.innerText = ' '
                        inputsList[0].value = ' '
                        inputsList[1].value = ' ';
                    } else {
                        basket.push(product);


                        const summaryProto = document.querySelector('.summary__item--prototype');
                        const newSummaryItem = summaryProto.cloneNode(true);
                        newSummaryItem.classList.remove('summary__item--prototype')

                        newSummaryItem.style.display = "block"

                        const sumName = newSummaryItem.querySelector('.summary__name');
                        sumName.innerText = product.title;

                        const prices = newSummaryItem.querySelector('.summary__prices');
                        prices.innerText = 'adults: ' + product.adultNumber + ' x ' + product.adultPrice + ' EUR ' +
                            ', ' +
                            'children: ' + product.childNumber + ' x ' + product.childPrice + ' EUR';

                        ulPanel.appendChild(newSummaryItem);




                        const summaryTotalPrice = newSummaryItem.querySelector('.summary__total-price');

                        summaryTotalPrice.innerText = (product.adultNumber * product.adultPrice) + (product.childNumber * product.childPrice) + ' EUR';



                        const removeBtn = newSummaryItem.querySelector('.summary__btn-remove');
                        console.log(removeBtn)



                        removeBtn.addEventListener('click', function (event) {
                            event.preventDefault();

                            const deleteItem = document.querySelector('.summary');

                            newSummaryItem.classList.add('summary__item--prototype')
                            const childrenDelete = deleteItem.querySelector('.summary__item--prototype')
                            console.log(childrenDelete)

                            document.querySelector('.summary').removeChild(childrenDelete)
                            totalPrice.innerText = getTotalPrice();

                        })



                        const totalPrice = document.querySelector('.panel__order').querySelector('.order__total-price').querySelector('span');




                        totalPrice.innerText = getTotalPrice();
                        totalPrice.style.color = "red";


                        orders.addData(data)
                        .catch(err => console.error(err))
                        .finally( loadExcursions )



                    }



                })

            })

        }

        reader.readAsText(file);
    }


    const formPanel = document.querySelector('.panel__order');
    formPanel.addEventListener('submit', function (e) {
        console.log('ok form')
        e.preventDefault();
        const name = e.target.elements.name.value;
  
        const mail = e.target.elements.email.value;
   


        const errors = [];

        if (name.length < 2) {
            errors.push('enter your name correctly!')
        }

        if (!mail.includes('@')) {
            errors.push('enter your email correctly')
        }

        console.log(errors)


        if (errors.length > 0) {
            errors.forEach(function (err) {
                const newLi = document.createElement('li');
                newLi.innerText = err;
                document.body.appendChild(newLi)
                newLi.style.color = "red";
            })

        } else {
            alert(`'Thank you for your order ${ getTotalPrice()}'`);
        }

    });




    function getTotalPrice() {



        const totalListPrice = document.querySelectorAll('.summary__item:not(.summary__item--prototype)');

        let total = 0;

        totalListPrice.forEach(function (price) {
            total += parseFloat(price.querySelector('.summary__total-price').innerText);
            console.log(total)
        })
        return total + 'eur '
    }
})