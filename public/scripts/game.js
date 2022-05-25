hasflippedcard = false
firstCard = undefined
secondCard = undefined

function setup(){
    $('.card').on('click', function (){
        $(this).toggleClass("flip");

        if(!hasFlippedCard){
            firstCard = $(this).find('.front_face')[0]

            
        }
    })
}