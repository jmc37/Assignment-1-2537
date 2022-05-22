    function login() {
    $.ajax({
      type: "get",
      url: `http://localhost:5000/login/${document.getElementById("uname").value}/${document.getElementById("psw").value}`,
      success: function (data){
        console.log(data);
        if (data) {
          window.location.href = 'http://localhost:5000';
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
      url: `http://localhost:5000/create/${document.getElementById("uname").value}/${document.getElementById("psw").value}`,
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
  
//   $("#logout").click(function() {
//     $.ajax({
//       type: "get",
//       url: 'http://localhost:5000/logout',
//       success: function (x){
//         console.log(x);
//         window.location.href = 'http://localhost:5000';
//       }
//     })
//   })