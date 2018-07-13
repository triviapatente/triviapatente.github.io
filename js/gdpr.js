
function login(emailSel, passSel, errorSel, tokencb) {
  email = $(emailSel).val();
  pass = $(passSel).val();
  request("https://www.triviapatente.it:8080/auth/login", {"user": email, "password": pass}, null, errorSel, function(success, data) {
    if(success) tokencb(data.token);
  })
}
$(document).ready(function() {
    modalConfig(".get-email", ".get-password", ".get-confirm");
    modalConfig(".revoke-email", ".revoke-password", ".revoke-confirm");
    modalConfig(".drop-email", ".drop-password", ".drop-confirm");
    $(document).on('opened', '.remodal', function () {
        disableRetypePasswordMode(".revoke-email", ".revoke-error", ".revoke-confirm");
        disableRetypePasswordMode(".drop-email", ".drop-error", ".drop-confirm");
    });
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
         headers: {"tp-session-token": token}
      }).done(function(data) {
          cb(true, data);
      }).fail(function(xhr) {
        if(xhr.status == 400) {
          $(errorSel).html("Credenziali errate. Riprova");
          cb(false);
        } else if(xhr.status != 429) {
          $(errorSel).html("Errore sconosciuto. Riprova");
          cb(false);
        }
      });
}
function revoke() {
  loginAndDropRequest(".revoke-email", ".revoke-password", ".revoke-error", ".revoke-confirm");
}
function reset(emailSel, errorSel, confirmSel) {
   $(".input").val("")
   $(".input").html("")
   disableRetypePasswordMode(emailSel, errorSel, confirmSel);
}
var retypePasswordMode = false;
var oldPassword = null
function enableRetypePasswordMode(emailSel, passSel, errorSel, confirmSel, token) {
  $(errorSel).css("color", "");
  $(errorSel).html("Sei proprio sicuro di voler procedere? Per procedere, ridigita la tua password un'altra volta nel seguente campo.");
  $(emailSel).css("visibility", "hidden");
  $(passSel).val("");
  $(emailSel + "-label").css("visibility", "hidden");
  retypePasswordMode = true;
  $(confirmSel).click(function() {
      if(oldPassword != $(passSel).val()) {
        $(errorSel).html("Le due password non coincidono, riprova!")
      }
      dropRequest(emailSel, errorSel, confirmSel, token);
  });
}
function disableRetypePasswordMode(emailSel, errorSel, confirmSel) {
  if(emailSel == ".get-email") return;
  $(errorSel).css("color", "red");
  $(emailSel).css("visibility", "visible");
  $(emailSel + "-label").css("visibility", "visible");
  retypePasswordMode = false;
  $(confirmSel).click((confirmSel == ".revoke-confirm") ? revoke : drop);
}
function loginAndDropRequest(emailSel, passSel, errorSel, confirmSel) {
  login(emailSel, passSel, errorSel, function(token) {
    enableRetypePasswordMode(emailSel, passSel, errorSel, confirmSel, token);
  });
}
function dropRequest(emailSel, errorSel, confirmSel, token) {
    request("https://triviapatente.it:8080/gdpr/drop-user", null, token, errorSel, function(success, data) {
      if(success) {
        reset(emailSel, errorSel, confirmSel);
        if(emailSel == ".drop-email")
          $(".drop-modal").remodal().close();
        else
          $(".revoke-modal").remodal().close();
        $(".drop-success-modal").remodal().open();
      } else {
        disableRetypePasswordMode(emailSel, errorSel, confirmSel);
        $(errorSel).html("Errore nella cancellazione nell'account. Riprova!");
      }
    });
}
function drop() {
  loginAndDropRequest(".drop-email", ".drop-password", ".drop-error", ".drop-confirm");
}
function download(text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', "your-data.txt");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
function get() {
  login(".get-email", ".get-password", ".get-error", function(token) {
    request("https://triviapatente.it:8080/gdpr/get-data", null, token, ".get-error", function(success, data) {
        reset(".get-email", ".get-error", ".get-confirm");
        if(success) {
           download(data);
        } else {
           $(".get-error").html("Non è stato possibile scaricare i tuoi dati per un errore nel sistema. Riprova");
        }
    })
  });
}
