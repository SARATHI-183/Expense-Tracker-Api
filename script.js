const amt = document.getElementById("amount-input")
const desc = document.getElementById("description-input")
const category = document.getElementsByName("cat")
const date= document.getElementById("date-input")
const expenseButton = document.getElementById("expense-btn")

expenseButton.addEventListener('click',async function(){
    //getting  radio value
    let selectedRadio
    category.forEach(element => {
        if(element.checked)
        {
            selectedRadio=element.value
        }
    })

    //request
    const respObj = await fetch('/add-expense',{
        method : 'POST',
        body : JSON.stringify({
            "Amount" : amt.value,
            "Description" : desc.value,
            "Category" : selectedRadio,
            "Date" : date.value
        }),
        headers : {
            Accept : 'application/json',
            'Content-Type' : 'application/json'
        }
    })

    const data= await respObj.json()
    console.log(data)

    //browser
    console.log({
        "Amount": amt.value,
        "Description": desc.value,
        "Category": selectedRadio,
        "Date" : date.value
    })
})