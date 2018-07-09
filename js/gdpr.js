
function login(emailSel, passSel, errorSel, tokencb) {
  email = $(emailSel).val();
  pass = $(passSel).val();
  request("https://www.triviapatente.it:8080/ws/auth/login", {"user": email, "password": pass}, null, function(success, data) {
    if(success) tokencb(data.token);
  })
}
$(document).ready(function() {
    modalConfig(".get-email", ".get-password", ".get-confirm");
    modalConfig(".revoke-email", ".revoke-password", ".revoke-confirm");
    modalConfig(".drop-email", ".drop-password", ".drop-confirm");
});
function modalConfig(emailSel, passSel, confirmSel) {
  $(confirmSel).css("visibility", "hidden");
  $(emailSel + ", " + passSel).keyup(function() {
     email = $(emailSel).val();
     pass = $(passSel).val();
     if(email != null && pass != null && email.length > 0 && pass.length > 0)
        $(confirmSel).css("visibility", "visible");
     else
        $(confirmSel).css("visibility", "hidden");
  })
}
function request(url, params, token, errorSel, cb) {
  $.ajax({
         url: url,
         data: params,
         type: "POST",
         headers: {"tp-session-token": token},
         success: function(data) { cb(true, data); },
         fail: function(error) {
           console.log(error);
           if(error.status == 400) {
             $(errorSel).val("Credenziali errate. Riprova");
           } else {
             $(errorSel).val("Errore sconosciuto. Riprova");
           }
           cb(false)
         }
      });
}
function revoke() {
  login(".revoke-email", ".revoke-password", ".revoke-error", function(token) {
     request(":8080/gdpr/drop-user", null, token, ".revoke-error", function(success, data) {
       alert(success)
     })
  });
}
function reset() {
   $(".input").val("")
}
function drop() {
  login(".drop-email", ".drop-password", ".drop-error", function(token) {
    request(":8080/gdpr/drop-user", null, token, ".revoke-error", function(success, data) {
      reset();
      alert(success)
    })
  });
}
function get() {
  login(".get-email", ".get-password", ".get-error", function(token) {
    request(":8080/gdpr/get-data", null, token, ".revoke-error", function(success, data) {
        reset();
        alert(success)
    })
  });
}
