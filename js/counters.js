//var startingFrom = 1513397274680;
$(document).ready(function() {
  // initialize clipboard
  new Clipboard('#copyToClipboard');

  // form submition
  $('#emailForm').submit(function () {
      var email = $("#interested").val();
      var platform = $("#platform").val();
      if (platform == "") {
          $(".no-platform").show();
          return;
      }
      $.ajax({
          type: "POST",
          url: "/release.php",
          data: {email: email, platform: platform},
          success: function() {$("#interested").val("");$(".save-email").html("Salvata!").show();$(".no-platform").hide();},
        });
      return false;
    });

  // init counters
  initCounters();

  // start counters on numbers appear
  var waypoint = new Waypoint({
    element: document.getElementById("numbers"),
    handler: function() {
      gamesCounter.start();
      playersCounter.start();
    },
    offset: $(window).height() - 200
  })
});

/*  COUNTERS
------------------------*/
function initCounters() {
  gamesCounter = new CountUp("gamesCounter", 0, 1435, 0, 3);
  playersCounter = new CountUp("playersCounter", 0, 103, 0, 3);
}

/*  CLIPBOARD
------------------------*/
function inviteFriend() {
    $("#inviteCopiedContainer").show()
    $("#copyToClipboard").click()
    $("#inviteCopiedContainer").hide()
    $("#inviteCopied").show()
}

function check(platform) {
    $("#plat-btn").text(platform);
    $("#plat-btn").removeClass("btn-secondary").addClass("btn-primary");
    $("#platform").val(platform);
}
