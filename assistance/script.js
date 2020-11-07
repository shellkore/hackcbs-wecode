/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

const home = "https://4366163892ce.ngrok.io/assistance/";

const sendmail = service => {
  let msgBody;
  $(".quad")
    .prop("onclick", null)
    .off("click");

  $("#confirmation").modal("show");

  if (service === "speak") {
    var msg = new SpeechSynthesisUtterance();
    msg.text = "Hey. Is anyone there?";
    window.speechSynthesis.speak(msg);
  } else {
    if (service === "water") {
      msgBody = "Hey! Can you fetch me some water please";
    } else if (service === "food") {
      msgBody = "Hey! I am feeling hungry. Can I have some food please";
    } else if (service === "assist") {
      msgBody = "Hey! I need your assistance";
    }

    const data = JSON.stringify({
      mailid: "shivampathak339@gmail.com",
      subject: "Notification from Wecode",
      message: msgBody
    });

    const settings = {
      async: true,
      crossDomain: true,
      url: "https://wecodehackcbs.herokuapp.com/sendmail",
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      data: data
    };

    $.ajax(settings).done(function(response) {
      console.log(response);
    });
  }
  setTimeout(() => {window.location.replace(home)}, 4000);
};
