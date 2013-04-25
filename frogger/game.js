function start_game()
{
	//init parameters
	initialize();
	//draw original board
	canvas = document.getElementById('game');
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
		img.onload=draw();
		setInterval(gameLoop,100);
	}
	else {
        alert('Sorry, canvas is not supported on your browser!');        
    }
}
//function to run game loop
function gameLoop()
{
document.addEventListener("keyup", function(){
	if(event.keyCode==37)
	{
		froggerD="L"
	}
	if(event.keyCode==38)
	{
		froggerD="U"
	}
	if(event.keyCode==39)
	{
		froggerD="R"
	}
	if(event.keyCode==40)
	{
		froggerD="D"
	}	
});
	if(!OVER)
	{
		checkCollisions();
		updatePos();
		draw();
		Victory();
		gameOver();
		if(youWin)
		{
			levelUp();
		}
	}
}
//function to update positions
function updatePos()
{
	chg=35;//amount to move frogger by
	if(froggerD=="L"&&frogger_X-chg>=lBound && death==false)//&&make sure not past left border)
	{
		frogger_X=frogger_X-chg;
		coordFrogX=lFrogX;
		coordFrogY=lFrogY;
	}
	if(froggerD=="U"&&frogger_Y-chg>=uBound && death==false)//&&make sure not past top border)
	{
		frogger_Y=frogger_Y-chg;
		coordFrogX=fFrogX;
		coordFrogY=fFrogY;
		currentJ++;
	}
	if(froggerD=="R"&&frogger_X+chg<=rBound && death==false)//&&make sure not past right border)
	{
		frogger_X=frogger_X+chg;
		coordFrogX=rFrogX;
		coordFrogY=rFrogY;
	}
	if(froggerD=="D"&&frogger_Y+chg<=bBound && death==false)//&&make sure not past bottom border)
	{
		frogger_Y=frogger_Y+chg;
		coordFrogX=dFrogX;
		coordFrogY=dFrogY;
		currentJ--;
	}
	//move the logs
	for(var i=0;i<4;i++)
	{
		if(medLogs[i].coord_x>635)
		{medLogs[i].coord_x=-150}
		medLogs[i].coord_x=medLogs[i].coord_x+medLogs[i].vel;
	}
	for(var i=0;i<3;i++)
	{
		if(bigLogs[i].coord_x>585)
		{bigLogs[i].coord_x=-200}
		bigLogs[i].coord_x=bigLogs[i].coord_x+bigLogs[i].vel;
	}
	for(var i=0;i<3;i++)
	{
		if(smlLogs[i].coord_x>505)
		{smlLogs[i].coord_x=-100}
		smlLogs[i].coord_x=smlLogs[i].coord_x+smlLogs[i].vel;
	}
	//move the turtles
	for(var i=0;i<5;i++)
	{
		for(var j=0;j<2;j++)
		{
			if(turts2[i][j].coord_x<-150)
			{turts2[i][j].coord_x=520}
			turts2[i][j].coord_x=turts2[i][j].coord_x+turts2[i][j].vel;
		}
	}
	for(var i=0;i<5;i++)
	{
		for(var j=0;j<3;j++)
		{
			if(turts3[i][j].coord_x<-150)
			{turts3[i][j].coord_x=600}
			turts3[i][j].coord_x=turts3[i][j].coord_x+turts3[i][j].vel;
		}
	}
	//move the cars
	for(var i=0;i<2;i++)
	{
		if(trucks[i].coord_x<-50)
		{trucks[i].coord_x=450}
		trucks[i].coord_x=trucks[i].coord_x+trucks[i].vel;
	}
	for(var i=0;i<3;i++)
	{
		if(carsW[i].coord_x>425)
		{carsW[i].coord_x=-40}
		carsW[i].coord_x=carsW[i].coord_x+carsW[i].vel;
	}
	for(var i=0;i<3;i++)
	{
		if(carsP[i].coord_x<-40)
		{carsP[i].coord_x=420}
		carsP[i].coord_x=carsP[i].coord_x+carsP[i].vel;
	}
	for(var i=0;i<3;i++)
	{
		if(bullD[i].coord_x>435)
		{bullD[i].coord_x=-50}
		bullD[i].coord_x=bullD[i].coord_x+bullD[i].vel;
	}
	for(var i=0;i<3;i++)
	{
		if(carsY[i].coord_x<-40)
		{carsY[i].coord_x=400}
		carsY[i].coord_x=carsY[i].coord_x+carsY[i].vel;
	}
	frogger_X=frogger_X+froggerVel;
	if(frogger_X>=rBound || frogger_X<=lBound)
	{
		lostLife();
	}
	if(score>highscore)
	{
		highscore=score;
		localStorage["HS"] = highscore;
	}
	timer=timer-0.5;
	if(score-(10000*minNewLife)>0 && score!=0 && num_Lives<5)
	{
		console.log(minNewLife);
		num_Lives++;
		minNewLife++;
	}
}


//initializes all variables that will be used in the game
function initialize()
{
//code to stop scrolling from arrow keys, taken from stack overflow
document.onkeydown = function(evt) {
    evt = evt || window.event;
    var keyCode = evt.keyCode;
    if (keyCode >= 37 && keyCode <= 40) {
        return false;
    }
};
	img = new Image();
	img.src = 'assets/frogger_sprites.png';
	deadImg= new Image();
	deadImg.src='assets/dead_frog.png';
	//frogger init x and y
	startX=frogger_X=190;
	startY=frogger_Y=498;
	//initialize frogger direction
	froggerD="N";
	furthestJ=0;//keeps track of furthest frogger has jumped
	currentJ=0;//keeps track of current jump location
	timer=200;//time for each frog to get home
	//log init x and y's, vel
	//later on will probably add a function to init all logs
	medLogs = new Array();
	for(var i=0;i<4;i++)
	{
		medLogs[i]=new Log(-150 + 180*i, 115, 4,118,22);
	}
	bigLogs = new Array();
	for(var i=0;i<3;i++)
	{
		bigLogs[i]=new Log(-150 + 220*i, 175, 6,180,24);
	}
	smlLogs= new Array();
	for(var i=0;i<3;i++)
	{
		smlLogs[i]=new Log(0 + 140*i, 215, 3,86,24);
	}
	turts2 = new Array();
	for(var i=0;i<5;i++)
	{
		turts2[i]=new Array();
		for(var j=0;j<2;j++)
		{
			turts2[i][j]=new Turtle(400-35*(j+1)-120*i, 145, -5,32,22)
		}
	}
	turts3 = new Array();
	for(var i=0;i<5;i++)
	{
		turts3[i]=new Array();
		for(var j=0;j<3;j++)
		{
			turts3[i][j]=new Turtle(400-35*(j+1)-150*i, 248, -5,32,22)
		}
	}
	//2 cars init x and y's, vel
	//later on will probably add a function to init all cars	
	trucks = new Array();
	for(var i=0;i<2;i++)
	{
		trucks[i]=new Car(340-150*i,322,-5,50,20);
	}
	carsW=new Array();
	for(var i=0;i<3;i++)
	{
		carsW[i]=new Car(0+120*i,355,4,28,28);
	}
	carsP=new Array();
	for(var i=0;i<3;i++)
	{
		carsP[i]=new Car(250-120*i,390,-5,30,22);
	}
	bullD=new Array();
	for(var i=0;i<3;i++)
	{
		bullD[i]=new Car(65+120*i,425,4,28,23);
	}
	carsY=new Array();
	for(var i=0;i<3;i++)
	{
		carsY[i]=new Car(340-120*i,460,-3,26,27);
	}
	//time
	time=0;
	//number of lives
	num_Lives=5;
	//level number
	level=1;
	//score
	score=0;
	//highscore
	if(localStorage["HS"] != undefined)//stores and displays highscores from local storage
		{highscore=localStorage["HS"]}
	else
		{highscore=0;}
	//left frogger boundary
	lBound=0;
	//right frogger boundary
	rBound=375;
	//upper frogger boundary
	uBound=50;
	//bottom frogger boundary
	bBound=498;
	//initialize frogger image coords below
	fFrogX=11;
	fFrogY=368;
	lFrogX=81;
	lFrogY=336;
	rFrogX=10;
	rFrogY=335;
	dFrogX=80;
	dFrogY=368;	
	coordFrogX=fFrogX;
	coordFrogY=fFrogY;
	froggerSizeX=25;
	froggerSizeY=25;
	froggerVel=0;
	OVER=false;
	death=false;
	//below is an array to store unsafe locations at "home"
	deathLocs = new Array();
	for(var i =0;i<6;i++)
	{deathLocs[i]=new Array();}
	//these are hardcoded pixel locations for the non-lily pad areas
	deathLocs[0]=[0,73,9,34];
	deathLocs[1]=[49,73,48,34];
	deathLocs[2]=[133,73,47,34];
	deathLocs[3]=[219,73,44,34];
	deathLocs[4]=[304,73,46,34];
	deathLocs[5]=[387,73,18,34];	
	//these are the hardcoded locations of the lily pad locations along with a bool if it is taken
	homeLocs=new Array();
	for(var i =0;i<5;i++)
	{homeLocs[i]=new Array();}
	homeLocs[0]=[11,73,32,34,false];
	homeLocs[1]=[97,73,32,34,false];
	homeLocs[2]=[182,73,32,34,false];
	homeLocs[3]=[264,73,35,34,false];
	homeLocs[4]=[351,73,31,34,false];
	//bool for winning the game
	youWin=false;
	minNewLife=1;
}
//draws game board and all objects on the board
function draw()
{
	ctx.clearRect();
		//draw water as a rectangle
    	ctx.fillStyle = "#191970";
 	    ctx.fillRect(0, 0, 399, 283);
		//draw road as a rectangle
 	    ctx.fillStyle = "#000000";
 	    ctx.fillRect(0, 284, 399, 283);    
  	    //draw frogger header
  	    ctx.drawImage(img,0,0,398,110,0,0,398,110);
  	    //add two roadsides
  	    ctx.drawImage(img,0,118,398,36,0,280,398,36);
  	    ctx.drawImage(img,0,118,398,36,0,490,398,36);   
 	    //add frog drawings for number of lives
 	    drawLives();
		//Draw all text at bottom
		drawText();

    	//Draw 4 medium logs, later add function to draw all logs
    	for(var i=0;i<4;i++)
    	{
    		ctx.drawImage(img,6,197,118,22,medLogs[i].coord_x,medLogs[i].coord_y,medLogs[i].w,medLogs[i].h);
    	}
    	//Draw 3 big logs, later add function to draw all logs
    	for(var i=0;i<3;i++)
    	{
    		ctx.drawImage(img,6,162,180,24,bigLogs[i].coord_x,bigLogs[i].coord_y,bigLogs[i].w,bigLogs[i].h);
    	}
    	//Draw 3 small logs
    	for(var i=0;i<3;i++)
    	{
    		ctx.drawImage(img,6,229,86,24,smlLogs[i].coord_x,smlLogs[i].coord_y,smlLogs[i].w,smlLogs[i].h);
    	}    	
    	//draw groups of 2 turtles
    	for(var i=0;i<5;i++)
		{
			for(var j=0;j<2;j++)
			{
				ctx.drawImage(img,14,405,32,22,turts2[i][j].coord_x,turts2[i][j].coord_y,turts2[i][j].w,turts2[i][j].h);
			}
		}
		//draw groups of 3 turtles
    	for(var i=0;i<5;i++)
		{
			for(var j=0;j<3;j++)
			{
				ctx.drawImage(img,14,405,32,22,turts3[i][j].coord_x,turts3[i][j].coord_y,turts3[i][j].w,turts3[i][j].h);
			}
		}
		//draw the two trucks
		for(var i=0;i<2;i++)
		{
			ctx.drawImage(img,104,302,50,20,trucks[i].coord_x,trucks[i].coord_y,trucks[i].w,trucks[i].h); 
		}
		//draw the white cars
		for(var i=0;i<3;i++)
		{
			ctx.drawImage(img,46,264,28,28,carsW[i].coord_x,carsW[i].coord_y,carsW[i].w,carsW[i].h);
		}
		//draw the pink cars
		for(var i=0;i<3;i++)
		{
			ctx.drawImage(img,8,265,30,22,carsP[i].coord_x,carsP[i].coord_y,carsP[i].w,carsP[i].h); 
		}
		//draw the bull dozers
		for(var i=0;i<3;i++)
		{
			ctx.drawImage(img,9,300,28,23,bullD[i].coord_x,bullD[i].coord_y,bullD[i].w,bullD[i].h); 
		}	
		//draw the yellow cars
		for(var i=0;i<3;i++)
		{
			ctx.drawImage(img,80,262,26,27,carsY[i].coord_x,carsY[i].coord_y,carsY[i].w,carsY[i].h); 
		}	    
		//draw lillypads
		for(var i=0;i<5;i++)
		{
			ctx.fillStyle="green"
			ctx.fillRect(homeLocs[i][0]+3,homeLocs[i][1]+3,25,25)
			ctx.fill();
			if(homeLocs[i][4]==true)
			{//draw frogs that are home safe
				ctx.drawImage(img,dFrogX,dFrogY,22,22,homeLocs[i][0]+3,homeLocs[i][1]+5,froggerSizeX,froggerSizeY);
			}
		}
      	//draw frog
    	if(!death)
    	{  	//Draw Frog 
    		ctx.drawImage(img,coordFrogX,coordFrogY,22,22,frogger_X,frogger_Y,froggerSizeX,froggerSizeY);
    	}
    	else
    	{//draw death animation
    	    ctx.drawImage(deadImg,3,3,25,25,deathX,deathY,froggerSizeX+dCount*5,froggerSizeY+dCount*5);
    		deathX--;
    		deathY--;
    		dCount++;
    		if(dCount>20)
    		{death=false;}
    	}
    	froggerD="n";
    	//draw timer
    	if(timer>50)
    	{color="green";}
    	else
    	{color="red";}
    	ctx.fillStyle = color;
 	    ctx.fillRect(200, 537, timer, 15);
}
//draws frog in bottom to represent appropriate number of remaining lives
function drawLives()
{
     if(num_Lives==5)
    {
        ctx.drawImage(img,11,334,22,22,72,525,15,15);
        ctx.drawImage(img,11,334,22,22,54,525,15,15);
        ctx.drawImage(img,11,334,22,22,0,525,15,15); 
        ctx.drawImage(img,11,334,22,22,18,525,15,15); 
        ctx.drawImage(img,11,334,22,22,36,525,15,15); 
    }
    else if(num_Lives==4)
    {
        ctx.drawImage(img,11,334,22,22,54,525,15,15);
        ctx.drawImage(img,11,334,22,22,0,525,15,15); 
        ctx.drawImage(img,11,334,22,22,18,525,15,15); 
        ctx.drawImage(img,11,334,22,22,36,525,15,15); 
    }
    else if(num_Lives==3)
    {
        ctx.drawImage(img,11,334,22,22,0,525,15,15); 
        ctx.drawImage(img,11,334,22,22,18,525,15,15); 
        ctx.drawImage(img,11,334,22,22,36,525,15,15); 
    }
    else if(num_Lives==2)
    {
        ctx.drawImage(img,11,334,22,22,0,525,15,15); 
        ctx.drawImage(img,11,334,22,22,18,525,15,15); 
    }
    else if(num_Lives==1)
    {
        ctx.drawImage(img,11,334,22,22,0,525,15,15);     
    }
}
//draws text on bottom and updates based on updates to variables
function drawText()
{
    // Draw Level Number
    ctx.fillStyle="rgb(0, 255, 0)";
    ctx.font="22px Verdana"
    ctx.fillText("Level "+level, 95, 542);
    //Draw Score
    ctx.fillStyle="rgb(0, 255, 0)";
    ctx.font="12px Verdana"
    ctx.fillText("Score: "+score,0, 560);    
    //Draw HighScore
    ctx.fillStyle="rgb(0, 255, 0)";
    ctx.font="12px Verdana"
    ctx.fillText("Highscore: "+highscore,83, 560);   
}

//create a struct for logs so they can be easily repeated
//in the next part, could potentially create an array of logs that keeps track of all of them
function Log(coord_x, coord_y, vel,w,h)
{
	this.coord_x=coord_x;
	this.coord_y=coord_y;
	this.vel=vel;
	this.w=w;
	this.h=h;
}

//create a struct for turtles so they can be easily repeated
function Turtle(coord_x, coord_y, vel,w,h)
{
	this.coord_x=coord_x;
	this.coord_y=coord_y;
	this.vel=vel;
	this.w=w;
	this.h=h;
}

//create a struct for cars so they can be easily repeated
//in the next part, could potentially create an array of cars that keeps track of all of them
function Car(coord_x, coord_y, vel,w,h)
{
	this.coord_x=coord_x;
	this.coord_y=coord_y;
	this.vel=vel;
	this.w=w;
	this.h=h;
}
function collides(left2, top2, sizeX, sizeY) {
  return frogger_X < left2 + sizeX &&
         frogger_X + froggerSizeX > left2 &&
         frogger_Y < top2 + sizeY &&
         frogger_Y + froggerSizeY > top2;
}
//the function below returns true if a "bad" collision has occured and frogger dies
//if is false, then either a good collision has occured and is dealt with, or no collision
function checkCollisions()
{
	var goodC=false;//lands on turtle or log
	var badC=false;//gets hit by car
	var victoryC=false;//land on lilly pad at end
	froggerVel=0;
	for(var i=0;i<4;i++)
	{
		if(collides(medLogs[i].coord_x, medLogs[i].coord_y,medLogs[i].w, medLogs[i].h) )
		{goodC=true;
		froggerVel=medLogs[i].vel;
		}
	}
	for(var i=0;i<3;i++)
	{
		if(collides(bigLogs[i].coord_x, bigLogs[i].coord_y,bigLogs[i].w, bigLogs[i].h) )
		{goodC=true;
		froggerVel=bigLogs[i].vel;
		}
	}
	for(var i=0;i<3;i++)
	{
		if(collides(smlLogs[i].coord_x, smlLogs[i].coord_y,smlLogs[i].w, smlLogs[i].h) )
		{goodC=true;
		froggerVel=smlLogs[i].vel;
		}
	}
	for(var i=0;i<5;i++)
	{
		for(var j=0;j<2;j++)
		{
			if(collides(turts2[i][j].coord_x, turts2[i][j].coord_y,turts2[i][j].w, turts2[i][j].h) )
			{goodC=true;
			froggerVel=turts2[i][j].vel;
			}
		}
	}
	for(var i=0;i<5;i++)
	{
		for(var j=0;j<3;j++)
		{
			if(collides(turts3[i][j].coord_x, turts3[i][j].coord_y,turts3[i][j].w, turts3[i][j].h) )
			{goodC=true;
			froggerVel=turts3[i][j].vel;
			}
		}
	}
	for(var i=0;i<2;i++)
	{
		if(collides(trucks[i].coord_x, trucks[i].coord_y,trucks[i].w, trucks[i].h) )
		{badC=true;
		}
	}
	for(var i=0;i<3;i++)
	{
		if(collides(carsW[i].coord_x, carsW[i].coord_y,carsW[i].w, carsW[i].h) )
		{badC=true;
		}
	}
	for(var i=0;i<3;i++)
	{
		if(collides(carsP[i].coord_x, carsP[i].coord_y,carsP[i].w, carsP[i].h) )
		{badC=true;
		}
	}
	for(var i=0;i<3;i++)
	{
		if(collides(bullD[i].coord_x, bullD[i].coord_y,bullD[i].w, bullD[i].h) )
		{badC=true;
		}
	}
	for(var i=0;i<3;i++)
	{
		if(collides(carsY[i].coord_x, carsY[i].coord_y,carsY[i].w, carsY[i].h) )
		{badC=true;
		}
	}

	if(badC===true)
	{
		lostLife();
	}
	//successful jump increases score
	if((currentJ>furthestJ && !badC) && !(currentJ>6&&currentJ<12&&!goodC))
	{	
		furthestJ++;
		score=score+10;
	}
	if(currentJ>6&&currentJ<12&&!goodC)
	{
	lostLife();
	}
	if(timer<=0)
	{lostLife();}
}
function lostLife()
{

	num_Lives--;
//dead frog coordinates
	deathX=frogger_X;
	deathY=frogger_Y;
	dCount=0;
	//reset frogger location and direction
	frogger_X=startX;
	frogger_Y=startY;
	coordFrogX=fFrogX;
	coordFrogY=fFrogY;
	//reset frogger jump progress
	furthestJ=0;
	currentJ=0;
	timer=210;
	death=true;
	
}
function gameOver()
{
	if(num_Lives==0)
	{
		OVER=true;
		ctx.fillStyle="rgb(255, 0, 0)";
    	ctx.font="22px Verdana"
    	ctx.fillText("GAME OVER", 140, 305);
	}
}
function Victory()
{
	if(currentJ==12)
	{
		homeSafe=true;
		for(var i=0;i<6;i++)
		{
			if(collides(deathLocs[i][0],deathLocs[i][1],deathLocs[i][2],deathLocs[i][3]))
			{homeSafe=false;}
		}
		if(homeSafe==true)
		{
			for(var i=0;i<5;i++)
			{
				if(collides(homeLocs[i][0],homeLocs[i][1],homeLocs[i][2],homeLocs[i][3])
				   && homeLocs[i][4]==true)
				{homeSafe=false;}
				else if(collides(homeLocs[i][0],homeLocs[i][1],homeLocs[i][2],homeLocs[i][3])
				   && homeLocs[i][4]==false)
				{
					homeLocs[i][4]=true;
					score=score+50;
					//add points for extra time left
					//every second is 5 less pixels, so each pixel is worth 2 points
					score=score+2*timer;
					//reset frogger location and direction
					frogger_X=startX;
					frogger_Y=startY;
					coordFrogX=fFrogX;
					coordFrogY=fFrogY;
					//reset frogger jump progress
					furthestJ=0;
					currentJ=0;
					timer=200;
				}	
			}
		}
		if(homeSafe==false)
		{lostLife();}
	}
	if(homeLocs[0][4]==true && homeLocs[1][4]==true && homeLocs[2][4]==true 
	   && homeLocs[3][4]==true && homeLocs[4][4]==true)
	{
		youWin=true;
		score=score+1000;
		ctx.fillStyle="rgb(0, 255, 0)";
    	ctx.font="22px Verdana"
    	ctx.fillText("YOU WIN!!!", 135, 305);
	}
}
function levelUp()
{
	level=level+1;
	for(var i=0;i<3;i++)
	{
		bigLogs[i].vel++;
		smlLogs[i].vel++;
		carsW[i].vel++;
		carsP[i].vel--;
		bullD[i].vel++;
		carsY[i].vel--;
	}
	for(var i=0;i<2;i++)
	{trucks[i].vel--;}
	for(var i=0;i<4;i++)
	{
		medLogs[i].vel++;
	}
	for(var i=0;i<5;i++)
	{
		homeLocs[i][4]=false;
		for(var j=0;j<2;j++)
		{turts2[i][j].vel--;
		}
	}
	for(var i=0;i<5;i++)
	{
		for(var j=0;j<3;j++)
		{turts3[i][j].vel--;
		}
	}
	frogger_X=startX;
	frogger_Y=startY;
	coordFrogX=fFrogX;
	coordFrogY=fFrogY;
	//reset frogger jump progress
	furthestJ=0;
	currentJ=0;
	timer=200;
	youWin=false;
	
}