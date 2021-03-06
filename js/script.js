var dbData;
  $.ajax({
    url: 'getData.php',
    type: 'GET',
    data: {},
    success: function (result) {
        dbData = JSON.parse(result);
    }
  });

window.onload  = function() {  
    square_speed = prompt("Set square speed");
    var ToDBData;
    $.ajax({
      url: 'sendData.php',
      type: 'POST',
      data: {ajax: true, name: 'square_speed', value: square_speed},
      success: function (result) {
        ToDBData = JSON.parse(result);
      }
    });
    var playButton = document.getElementById('playButton');
    playButton.addEventListener('click', function(e){
        addDataToUl("pressed play button");
        var work = document.getElementById('work');
        if(work.style.display == 'none' || work.style.display == ''){
            work.style.display = 'block';
        }
    });
    var closeButton = document.getElementById('closeButton');
    closeButton.addEventListener('click', function(e){
        addDataToUl("pressed close button");
        var work = document.getElementById('work');
        if(work.style.display == 'block'){
            work.style.display = 'none';
        }
    });


    var canvas = document.getElementById('anim');    
    canvas.width = 500;
    canvas.height = 500;
    var context = canvas.getContext("2d");
    drawFrame();
    //Level properties
    var level = {
        x: -20,
        y: 1,
        width: canvas.width,
        height: canvas.height
    };
    
    //The Square
    var square = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        xdir: 0,
        ydir: 0,
        speed: 0      
    };
    
    //Initializing the square
    square.width = 10;
    square.height = 10;
    square.x = level.x + (level.width - square.width) / 2;
    square.y = level.y + (level.height - square.height) / 2;
    square.xdir = 1;
    square.ydir = 1;
    square.speed = dbData['square_speed'];

    //Enter the main loop

    var startButton = document.getElementById('startButton');
    var stopButton = document.getElementById('stopButton');
    var reloadButton = document.getElementById('reloadButton');
    var doAnim = true;
    var requestId;

    startButton.addEventListener('click', function(e){
        addDataToUl("pressed start button");
        doAnim = true;
        startButton.style.display = 'none';
        stopButton.style.display = 'block';
        main();
    });
    stopButton.addEventListener('click', function(e){
        addDataToUl("pressed stop button");
        doAnim = false;
        stop();
        stopButton.style.display = 'none';
        startButton.style.display = 'block';
    });
    reloadButton.addEventListener('click', function(e){
        addDataToUl("pressed reload button");
        doAnim = true;
        startButton.style.display = 'block';
        stopButton.style.display = 'none';
        reloadButton.style.display = 'none';
        square.x = level.x + (level.width - square.width) / 2;
        square.y = level.y + (level.height - square.height) / 2;
    });

    function main() {
        if(doAnim){
            requestId = window.requestAnimationFrame(main);
            //Request animation frames
            //Update and render the game
            update();
            render();
        }
        
    }
    function stop() {
        context.fillStyle = "green";
        context.fillRect(square.x, square.y, square.width, square.height);
        window.cancelAnimationFrame(requestId);
        requestId = undefined;
    }
      function update(){
        dt = 0.016;
        
        //Move the square
        square.x += dt * square.speed * square.xdir;
        square.y += dt * square.speed * square.ydir;
        
        //Handle left and right collissions with the level
        if (square.x <= level.x){
          //left edge
          square.xdir = 1;
          square.x = level.x;
          stop();
          startButton.style.display = 'none';
          stopButton.style.display = 'none';
          reloadButton.style.display = 'block';
          addDataToUl("got out of the box");
        } else if (square.x + square.width >= level.x + level.width + 20){
          square.xdir = -1;
          square.x = level.x + level.width - square.width + 20;
          addDataToUl("hit right edge");
        }
        
        //Handle top and bottom collisiosns with the level
        if (square.y <= level.y){
          //Top edge
          square.ydir = 1;
          square.y = level.y;
          addDataToUl("hit top edge");
        } else if (square.y + square.height >= level.y + level.height){
          square.ydir = -1;
          square.y = level.y + level.height - square.height
          addDataToUl("hit bottom edge");
        }
        
      }
      
      function render(){
        //Draw that shit
        drawFrame();
        //Drawing the square
        context.fillStyle = "green";
        context.fillRect(square.x, square.y, square.width, square.height);
      }
      
      //Function to draw everything
      function drawFrame(){
        //Draw background and border
        var blueprint_background = new Image();
        blueprint_background.src = "img/"+dbData['canvas_iamge']; 
        blueprint_background.onload = function(){
            var pattern = context.createPattern(this, "repeat");
            context.fillStyle = pattern;
            context.fillRect(0, 0, canvas.width, canvas.height);
        };
        
          
      }
      function addDataToUl(element){
        ul = document.getElementById('operations');
        var li = document.createElement('li');
        li.setAttribute('class','item');

        ul.appendChild(li);
        currentdate = new Date(); 
        var datetime = "[" + currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear() + "-"  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds()+"]";
        li.innerHTML += datetime + " " + element;
        localStorage.setItem(datetime,element);
      }
};

