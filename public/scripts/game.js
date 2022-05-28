hasflippedcard = false
firstCard = undefined
secondCard = undefined
lockboard = false;
poke_img = []
grid = undefined
win = 0
loss = true
correct = 0
pokemon_total = 3
card = ''

function game_history(info){
    console.log(info)
    $.ajax({
        type: "put",
        url: `http://localhost:5000/gamelog/${info}`,
        success: console.log('updated')
      })
      game_timeline();
}

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
                correct += 1
                game_history('card matched')
                if (correct == pokemon_total){
                    loss = false
                    alert("You win!")
                    game_history('Game won!')
                }
            } else {
                game_history('Not a match!')
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
    for (i = 0; i <= grid; i++) {
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
    for (d = 1; d < number; d++) { // three times
        pokemon_number = Math.floor(Math.random() * 898) + 1;
        await $.ajax({
            "url": `https://pokeapi.co/api/v2/pokemon/${pokemon_number}/`,
            "type": "GET",
            "success": add_img
        })

    }
    cards();
}

function startTimer(duration, display) {
    console.log(duration)
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        // get the number of seconds that have elapsed since 
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds; 
        if(minutes + seconds == 0 && loss == true){
            alert('gameover')
            game_history('Game loss!')
            $('#time').hide()
        }
    }
        for (i = 0; i <= duration; i++){
        timer();
setInterval(timer, 1000);
        }

    
}

function begin() {
    $('#time').show()
    difficulty = $("#difficulty option:selected").val();
    console.log(difficulty)
    var time = 60 * difficulty,
    display = document.querySelector('#time');
    startTimer(time, display);
}


function game_timeline() {
    $('#game_history').empty();
    $.ajax({
        url: "http://localhost:5000/gamelog",
        type: "get",
        data: "",
        success: (r) => {
            console.log(r)
            for (k = 0; k < r.game.length; k++) {
                $('#game_history').append(
                    `                  
                    <p>${r.game[k].info}</p>

`)
            }
        }
    })
}
function setup() {
    game_timeline()
    $(document).on("click", "#start_game",  function (){
        card = ''
        loadImages();
        grid = $("#grid_size option:selected").val()
        number = $('#number').val();
        console.log(number)
        begin()

    })
    $("body").on("click", ".card", game)


}
$(document).ready(setup)