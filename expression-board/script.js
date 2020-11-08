var init = function() {  
  var shift = false;
  var caps = false;
  $('.col-select').prop('disabled', true);
  $(".key").click(function() {
    // Setting the content to grab
    var content = $(this).html();
    var outputContent = $("#output").html();
    
    if (content.substr(0,4) == "<div") {
      if (shift) {
        var subDiv = $(this).find(".first-ch");
      }
      else {
        var subDiv = $(this).find(".second-ch");
      }
      content = subDiv.html();
    }
    
    // Setting special output, and then outputting
    if (content == "Backspace") {
      var stuff = outputContent;
      var x = stuff.length - 1;
      
      if (stuff.charAt(x) == ">") {
        var tagStart = stuff.lastIndexOf("<");
        $("#output").html(stuff.substr(0, tagStart));
      }
      else if (stuff.charAt(x) == ";") {
        var charStart = stuff.lastIndexOf("&");
        $("#output").html(stuff.substr(0, charStart));
      }
      else {
        $("#output").html(stuff.substr(0, x));
      }
    }
    else if (content == "Enter") {
      content = "<br />";
      $("#output").html($("#output").html() + content);
    }
    else if (content == "Tab") {
      content = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      $("#output").html($("#output").html() + content);
    }
    else if (content == "Shift") {
      if (shift) {
        shift = false;
      }
      else {
        shift = true;
      }
    }
    else if (content == "Caps Lock") {
      if (caps) {
        caps = false;
      }
      else {
        caps = true;
      }
    }
    else if (content == "Ctrl" || content == "Alt" || content == "Win" || content == "Spl") {
      
    }
    else { // i.e. a letter
      capitalize = false;

      if (shift) {
        capitalize = !capitalize;
        shift = false;
      }

      if (caps) {
        capitalize = !capitalize;
      }

      if ((content.length == 1) && capitalize) {
        content = content.toUpperCase()
      }

      $("#output").html($("#output").html() + content);
    }
    
    outputContent = $("#output").html();
    
    // creating the automatic line break
    var sinceLastTag, relevantString, start, end, snippet;
    sinceLastTag = outputContent.lastIndexOf(">");
    relevantString = outputContent.substring(sinceLastTag).replace("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", "1111");
    var relevantLength = relevantString.length;
  
    if (relevantLength > 1) {
	    start = relevantString.indexOf("&");
	    end = relevantString.indexOf(";") + 1;
	    snippet = relevantString.substring(start, end);
	    relevantString = relevantString.replace(snippet, "1");
    }
    
    if (relevantLength % 41 === 0 && relevantLength > 0) {
      var sweetSpot = outputContent.lastIndexOf(" ");
      var firstHalf = outputContent.substring(0, sweetSpot);
      var secondHalf = outputContent.substring(sweetSpot);

      $("#output").html(firstHalf + "<br />" + secondHalf);
    }
  });
};

$('#first-row').click(function(){
  console.log('first-row-selected')
  $('.row1').addClass('selected');
  $('.row-select').prop('disabled', true);
  $('.col-select').prop('disabled', false);
});
$('#second-row').click(function(){
  console.log('first-row-selected')
  $('.row2').addClass('selected');
  $('.row-select').prop('disabled', true);
  $('.col-select').prop('disabled', false);
});
$('#third-row').click(function(){
  console.log('first-row-selected')
  $('.row3').addClass('selected');
  $('.row-select').prop('disabled', true);
  $('.col-select').prop('disabled', false);
});
$('#fourth-row').click(function(){
  console.log('first-row-selected')
  $('.row4').addClass('selected');
  $('.row-select').prop('disabled', true);
  $('.col-select').prop('disabled', false);
});
$('#fifth-row').click(function(){
  console.log('first-row-selected')
  $('.row5').addClass('selected');
  $('.row-select').prop('disabled', true);
  $('.col-select').prop('disabled', false);
});
$('#first-col').click(function(){
  console.log('first-col-selected')
  $('.selected').eq(0).click();
  $('.selected' ).removeClass( "selected" );
  $('.row-select').prop('disabled', false);
  $('.col-select').prop('disabled', true);
});
$('#second-col').click(function(){
  console.log('first-col-selected')
  $('.selected').eq(1).click();
  $('.selected' ).removeClass( "selected" );
  $('.row-select').prop('disabled', false);
  $('.col-select').prop('disabled', true);
});
$('#third-col').click(function(){
  console.log('first-col-selected')
  $('.selected').eq(2).click();
  $('.selected' ).removeClass( "selected" );
  $('.row-select').prop('disabled', false);
  $('.col-select').prop('disabled', true);
});
$('#fourth-col').click(function(){
  console.log('first-col-selected')
  $('.selected').eq(3).click();
  $('.selected' ).removeClass( "selected" );
  $('.row-select').prop('disabled', false);
  $('.col-select').prop('disabled', true);
});
$('#fifth-col').click(function(){
  console.log('first-col-selected')
  $('.selected').eq(4).click();
  $('.selected' ).removeClass( "selected" );
  $('.row-select').prop('disabled', false);
  $('.col-select').prop('disabled', true);
});

$(document).ready(function() {
  init();
});