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

      var requestId;
      var toStop = false;
      function stop() {
        window.cancelAnimationFrame(requestId);
        requestId = undefined;
        toStop = true;
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
      var playButton = document.getElementById('playButton');
      playButton.addEventListener('click', function(e){
          addDataToUl("pressed play button");
          var work = document.getElementById('work');
          if(work.style.display == 'none' || work.style.display == ''){
              work.style.visibility = "visible";
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

      var startButton = document.getElementById('startButton');
      var stopButton = document.getElementById('stopButton');
      var reloadButton = document.getElementById('reloadButton');  
      startButton.addEventListener('click', function(e){
          addDataToUl("pressed start button");
          toStop = false;
          startButton.style.display = 'none';
          stopButton.style.display = 'block';
          ball.style.display = 'block';
          movement();
      });
      stopButton.addEventListener('click', function(e){
          addDataToUl("pressed stop button");
          stop();
          stopButton.style.display = 'none';
          startButton.style.display = 'block';
      });
      reloadButton.addEventListener('click', function(e){
          addDataToUl("pressed reload button");
          toStop = false;
          startButton.style.display = 'block';
          stopButton.style.display = 'none';
          reloadButton.style.display = 'none';

          x = 0;
          y = 0;
      });
      var ball = document.getElementById("square");
      var container = document.getElementById("anim");

      var width = ball.offsetWidth;
      var height = ball.offsetHeight;
      var cW = container.offsetWidth;
      var cH = container.offsetHeight;
      var x = 0;
      var y = 0;
      var step = 1;
      var dx = step;
      var dy = -step;
      function movement() {
        if(!toStop){
          requestId = requestAnimationFrame(moveball);
        }else{
          ball.style.display = 'none';
        }

        function moveball(timestamp) {
          if (x <= -10){
            dx = 1;
            x = cH;
            stop();
            ball.style.display = 'none';
            startButton.style.display = 'none';
            stopButton.style.display = 'none';
            reloadButton.style.display = 'block';
            addDataToUl("got out of the box");
          } else if (x + width >= cW){
            dx = -1;
            x = cW - height ;
            addDataToUl("hit right edge");
          }
          if (y <= 1){
            dy= 1;
            y = y;
            addDataToUl("hit top edge");
          } else if (y + height >= 1 + cH){
            dy = -1;
            y = 1 + cH - height
            addDataToUl("hit bottom edge");
          }

          dt = 0.016;
          
          x += dt * dbData['square_speed'] * dx;
          y += dt * dbData['square_speed']  * dy;

          ball.style.transform = "translate(" + x + "px, " + y + "px)";

          if(!toStop){
            requestId = requestAnimationFrame(moveball);
          }else{
            ball.style.display = 'none';
          }
        }
      }
};

