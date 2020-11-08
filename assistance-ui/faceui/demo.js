// Create a new  Use one instance for each camera
window.handsfree = new window.Handsfree({})

// // Disable click and vert scroll
Handsfree.disable('head.pointer')
Handsfree.disable('head.vertScroll')

var buttonOne = 0, buttonTwo = 0 , buttonThree = 0 , buttonFour = 0, threshold = 50 ;

var buttonFive=0 , buttonSix = 0 ;


// Create a simple plugin that displays pointer values on every frame
Handsfree.use('emojify', ({head}) => {

  let state = head.state

  if(state.smileLeft){
      buttonOne++;
  }else if(!state.smileLeft)
      buttonOne = 0;


  if(state.smileLeft && buttonOne == threshold){
    console.log("1st left smile");

    $("#buttonOne").click();

  }



  if(state.smileRight){
    buttonTwo++;
  }else if(!state.smileRight)
    buttonTwo = 0 ;

  if(state.smileRight && buttonTwo == threshold){
    console.log("2nd right smile");
    $("#buttonTwo").click();
  }



  if(state.mouthOpen){
    buttonThree++;
  }else if(!state.mouthOpen)
    buttonThree = 0;

  if(state.mouthOpen && buttonThree == threshold){
    console.log("3rd mouthOpen");
    $("#buttonThree").click();
  }

  if(state.eyesClosed){
      buttonFour++;
  }else if(!state.eyesClosed)
      buttonFour=0;

  if(state.eyesClosed && buttonFour == threshold){
    console.log("4th eyesClosed");
    $("#buttonFour").click();
  }

  if(state.pursed){
    buttonFive++;
  }else if(!state.pursed){
    buttonFive = 0 ;
  }

  if(state.pursed && buttonFive == threshold){
    console.log("5th pursed");
    $("#buttonFive").click();
  }

});
