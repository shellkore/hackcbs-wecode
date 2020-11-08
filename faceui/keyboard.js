// Create a new  Use one instance for each camera
window.handsfree = new window.Handsfree({})

// // Disable click and vert scroll
Handsfree.disable('head.pointer')
Handsfree.disable('head.vertScroll')

var buttonOne = 0, buttonTwo = 0 , buttonThree = 0 , buttonFour = 0, threshold = 25 ;

var buttonFive=0 , buttonSix = 0 ;

var flag = 0 ;

// Create a simple plugin that displays pointer values on every frame
Handsfree.use('emojify', ({head}) => {

  let state = head.state

  if(state.smileLeft){
      buttonOne++;
  }else if(!state.smileLeft)
      buttonOne = 0;


  if(state.smileLeft && buttonOne == threshold){
    console.log("1st left smile");

    if(flag == 0){
    $("#first-row").click();
    flag = 1 ;
  }

  else if(flag == 1){
     $("#first-col").click();
    flag = 0 ;

  }

  }



  if(state.smileRight){
    buttonTwo++;
  }else if(!state.smileRight)
    buttonTwo = 0 ;

  if(state.smileRight && buttonTwo == threshold){
    console.log("2nd right smile");
    
    if(flag == 0){
    $("#second-row").click();
    flag = 1 ;
  }

  else if(flag == 1){
     $("#second-col").click();
    flag = 0 ;
    
  }
  }



  if(state.mouthOpen){
    buttonThree++;
  }else if(!state.mouthOpen)
    buttonThree = 0;

  if(state.mouthOpen && buttonThree == threshold){
    console.log("3rd mouthOpen");
    $("#buttonThree").click();

    if(flag == 0){
    $("#third-row").click();
    flag = 1 ;
  }

  else if(flag == 1){
     $("#third-col").click();
    flag = 0 ;
    
  }
  }

  if(state.eyesClosed){
      buttonFour++;
  }else if(!state.eyesClosed)
      buttonFour=0;

  if(state.eyesClosed && buttonFour == threshold){
    console.log("4th eyesClosed");
      if(flag == 0){
    $("#fourth-row").click();
    flag = 1 ;
  }

  else if(flag == 1){
     $("#fourth-col").click();
    flag = 0 ;
    
  }
  }

  if(state.pursed){
    buttonFive++;
  }else if(!state.pursed){
    buttonFive = 0 ;
  }

  if(state.pursed && buttonFive == threshold){
    console.log("5th pursed");
      if(flag == 0){
    $("#fifth-row").click();
    flag = 1 ;
  }

  else if(flag == 1){
     $("#fifth-col").click();
    flag = 0 ;
    
  }
  }

});
