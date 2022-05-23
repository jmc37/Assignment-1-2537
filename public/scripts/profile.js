subtotal = 0
total = (subtotal * 1000) * 1.15
function get_user() {
    $.ajax({
            "url": 'http://localhost:5000/userinfo/',
            "type": "GET",
            success: (r) => {
                console.log(r)
                console.log(r[0].orders)
                $('main').append(
                    `           
                    <img src="https://i.pinimg.com/originals/fe/95/bf/fe95bf35e8fec179fdaee3ba3b9b5cfc.jpg" id="girl" alt="Italian Trulli">       
                    <p>Welcome - ${r[0].user} senpai</p>
                    <p> These are your past orders</p>       
`)
                for (i = 0; i < r[0].orders.length; i++) {
                    $('main').append(`
                    <div>
                    <p> Order ${i} </p>
    `)
                    for (j = 0; j < r[0].orders[i].length; j++) {
                        subtotal = r[0].orders[i].length
                        $('main').append(`
                        <p> ${r[0].orders[i][j].name} $${r[0].orders[i][j].cost} </p>

                        </div>
        `)

                    }
                }
            }
        })
    }




    function setup() {
        get_user();

    }



    $(document).ready(setup)