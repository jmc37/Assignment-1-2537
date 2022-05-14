poke_type = 'normal'
to_add = ''
searched = ''
moves = ''
var now = new Date(Date.now());
past = []
// Get pokemon info
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
function get_random_pokemon_moves(data) {
    console.log(data)
    moves += `  <div class="img-container"> ${data.name} <br>
    <a href="/profile/${data.id}">
    <img src="${data.sprites.other["official-artwork"].front_default}"> 
    </a>
    <br>
    ${data.types[0].type.name} type
    </div>`

}
// Display pokemon
async function load_poke_type(data) {
    console.log(data)
    to_add = ''
    console.log("function called")
    for(i = 0; i < data.length; i ++){
        if (i % 3 == 1) { 
            to_add += `<div class="clearfix">`
        }

        get_random_pokemon(data[i])


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
        "url": `https://bcit-pokedex.herokuapp.com/types/${poke_type}`,
        "type": "GET",
        "success": load_poke_type
    })

}


// Name
function get_name(pokemon){
    pokemon_name = $('#name_input').val();
    addNewEvent(pokemon_name)
    $.ajax({
        "url": `https://bcit-pokedex.herokuapp.com/names/${pokemon_name}`,
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
    data = data[0]
    poke_name += `  <div class="img-container" id="small"> ${data.name} <br>
    <a href="/profile/${data.id}">
    <img src="${data.sprites.other["official-artwork"].front_default}"> 
    </a>
    <br>
    ${data.types[0].type.name} type
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
        "url": `https://bcit-pokedex.herokuapp.com/move/${move}`,
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
    for(i = 0; i < data.length; i ++){
        if (i % 3 == 1) { 
            moves += `<div class="clearfix">`
        }

        get_random_pokemon_moves(data[i])


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
        url: "https://bcit-pokedex.herokuapp.com/timeline/insert",
        type: "put",
        data: {
            text: `Client has searched for ${poke_type}`,
            hits: 1,
            time: now,
        },
        success: (res)=>{console.log('worked')}
    })
}
function setup() {
    $("#move").click(get_move)
    $("#name").click(get_name)
    $('#poke_type').change(() => {
        poke_button =$('#poke_type option:selected').val();
        addNewEvent(poke_button);
        get_Pokemon(poke_button);
        searched = poke_button;
        
    })
    $("#clear").click(clear)

    $('body').on("click", ".remove_button", hide_);
}

jQuery(document).ready(setup)