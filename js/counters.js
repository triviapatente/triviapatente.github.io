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
      inqueueCounter.start();
      //setInterval(function() { gamesCounter.update(getUpperLimit(1 / timeGames)); }, timeGames);
      //setInterval(function() { playersCounter.update(getUpperLimit(1 / timePlayers)); }, timePlayers);
      //setInterval(function() { inqueueCounter.update(getUpperLimit(1 / timeInqueue)); }, timeInqueue);
    },
    offset: $(window).height() - 200
  })
});

/*  COUNTERS
------------------------*/
/*function getUpperLimit(seed) {
  return 20 + (Date.now() - startingFrom) * seed;
}

var gamesCounter, playersCounter, inqueueCounter;
var timeGames = 40 * 1000, timePlayers = 2 * 60 * 60 * 1000, timeInqueue = 7 * 60 * 1000;*/

function initCounters() {
  gamesCounter = new CountUp("gamesCounter", 0, /*getUpperLimit(1 / timeGames)*/1435, 0, 3);
  playersCounter = new CountUp("playersCounter", 0, /*getUpperLimit(1 / timePlayers)*/52, 0, 3);
  inqueueCounter = new CountUp("inqueueCounter", 0, /*getUpperLimit(1 / timeInqueue)*/121, 0, 3);
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
