to_add = ''

// Get pokemon info
function get_random_pokemon(data) {
    console.log(data)
    data = data[0]
    to_add += `  <div class="img-container"> ${data.name} <br>
    <a href="/profile/${data.id}">
    <img src="${data.sprites.other["official-artwork"].front_default}"> 
    </a>
    <br>
    Type: ${data.types[0].type.name}
    </div>`

}

// Display images
async function loadImages() {
    for (i = 1; i <= 9; i++) { // Nine times
        if (i % 3 == 1) { // only when i= 1, 4, 7
            to_add += `<div class="clearfix">`
        }

        pokemon_number = Math.floor(Math.random() * 30) + 1;
        await $.ajax({
            "url": `http://localhost:5000/index/${pokemon_number}/`,
            "type": "GET",
            "success": get_random_pokemon
        })


        if (i % 3 == 0) { // only when i= 3, 6, 9
            to_add += `</div>`
        }
    }
    $("main").html(to_add)
}

function setup() {
    loadImages();
    
}

jQuery(document).ready(setup)