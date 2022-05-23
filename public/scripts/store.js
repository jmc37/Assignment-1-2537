userCart = ''

// catch routes for cart
function showCartData(data) {
    console.log(data)

    console.log(data.cart)
    userCart = data.cart
    cartData = ""
    for (i = 0; i < data.cart.length; i++) {
        console.log(data._id)

        $("main").append(`
        <div class="timeline">
            <p> ${data.cart[i].name} </p>
            
            <p> $${data.cart[i].cost} </p>
            
            <p> Event Hits - ${data.cart[i].count} </p>
            <button class="likeButtons" id="${data.cart[i].name}"> Add more item </button>
            <button class="dislikeButtons" id="${data.cart[i].name}"> Remove 1 item </button>  
            <button class="deleteButtons" id="${data.cart[i].name}"> Delete! </button> 
            <button class="orderButtons" id="${data.cart[i].name}"> Add to Order! </button> 
        </div>
            `)
    }
}


function loadCartItems(data) {
    $.ajax({
        url: "http://localhost:5000/cart/getItems",
        type: "GET",
        success: showCartData
    })

}



function showCartItems() {
    $.ajax({
        url: "http://localhost:5000/cart/getItems",
        type: "get",
        success: loadCartItems
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
    console.log("decreasse function ran")
    x = this.id
    console.log(x)
    $.ajax({
        url: `http://localhost:5000/cart/decreaseItems/${x}`,
        type: "GET",
        success: function (r) {
            console.log(r)

        }

    })
    showCartItems()

}

function deleteTimeline() {
    $('main').empty();
    console.log("delete function ran")
    x = this.id
    console.log(x)
    $.ajax({
        url: `http://localhost:5000/cart/RemoveItems/${x}`,
        type: "GET",
        success: function (r) {
            console.log(r)

        }

    })
    showCartItems()


}

function orderButtons(){
    x = this.id
    $.ajax({
        url: `http://localhost:5000/order/add/${x}`,
        type: "GET",
        success: function(x){
            console.log(x)

        }
    })
    showCartItems()
}
function setup() {
    showCartItems()
    $("body").on("click", ".likeButtons", increaseHits)
    $("body").on("click", ".dislikeButtons", decreaseHits)
    $("body").on("click", ".deleteButtons", deleteTimeline)
    $("body").on("click", ".orderButtons", orderButtons)



}



$(document).ready(setup)