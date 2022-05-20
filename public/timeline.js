function loadEventsToMainDiv() {
    $('main').empty();
    $.ajax({
        url: "http://localhost:5000/timeline/getAllEvents",
        type: "get",
        data: "",
        success: (r) => {
            console.log(r)
            for (i = 0; i < r.length; i++) {
                $('main').append(
                    `                  
                    <p>Event Text - ${r[i].text}</p>
                   <p> Event Time -${r[i].time}</p>
                  <p> Event hits - ${r[i].hits}</p>
                <button class="likeButtons" id="${r[i]["_id"]}"> Like! </button>
                <button class="deleteButtons" id="${r[i]["_id"]}"> Delete! </button>

`)
            }
        }
    })
}

function increaseHits(){
    x = this.id
    $.ajax({
        url: `http://localhost:5000/timeline/increasehits/${x}`,
        type: "get",
        success: function (x){
            console.log(x)
            loadEventsToMainDiv();
        }
    })
}
function deleteID(){
    x = this.id
    $.ajax({
        url: `http://localhost:5000/timeline/delete/${x}`,
        type: "get",
        success: function (x){
            console.log(x)
            loadEventsToMainDiv();
        }
    })
}
function setup() {
    loadEventsToMainDiv()
    $("body").on("click", ".likeButtons", increaseHits)
    $("body").on("click", ".deleteButtons", deleteID)
}


$(document).ready(setup)