subtotal = 0
total = (subtotal * 1000) * 1.15
user_timeline = ''
user_id = null

function get_user() {
  $('#purchase_timeline').empty();
  $.ajax({
    "url": 'http://localhost:5000/userinfo/',
    "type": "GET",
    success: (r) => {
      user_id = r[0]._id
      $('#purchasetimeline').append(
        `           
                    <p>Welcome - ${r[0].user} senpai</p>
                    <p> These are your past orders</p>       
`)
      for (i = 0; i < r[0].orders.length; i++) {
        subtotal = 0
        $('#purchase_timeline').append(`
                    <div>
                    <p> Order ${i} </p>
    `)
        for (j = 0; j < r[0].orders[i].length; j++) {
          subtotal += r[0].orders[i][j].cost
          $('#purchase_timeline').append(`
                        <p> ${r[0].orders[i][j].name} $${r[0].orders[i][j].cost} </p>

                        </div>
        `)
        }
        total = subtotal * 1.15
        $('#purchase_timeline').append(`Total $${total.toFixed(2)}`)
      }
      if (r[0].admin) {
        $('#admin').show();
        $('#create_users').show();
        admin()
      }
    }
  })


}


function admin() {
  $('#admin').empty();
  console.log('called')
  $.ajax({
    "url": 'http://localhost:5000/admin/',
    "type": "GET",
    success: (users) => {
      console.log(users.length)
      for (i = 0; i <= users.length; i++) {
        console.log(users[i].user)
        $('#admin').append(
          `
                     ${users[i].user}
                     <button class="editButtons" id="${users[i]["_id"]}"> Edit! </button>
                     <button class="deleteButtons" id="${users[i]["_id"]}"> Delete! </button>
                     <button class="adminButtons" id="${users[i]["_id"]}"> Make admin! </button>

                     <br>

            `
        )
      }
    }
  })

}

function deleteID() {
  x = this.id
  if (x == user_id) {
    alert("Can't delete your own account")
  } else {
    $.ajax({
      url: `http://localhost:5000/user/delete/${x}`,
      type: "get",
      success: function (x) {
        alert("account deleted")
      }
    })
    admin();
  }
}

function editID() {
  console.log('edit id called')
  x = this.id
  if (x == user_id) {
    alert("Can't edit your own account")
  } else {
    $.ajax({
      url: `http://localhost:5000/user/edit/${document.getElementById("uname").value}/${document.getElementById("psw").value}/${x}`,
      type: "get",
      success: function (x) {
        alert('change succesful')
      }
    })
    admin();
  }
}

function makeAdmin() {
  console.log('edit id called')
  x = this.id
  if (x == user_id) {
    alert("Can't edit your own account")
  } else {
    $.ajax({
      url: `http://localhost:5000/user/makeAdmin/${document.getElementById("uname").value}/${document.getElementById("psw").value}/${x}`,
      type: "get",
      success: function (x) {
        alert('Made an admin')
      }
    })
    admin();
  }
}

function logout() {
  console.log('called')
  $.ajax({
    type: "get",
    url: 'http://localhost:5000/logout',
    success: function (x) {
      console.log(x);
      window.location.href = 'http://localhost:5000/';
    }
  })
}

// Signup Function
function signup() {
  if($("#admin_user").is(':checked')) {
    console.log("admin function called")
    $.ajax({
      type: "put",
      url: `http://localhost:5000/admin/${document.getElementById("uname").value}/${document.getElementById("psw").value}`,
      success: function (x) {
        if (x) {
          admin();
          console.log(x);
          $("#login").append(`<br><div class="alertsuccess">
              <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
              Successfully created account.
              </div>`);
        } else {
          $("#login").append(`<br><div class="alertfailure">
              <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
              <p>Failed to create account.</p><p>Username and password combination is taken.</p>
              </div>`);
        }
      }
    })
  } else {
    $.ajax({
      type: "put",
      url: `http://localhost:5000/create/${document.getElementById("uname").value}/${document.getElementById("psw").value}`,
      success: function (x) {
        if (x) {
          admin();
          console.log(x);
          $("#login").append(`<br><div class="alertsuccess">
            <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
            Successfully created account.
            </div>`);
        } else {
          $("#login").append(`<br><div class="alertfailure">
            <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
            <p>Failed to create account.</p><p>Username and password combination is taken.</p>
            </div>`);
        }
      }
    })
  }
}

function setup() {
  $('#admin').hide();
  $('#create_users').hide();
  get_user();
  $("body").on("click", ".deleteButtons", deleteID)
  $("body").on("click", ".editButtons", editID)
  $("body").on("click", ".adminButtons", makeAdmin)



}



$(document).ready(setup)