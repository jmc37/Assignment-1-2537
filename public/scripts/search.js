
poke_type = 'normal'
to_add = ''
searched = ''
moves = ''
past = []
var now = new Date(Date.now());
// Get pokemon info
function get_random_pokemon(data) {
    console.log(data)
    to_add += `  <div class="img-container"> ${data.name} <br>
    <a href="/profile/${data.id}">
    <img src="${data.sprites.other["official-artwork"].front_default}"> 
    </a>
    <br>
    ${data.types[0].type.name} type
    <button class="add-cart" id="${data.name}">Add to Cart</button>
    </div>`

}
function get_random_pokemon_moves(data) {
    console.log(data)
    moves += `  <div class="img-container"> ${data.name} <br>
    <a href="/profile/${data.id}">
    <img src="${data.sprites.other["official-artwork"].front_default}"> 
    </a>
    <br>
    ${data.types[0].type.name} type
    <button class="add-cart" id="${data.name}">Add to Cart</button>
    </div>`

}
// Display pokemon
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
    $("main").html(to_add)
    poke_button = `<button onclick="history_return(to_add)">${searched}</button>`
    history();
}


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
    types = ''

    for(i = 0; i < data.results.length; i ++){
        types += `<option value="${data.results[i].name}">${data.results[i].name}</option>`
        types += '<br>'
    }
    console.log(types)
    $('#poke_type').html(types)
}

// Get's pokemon that are the same type
function get_types(){
    console.log('working')
    $.ajax({
        "url": `https://pokeapi.co/api/v2/type`,
        "type": "GET",
        "success": loadtypes
    })

}
// Name
function get_name(pokemon){
    pokemon_name = $('#name_input').val();
    addNewEvent(pokemon_name)
    $.ajax({
        "url": `https://pokeapi.co/api/v2/pokemon/${pokemon_name}`,
        "type": "GET",
        "success": get_pokemon_name,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Incorrect Input");
         }

    })
}
function get_pokemon_name(data){
    poke_name = ''
    console.log(data)
    poke_name += `  <div class="img-container" id="small"> ${data.name} <br>
    <a href="/profile/${data.id}">
    <img src="${data.sprites.other["official-artwork"].front_default}"> 
    </a>
    <br>
    ${data.types[0].type.name} type
    <button class="add-cart" id="${data.name}">Add to Cart</button>
    </div>`
    $("main").html(poke_name)
    poke_button = `<button onclick="history_return(poke_name)">${pokemon_name}</button>`
    history();
}

function history_return(data){
    $("main").html(data)
}



// Move

function get_move(){
    move = $('#move_input').val();
    addNewEvent(move)
    searched = move
    $.ajax({
        "url": `https://pokeapi.co/api/v2/move/${move}`,
        "type": "GET",
        "success": get_pokemon_move,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Incorrect Input");
         }
    })
}
async function get_pokemon_move(data) {
    moves = ''
    console.log("function called")
    for(i = 1; i < data.learned_by_pokemon.length; i ++){
        if (i % 3 == 1) { 
            moves += `<div class="clearfix">`
        }

        await $.ajax({
            "url": `https://pokeapi.co/api/v2/pokemon/${data.learned_by_pokemon[i].name}/`,
            "type": "GET",
            "success": get_random_pokemon_moves
        })


        if (i % 3 == 0) { // only when i= 3, 6, 9
            moves += `</div>`
        }
    }
    $("main").html(moves)
    poke_button = `<button onclick="history_return(moves)">${searched}</button>`
    history();
}

function history(){
    button_text = "<button class='remove_button'>Hide this</button>"
    styled_output = "<span id='search'>" + poke_button + button_text +"</span>";
    $('.history').append(styled_output)
}
// Removes buttons
function hide_(){
    $(this).parent().remove();
}

function clear(){
    $('.history').html(" ")
}
function addNewEvent(poke_type){
    $.ajax({
        url: "http://localhost:5000/timeline/insert/",
        type: "put",
        data: {
            text: `Client has searched for ${poke_type}`,
            hits: 1,
            time: now,
        },
        success: (res)=>{console.log('worked')}
    })
}
function addNewEvent(poke_type){
    $.ajax({
        url: "http://localhost:5000/timeline/insert/",
        type: "put",
        data: {
            text: `Client has searched for ${poke_type}`,
            hits: 1,
            time: now,
        },
        success: (res)=>{console.log('worked')}
    })
}
function addPokemon(pokemon){
    $.ajax({
        url: "http://localhost:5000/cart/insert/",
        type: "put",
        data: {
            text: pokemon,
            hits: 1,
            time: now,
        },
        success: (res)=>{console.log('worked')}
    })
}


function addCartItem(){
    x = this.id 
    $.ajax({
        url: `http://localhost:5000/cart/add/${x}`,
        type: "get",
    })
}

function setup() {
    get_types();
    $("#move").click(get_move)
    $("#name").click(get_name)
    $('#poke_type').change(() => {
        poke_button =$('#poke_type option:selected').val();
        addNewEvent(poke_button);
        get_Pokemon(poke_button);
        searched = poke_button
    })
    $("#clear").click(clear)
    $(document).on("click", ".add-cart", addCartItem)
    $('body').on("click", ".remove_button", hide_);
}

jQuery(document).ready(setup)