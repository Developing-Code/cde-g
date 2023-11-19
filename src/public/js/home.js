window.addEventListener("mousemove", function(e) {
  var circle = document.getElementById("circle");
  circle.style.left = e.pageX + "px";
  circle.style.top = e.pageY + "px";

  // Set the transition duration to be longer than the mouse movement
  circle.style.transitionDuration = "0.2s";
  circle.style.transitionTimingFunction = "ease-out";
});