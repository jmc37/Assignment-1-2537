   
   function login() {
    $.ajax({
      type: "get",
      url: `https://bcit-pokedex.herokuapp.com/${document.getElementById("uname").value}/${document.getElementById("psw").value}`,
      success: function (data){
        console.log(data);
        if (data) {
          window.location.href = 'https://bcit-pokedex.herokuapp.com/';
        } else {
          $("#login").append(`<br><div class="alertfailure">
          <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
          Login failed.
          </div>`);
        }
      }
    })
  }
  
  function signup() {
    $.ajax({
      type: "put",
      url: `https://bcit-pokedex.herokuapp.com/${document.getElementById("uname").value}/${document.getElementById("psw").value}`,
      success: function (x){
        if (x) {
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
  
 