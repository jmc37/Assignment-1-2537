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

function game_history(info) {
    $.ajax({
        type: "put",
        url: `http://localhost:5000/gamelog/${info}`,
        success: console.log('updated')
    })
    game_timeline();
}

function won() {
    $.ajax({
        url: `http://localhost:5000/win`,
        type: "get",
        success: update_score()
    })
}

function loser() {
    $.ajax({
        url: `http://localhost:5000/loss`,
        type: "get",
        success: update_score()
    })
}

function update_score(){
    $.ajax({
        url: "http://localhost:5000/gamelog",
        type: "get",
        data: "",
        success: (r) => {
            console.log(r)
                $('#score').append(`<p> Win ${r.win} Loss${r.loss} </p>`)
        }
    })
}


function game() {
    if (lockboard) {
        return
    } else {
        $(this).addClass('flip')
        if (!hasflippedcard) {
            hasflippedcard = true;
            firstCard = $(this).find('.front_face')[0]
        } else {
            hasflippedcard = false;
            secondCard = $(this).find('.front_face')[0]
        }
        if (secondCard) {
            if ($(`#${firstCard.id}`).attr("src") == $(`#${secondCard.id}`).attr("src")) {
                $(`#${firstCard.id}`).parent().off("click")
                $(`#${secondCard.id}`).parent().off("click")
                firstCard = undefined
                secondCard = undefined
                correct += 1
                game_history('card matched')
                if (correct == number ) {
                    loss = false
                    alert("You win!")
                    game_history('Game won!')
                    won();
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
    console.log('hello')
    poke_img.push(data.sprites.other["official-artwork"].front_default)
    poke_img.push(data.sprites.other["official-artwork"].front_default)
}

function cards() {
    console.log(poke_img)
    for (i = 0; i <= grid; i++) {
        card += `
    <div class="card">
    <img id="img${i}" class="front_face" src="${poke_img[i]}" alt="">
    <img class="back_face" src="../images/pokemon.png" alt="">
</div>
    `
    }
    $("#game_grid").html(card)

}


// Display images
async function loadImages() {
    for (d = 0; d < number; d++) { // three times
        pokemon_number = Math.floor(Math.random() * 898) + 1;
        console.log(pokemon_number)
        await $.ajax({
            "url": `https://pokeapi.co/api/v2/pokemon/${pokemon_number}/`,
            "type": "GET",
            "success": add_img
        })

    }
    cards();
}

function startTimer(duration, display) {
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
        if (minutes + seconds == 0 && loss == true) {
            alert('gameover')
            game_history('Game loss!')
            loser();
            $('#time').hide()
        }
    }
    for (i = 0; i <= duration; i++) {
        timer();
        setInterval(timer, 1000);
    }


}

function begin() {
    $('#time').show()
    difficulty = $("#difficulty option:selected").val();
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
    update_score();
    game_timeline();
    $(document).on("click", "#start_game", function () {
        card = ''
        loadImages();
        grid = $("#grid_size option:selected").val()
        number = $('#number').val();
        begin();

    })
    $("body").on("click", ".card", game)


}
$(document).ready(setup)