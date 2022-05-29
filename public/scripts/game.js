hasflippedcard = false
firstCard = undefined
secondCard = undefined
lockboard = false;
poke_img = []
pokemon = []
grid = undefined
win = 0
loss = true
correct = 0
pokemon_total = 3
card = ''
number = undefined
all = undefined


function game_history(info) {
    $.ajax({
        type: "put",
        url: `https://bcit-pokedex.herokuapp.com/gamelog/${info}`,
        success: console.log('updated')
    })
    game_timeline();
}

function won() {
    $.ajax({
        url: `https://bcit-pokedex.herokuapp.com/win`,
        type: "get",
        success: update_score()
    })
}

function loser() {
    $.ajax({
        url: `https://bcit-pokedex.herokuapp.com/loss`,
        type: "get",
        success: update_score()
    })
}

function update_score(){
    $.ajax({
        url: "https://bcit-pokedex.herokuapp.com/gamelog",
        type: "get",
        data: "",
        success: (r) => {
            console.log(r)
                $('#score').html('')
                $('#score').append(`<p> Win ${r.win} Loss ${r.loss} </p>`)
        }
    })
}

function add_img(data) {
    if (number == 2){
    poke_img.push(data.sprites.other["official-artwork"].front_default)
    poke_img.push(data.sprites.other["official-artwork"].front_default)
    poke_img.push(data.sprites.other["official-artwork"].front_default)
    poke_img.push(data.sprites.other["official-artwork"].front_default)
    }
    else{
        poke_img.push(data.sprites.other["official-artwork"].front_default)
        poke_img.push(data.sprites.other["official-artwork"].front_default)
    }
}

function shuffle(){
    m = 0;
    console.log(all)
    while(m < all){
    digit = Math.floor(Math.random() * poke_img.length);
    pokemon.push(poke_img[digit])
    poke_img.splice(digit, 1)
    m++
    }
    cards();
}

function cards() {
    console.log(pokemon)
    for (i = 0; i <= grid; i++) {
        card += `
    <div class="card">
    <img id="img${i}" class="front_face" src="${pokemon[i]}" alt="">
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
        await $.ajax({
            "url": `https://bcit-pokedex.herokuapp.com/${pokemon_number}/`,
            "type": "GET",
            "success": add_img
        })

    }
    all = poke_img.length
    shuffle();
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
                $(`#card-${firstCard}`).prop("onclick", null);
                $(`#card-${secondCard}`).prop("onclick", null);
                firstCard = undefined
                secondCard = undefined
                correct += 1
                game_history('card matched')
                console.log(correct)
                if (correct == (+grid + 1) / 2 ) {
                    loss = false
                    $('#time').hide()
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
            $("#game_grid").html('')
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
        display = $('#time')[0];
    startTimer(time, display);
}


function game_timeline() {
    $('#game_history').empty();
    $.ajax({
        url: "https://bcit-pokedex.herokuapp.com/gamelog",
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
        grid = $("#grid_size option:selected").val()
        number = $('#number').val();
        loadImages();
        begin();
        var audio = $("audio")[0];
        audio.volume = 0.1;
        audio.play();

    })
    $("body").on("click", ".card", game)


}
$(document).ready(setup)