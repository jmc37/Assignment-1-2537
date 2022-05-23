
function get_user(){
        $.ajax({
            "url": 'http://localhost:5000/userinfo/',
            "type": "GET",
            success: (r) => {
                console.log(r)
                $('main').append(
                    `           
                    <img src="https://i.pinimg.com/originals/fe/95/bf/fe95bf35e8fec179fdaee3ba3b9b5cfc.jpg" id="girl" alt="Italian Trulli">       
                    <p>Welcome - ${r[0].user} senpai</p>
                    <p> These are your past orders</p>
`)
            }
        })
    }

function setup() {
    get_user();

}



$(document).ready(setup)