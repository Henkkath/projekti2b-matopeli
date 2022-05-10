$(function(){
    //Muuttujia
    var canvas = $('#canvas')[0];
    var ctx = canvas.getContext('2d');
    var mato = [
        { x: 50, y: 100, oldX: 0, oldY: 0 },
        { x: 50, y: 90, oldX: 0, oldY: 0 },
        { x: 50, y: 80, oldX: 0, oldY: 0 },
    ];

    var omena = {x:200, y: 200, eaten: false};
    var matoL = matoK = 10;
    var blockSize = 10;

    //keycodet nuolinäppäimille
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    
    //muuttujia
    var keyPressed = DOWN;
    var score = 0;
    var game;
    
    //gameLoop funktion ajastus, ajastusta muuttamalla voi vaihtaa pelin vaikeusastetta
    game = setInterval(gameLoop, 150);
    
    //Peli perustuu funktioon joka looppaa alle tehtyjä funktioita
    function gameLoop(){
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
    }
    //Funktio joka liikuttaa matoa painettujen näppäinten mukaan
    function moveSnake(){
        $.each(mato, function(index, value){
            mato[index].oldX = value.x;
            mato[index].oldY = value.y;
            if(index == 0){
                if(keyPressed == DOWN) {
                    mato[index].y = value.y + blockSize;
                } else if (keyPressed == UP){
                    mato[index].y = value.y - blockSize;
                } else if (keyPressed == LEFT){
                    mato[index].x = value.x - blockSize;
                } else if (keyPressed == RIGHT){
                    mato[index].x = value.x + blockSize;
                }
            } else {
                mato[index].x = mato[index - 1].oldX;
                mato[index].y = mato[index - 1].oldY;
            }
        });
    }
    //Funktio joka muokkaa matoa ja lopettaa pelin jos sääntöjä rikotaan
    function drawSnake(){
        $.each(mato, function(index, value){
            ctx.fillStyle = 'red'
            ctx.fillRect(value.x, value.y, matoL, matoK);
            ctx.strokeStyle = 'white';
            ctx.strokeRect(value.x, value.y, matoL, matoK);
            if(index == 0) {
                if(collided(value.x, value.y)){
                    gameOver();
                }
                if(didEatFood(value.x, value.y)){
                score++;
                $('#score').text(score)
                makeSnakeBigger();
                omena.eaten = true;
                }
            }
        });
    }

    //funktio joka kasvattaa matoa omenan syömisen jälkeen
    function makeSnakeBigger(){
        mato.push({
            x: mato[mato.length - 1].oldX,
            y: mato[mato.length - 1].oldY
        });
    }
     //funktio jolla määrätään säännöt pelille
     function collided(x, y){
        return mato.filter(function(value, index){
            return index != 0 && value.x == x && value.y == y;
        }).length > 0 || x < 0 || x > canvas.width || y < 0 || y > canvas.height;
    }
    //funktio joka luo omenat pelikentälle
    function drawFood(){
        ctx.fillStyle = 'yellow';
        if (omena.eaten == true){
            omena = getNewPositionForFood();
        }
        ctx.fillRect(omena.x, omena.y, matoL, matoK);
    }
    //Funktio jolla omenat syödään
    function didEatFood(x, y){
        return omena.x == x && omena.y == y;
    }
    //Funktio joka tyhjentää pelikenttää
    function clearCanvas(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    //Funktio joka tarkistaa käyttäjän painamat napit
    $(document).keydown(function(e){
        if($.inArray(e.which, [DOWN, UP, LEFT, RIGHT]) != -1){
        keyPressed = checkKeyIsAllowed(e.which);
        }
    });
    //funktio jolla estetään madon liikuttaminen vastakkaisiin suuntiin nykyisestä liikeradasta
    function checkKeyIsAllowed(tempKey){
        let key;
        if(tempKey == DOWN) {
            key = (keyPressed != UP) ? tempKey : keyPressed;
        } else if(tempKey == UP) {
            key = (keyPressed != DOWN) ? tempKey : keyPressed;
        } else if(tempKey == LEFT) {
            key = (keyPressed != RIGHT) ? tempKey : keyPressed;
        }else if(tempKey == RIGHT) {
            key = (keyPressed != LEFT) ? tempKey : keyPressed;
        }
        return key;
    }
    //Funktio joka lopettaa pelin looppaamisen kun törmäys seinään tai matoon tapahtuu
    function gameOver(){
        clearInterval(game);
        alert("Game over, your score was " + score);

    }
    //funktio jolla laitetaan ruoka syömisen jälkeen uuteen paikkaan pelikentällä
    //ei kuitenkaan saa olla mikään ruutu missä mato menee tällähetkellä
    function getNewPositionForFood(){
        let xArr = yArr = [], xy;
        $.each(mato, function(index, value){
            if($.inArray(value.x, xArr) == -1){
                xArr.push(value.x);
            }
            if ($.inArray(value.y, yArr) == -1){
                yArr.push(value.y);
            }
        });
        xy = getEmptyXY(xArr, yArr);
        return xy;
    }
    //hakee mahdolliset uudet paikat omenoille, 
    function getEmptyXY(xArr, yArr){
        let newX, newY;
        newX = getRandomNumber(canvas.width -10, 10);
        newY = getRandomNumber(canvas.height -10, 10);
        if($.inArray(newX, xArr) == -1 && $.inArray(newY, yArr) != -1){
            return{
                x: newX,
                y: newY,
                eaten: false
            };
        }else{
            return getEmptyXY(xArr, yArr);
        }
    }
    //satunnaisnumerogeneraattori jota käytetään yllä olevassa funktiossa
    function getRandomNumber(max, multipleOf){
        let result = Math.floor(Math.random() * max);
        result = (result % 10 == 0) ? result : result + (multipleOf - result % 10);
        return result;
    }

    //napin klikkauksella lataa sivun uudelleen ja aloittaa uuden pelin
    $('#button').click(function() {
        location.reload();
    });
});