hasflippedcard = false
firstCard = undefined
secondCard = undefined


$(".card").on('click', function () {
    $(this).toggleClass("flip");

    // if (!hasFlippedCard) {
    //     firstCard = $(this).find('.front_face')[0]
    //     console.log(firstCard)
    //     hasFlippedCard = true;
    // } else {
    //     secondCard = $(this).find('.front_face')[0]
    // }
    // if (
    //     $(`#$(firstCard.id)`).attr("src") ==
    //     $(`#$(secondCard.id)`).attr("src")
    // ) {
    //     console.log('a match!');
    // } else {
    //     console.log('not a match!');
    // }
})