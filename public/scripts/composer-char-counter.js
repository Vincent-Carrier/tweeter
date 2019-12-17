$(document).ready(function() {
  $("textarea").on("keydown", e => {
    let len = $("textarea").val().length;
    let left = 139 - len;
    $(".counter").text(len ? left : 140);
    if (left < 0) {
      $(".counter").css("color", "red");
    } else {
      $(".counter").css("color", "#545149");
    }
  });
});
