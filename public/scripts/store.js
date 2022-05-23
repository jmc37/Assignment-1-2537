


function loadEventsToMainDiv() {
    $('main').empty();
    $.ajax({
        url: "http://localhost:5000/cart/getItems",
        type: "get",
        data: "",
        success: (r) => {
            console.log(r)
            console.log(r.cart)

            for (i = 0; i < r.cart.length; i++) {
                $('main').append(
                    `                  
                    <p>Event Text - ${r.cart[i].name}</p>
                   <p> Event Price -${r.cart[i].cost}</p>
                  <p> Event hits - ${r.cart[i].count}</p>
                <button class="likeButtons" id="${[i]}"> Like! </button>
                <button class="deleteButtons" id="${r.cart[i]["_id"]}"> Delete! </button>

`)
            }
        }
    })
}

function increaseHits(){
    x = this.id
    $.ajax({
        url: `http://localhost:5000/cart/increaseItems/${x}`,
        type: "get",
        success: function (x){
            console.log(x)
            loadEventsToMainDiv();
        }
    })
}
function deleteID(){
    x = this.id
    $.ajax({
        url: `http://localhost:5000/cart/decreaseItems/${x}`,
        type: "get",
        success: function (x){
            console.log(x)
            loadEventsToMainDiv();
        }
    })
}
function setup() {
    loadEventsToMainDiv()
    $("body").on("click", ".likeButtons", increaseHits)
    $("body").on("click", ".deleteButtons", deleteID)
}


$(document).ready(setup)