userCart = ''
subtotal = 0
tax = 0
total = 0

// catch routes for cart
function showCartData(data) {
    console.log(data)

    console.log(data.cart)
    userCart = data.cart
    cartData = ""
    for (i = 0; i < data.cart.length; i++) {
        subtotal += data.cart[i].cost * data.cart[i].count
        tax = 0.15 * subtotal
        total = subtotal + tax
        $("main").append(`
        <div class="timeline">
            <p> ${data.cart[i].name} </p>
            
            <p> $${data.cart[i].cost} </p>
            <p> Event Hits - ${data.cart[i].count} </p>
            <button class="likeButtons" id="${data.cart[i].name}"> Add more item </button>
            <button class="dislikeButtons" id="${data.cart[i].name}"> Remove 1 item </button>  
            <button class="deleteButtons" id="${data.cart[i].name}"> Delete! </button> 
        </div>
            `)
    }
    $("main").append(
        `
        <p>Subtotal: ${subtotal}</p>
        <p>Tax: ${tax}</p>
        <p>Total: ${total}</p>
        <button onclick="order()"> Checkout! </button> 
    `
    )
}




function showCartItems() {
    console.log('called')
    $.ajax({
        url: "http://localhost:5000/cart/getItems",
        type: "get",
        success: showCartData
    })

}

function increaseHits() {

    x = this.id

    $.ajax({
        url: `http://localhost:5000/cart/increaseItems/${x}`,
        type: "GET",
        success: function (r) {
            console.log(r)
            location.reload();

        }


    })
    // showCartItems()

}

function decreaseHits() {
    $('main').empty();
    x = this.id
    console.log(x)
    $.ajax({
        url: `http://localhost:5000/cart/decreaseItems/${x}`,
        type: "GET",
        success: function (r) {
            console.log(r)
            location.reload();

        }

    })

}

function deleteItems() {
    $('main').empty();
    console.log("delete function ran")
    x = this.id
    console.log(x)
    $.ajax({
        url: `http://localhost:5000/cart/RemoveItems/${x}`,
        type: "GET",
        success: function (r) {
            console.log(r)
            location.reload();

        }

    })
 


}

function order(){
    console.log('function called')
    $.ajax({
        url: `http://localhost:5000/orders/send`,
        type: "put",
        success: console.log('sucess')
    })
}
function setup() {
    showCartItems()
    $("body").on("click", ".likeButtons", increaseHits)
    $("body").on("click", ".dislikeButtons", decreaseHits)
    $("body").on("click", ".deleteButtons", deleteItems)
    



}



$(document).ready(setup)