hasflippedcard = false
firstCard = undefined
secondCard = undefined
lockboard = false;
poke_img = []
card = ''

function add_img(data) {
        poke_img.push(data.sprites.other["official-artwork"].front_default)
        poke_img.push(data.sprites.other["official-artwork"].front_default)

console.log(poke_img)
}

function cards(){
    for (i = 0; i <= 5; i++){
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
    $(".card").on('click', function () {
        console.log('called')
        if (lockboard)
            return
        $(this).addClass('flip')
        if (!hasflippedcard) {
            hasflippedcard = true;
            firstCard = $(this).find('.front_face')[0]
            console.log(firstCard)
        } else {
            hasflippedcard = false;

            // if ((firstCard) == $(this).find('.front_face')[0]) {
            //     $(`#${firstCard.id}`).parent().removeClass("flip")
            //     firstCard = undefined
            //     secondCard = undefined
            //     return
            // }

            secondCard = $(this).find('.front_face')[0]
            console.log(firstCard, secondCard)
        }
        if (secondCard)
            if (
                $(`#${firstCard.id}`).attr("src") ==
                $(`#${secondCard.id}`).attr("src")
            ) {
                console.log("a  match");
                $(`#${firstCard.id}`).parent().off("click")
                $(`#${secondCard.id}`).parent().off("click")
                firstCard = undefined
                secondCard = undefined
            }
        else {
            console.log('not a match')
            lockboard = true;
            setTimeout(() => {
                $(`#${firstCard.id}`).parent().removeClass("flip");

                $(`#${secondCard.id}`).parent().removeClass("flip")
                lockboard = false;
            }, 1000)
        }
    })
}
$(document).ready(setup)