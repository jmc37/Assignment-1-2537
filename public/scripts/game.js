hasflippedcard = false
firstCard = undefined
secondCard = undefined
lockboard = false;
poke_img = []
win = 0
pokemon_total = 3
card = ''



function game() {
    console.log('called')
    if (lockboard) {
        return
    } else {
        $(this).addClass('flip')
        if (!hasflippedcard) {
            hasflippedcard = true;
            firstCard = $(this).find('.front_face')[0]
            console.log(firstCard)
        } else {
            hasflippedcard = false;
            secondCard = $(this).find('.front_face')[0]
            console.log(firstCard, secondCard)
        }
        if (secondCard) {
            if (  $(`#${firstCard.id}`).attr("src") == $(`#${secondCard.id}`).attr("src")) {
                console.log("a  match");
                $(`#${firstCard.id}`).parent().off("click")
                $(`#${secondCard.id}`).parent().off("click")
                firstCard = undefined
                secondCard = undefined
                win += 1
                if (win == pokemon_total){
                    alert("You win!")
                }
            } else {
                console.log('not a match')
                setTimeout(() => {
                    $(`#${firstCard.id}`).parent().removeClass("flip");
                    

                    $(`#${secondCard.id}`).parent().removeClass("flip")
                    firstCard = undefined
                    secondCard = undefined
                }, 1000)
                
            }
        }
    }
}



function add_img(data) {
    poke_img.push(data.sprites.other["official-artwork"].front_default)
    poke_img.push(data.sprites.other["official-artwork"].front_default)
    console.log(poke_img)
}

function cards() {
    for (i = 0; i <= 5; i++) {
        card += `
    <div class="card">
    <img id="img${i}" class="front_face" src="${poke_img[i]}" alt="">
    <img class="back_face" src="../images/pokemon.png" alt="">
</div>
    `
    }
    console.log(card)
    $("#game_grid").html(card)

}

function start_game(){
    console.log('game started')
}
// Display images
async function loadImages() {
    for (i = 1; i <= 3; i++) { // three times
        pokemon_number = Math.floor(Math.random() * 898) + 1;
        await $.ajax({
            "url": `https://pokeapi.co/api/v2/pokemon/${pokemon_number}/`,
            "type": "GET",
            "success": add_img
        })

    }
    cards();
}

function setup() {
    loadImages();
    $("body").on("click", ".card", game)


}
$(document).ready(setup)