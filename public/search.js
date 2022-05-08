poke_type = 'normal'
to_add = ''
function get_random_pokemon(data) {
    console.log(data)
    to_add += `  <div class="img-container"> ${data.name} <br>
    <a href="/profile/${data.id}">
    <img src="${data.sprites.other["official-artwork"].front_default}"> 
    </a>
    <br>
    ${data.types[0].type.name} type
    </div>`

}

async function load_poke_type(data) {
    to_add = ''
    console.log("function called")
    for(i = 1; i < data.pokemon.length; i ++){
        if (i % 3 == 1) { 
            to_add += `<div class="clearfix">`
        }

        await $.ajax({
            "url": `https://pokeapi.co/api/v2/pokemon/${data.pokemon[i].pokemon.name}/`,
            "type": "GET",
            "success": get_random_pokemon
        })


        if (i % 3 == 0) { // only when i= 3, 6, 9
            to_add += `</div>`
        }
    }
    jQuery("main").html(to_add)
}

// Add pokemon types to main
// function display(data){
//     console.log(data)
//     pokemon = ''
//     for(i = 0; i < data.pokemon.length; i ++){
//         pokemon += `${data.pokemon[i].pokemon.name}`
//         pokemon += '<br>'
//     }
//     $('main').html(pokemon)
// }

// Get pokemon with type selected
function get_Pokemon(poke_type){
    console.log('working')
    $.ajax({
        "url": `https://pokeapi.co/api/v2/type/${poke_type}`,
        "type": "GET",
        "success": load_poke_type
    })

}

// Populates Type Search Options
function loadtypes(data){
    console.log(data)
    types = ''

    for(i = 0; i < data.results.length; i ++){
        types += `<option value="${data.results[i].name}">${data.results[i].name}</option>`
        types += '<br>'
    }
    console.log(types)
    $('#poke_type').html(types)
}

function get_types(){
    console.log('working')
    $.ajax({
        "url": `https://pokeapi.co/api/v2/type`,
        "type": "GET",
        "success": loadtypes
    })

}



function setup() {
    get_types();
    $('#poke_type').change(() => {
        poke_type =$('#poke_type option:selected').val();
        get_Pokemon(poke_type);
    })
}

jQuery(document).ready(setup)