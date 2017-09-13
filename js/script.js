	var DAY_OF_MILLI_SEC = 86400*1000;
	// var DAY_END = '2017-07-07 19:15:20';
	var DAY_END = 'Dec 17, 2017 19:15:20';
	// var DAY_END = 'Jun 29, 2017 02:05:50';
	var DAY_START = '2017-06-17';

	var lastDate = new Date(DAY_END);
	var firstDate = new Date(DAY_START);
	var todayDate = new Date();

	var lastTime = lastDate.getTime();
	var startDayTIme = firstDate.getTime();
	var currentTime = todayDate.getTime();
	var leftTime = lastTime - currentTime;
	var diff = 0;
	$(function(){
		$(".btn_again").click(function(){
			var l = $(".me").position().left;
			var width = $(".peoples").width();
			surfmove((l / width)*100);
		});
	});

	var app = angular.module('myApp', []);
	app.controller('myCtrl', function($scope, $interval) {
		diff = leftTime / DAY_OF_MILLI_SEC;
		if(diff <= 0) {
			timeup();
		}else{
			$scope.range = drawDate($scope);
			$scope.startday = dateFormat(firstDate);
			$scope.today = dateFormat(todayDate);
			$scope.endday = dateFormat(lastDate);
			$scope.leftday = Math.floor(leftTime / DAY_OF_MILLI_SEC);
			$scope.leftHour = Math.floor((leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			$scope.leftMin = Math.floor((leftTime % (1000 * 60 * 60)) / (1000 * 60));
			$scope.leftSec = Math.floor((leftTime % (1000 * 60)) / (1000));

		    var inter = $interval(function () {
				currentTime = new Date().getTime();
				leftTime = lastTime - currentTime;
				if(leftTime < 0){
					console.log("leftTime"+leftTime);
					$interval.cancel(inter)
					timeup();
					return;
				}
				$scope.leftday = Math.floor(leftTime / (1000 * 60 * 60 * 24));
				$scope.leftHour = Math.floor((leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				$scope.leftMin = Math.floor((leftTime % (1000 * 60 * 60)) / (1000 * 60));
				$scope.leftSec = Math.floor((leftTime % (1000 * 60)) / (1000));
		    }, 1000);

		}
	});

function timeup(){
	$(".ycontainer").hide();
	$("#timeupWrap").show();
	$(".second").hide();
	$(".times").html('<div class="day">&nbsp;&nbsp;Time\'s up!</div>');
	snow();
}

/*
	calculate distance
	param: start-> start time stamp
			end-> end time stamp
	return, 
			scaleArray -> show scale of time
*/
function drawDate(scope){

	if(diff > 365){
		// type = 2; // show as year
		console.log('type is 2');
	}else if(diff > 45){
		var mEnd = lastDate.getMonth();
		var mStart = firstDate.getMonth();
		var howManyYear = lastDate.getFullYear() - firstDate.getFullYear();
		// people move
		var beginTime = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1).getTime();
		var finishTime = new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 0).getTime();
		var long = finishTime - beginTime;
		var offset_num = 0.02;
		if (screen.width < 500) {
			offset_num = 0.08;
		}
		// var offset = long * offset_num / totalNum;

		var todayPos = (currentTime - beginTime - long*offset_num) / long * 100;
		$(".start-pos").css({left:((startDayTIme - beginTime - long * offset_num)/ long * 100 + '%')});
		$(".me-pos").css({left:todayPos + '%'});
		surfmove(todayPos);
		$(".end-pos").css({right:'-8px'});
		return arrangeMonth(mStart, mEnd);
	} else if(diff <= 45 && diff >0){
		// less one half month
		return arrangeDay();

	} 
}

// return month list show in journey belt
function arrangeMonth(mStart,mEnd){
	scaleArray = [];
	var monthCount = mEnd - mStart +1;
	if(monthCount < 2)monthCount+=12;
	for(var i = 0; i < monthCount; i++){
		var item = {};
		var date = mStart + 1 + i;
		if(date > 12) date -= 12;
		item.date = date + '月';
		item.isNext = true;
		scaleArray.push(item);
	}
	return scaleArray;
}


function arrangeDay(){
	scaleArray = [];
	var showNum = 6;
	var totalNum = 20;
	var beginTime = lastTime - totalNum * DAY_OF_MILLI_SEC;

	var long = lastTime - beginTime;
	var offset_num = 1;
	if (screen.width < 500) {
		offset_num = 1.8;
	}
	console.log("offset_num "+offset_num);
	console.log("screen.width "+screen.width);

	var offset = long * offset_num / totalNum;
	var todayPos = (currentTime - beginTime - offset) / long * 100;
	var startPos = (startDayTIme - beginTime - offset) / long * 100;

	$(".start-pos").css({left:(startPos + '%')});
	if(todayPos>85)todayPos=87;
	$(".me-pos").css({left:todayPos + '%'});
	$(".end-pos").css({right:'-8px'});

	surfmove(todayPos);

	for(var i = 0; i < totalNum; i++){
		var item = {};
		item.isNext = true;
		beginTime += DAY_OF_MILLI_SEC;
		if( i % Math.floor(totalNum / showNum) == 0 || i == (totalNum - 1)){
			item.date = dateFormat2(new Date(beginTime));
		}
		scaleArray.push(item);
	} 
	return scaleArray;
}

var flag;
//move ME from 0 to destination
function surfmove(endPos){
	var pos = 0;
	endPos = Math.round(endPos);
	if(flag == 1)
		return;

	var inId = setInterval(meMove, 20);

	function meMove(){
		if(pos >= endPos){
			clearInterval(inId);
			flag = 0;
		}else{
			flag = 1;
			pos = pos + 0.5;
			$(".me").css({left:pos + '%'});
		}
	}
}

function dateFormat(date){
	return date.getMonth()+1 + '月' + date.getDate() + '日';
}
function dateFormat2(date){
	return date.getDate() + '/' + (date.getMonth()+1) ;
}

/* timeup*/
  var snow = function() {
    if(1==1) {
	      var b = document.getElementById("christmasCanvas"), 
          a = b.getContext("2d"), 
          d = window.innerWidth, 
          c = window.innerHeight

      b.width = d;
      b.height = c;

      a.strokeStyle = "#000000";
      a.lineWidth = 2.0;
	  a.fillStyle = "#CC0000";

      for(var e = [], b = 0;b < 70;b++) {
        e.push({x:Math.random() * d, 
                y:Math.random() * c, 
                r:Math.random() * 40 + 1, 
                d:Math.random() * 70,
            	// dd:Math.random() * 40 + 1 ,
            	}
              )
      }
      var h = 0;

      window.intervral4Christmas = setInterval(function() {
        a.clearRect(0, 0, d, c);

        // a.fillStyle = "rgba(66, 139, 202, 0.6)";
        // a.shadowBlur = 5;
        // a.shadowColor = "rgba(0, 0, 0, 0.9)";
        a.beginPath();
        for(var b = 0; b < 70; b++) {
          var f = e[b];
          dr = f.r;
          a.moveTo(f.x, f.y + dr / 4);
          a.quadraticCurveTo(f.x, f.y, f.x + dr / 4, f.y);
		  a.quadraticCurveTo(f.x + dr / 2, f.y, f.x + dr / 2, f.y + dr / 4);
		  a.quadraticCurveTo(f.x + dr / 2, f.y, f.x + dr * 3/4, f.y);
		  a.quadraticCurveTo(f.x + dr, f.y, f.x + dr, f.y + dr / 4);
		  a.quadraticCurveTo(f.x + dr, f.y + dr / 2, f.x + dr * 3/4, f.y + dr * 3/4);
		  a.lineTo(f.x + dr / 2, f.y + dr);
		  a.lineTo(f.x + dr / 4, f.y + dr * 3/4);
		  a.quadraticCurveTo(f.x, f.y + dr / 2, f.x, f.y + dr / 4);

          // a.arc(f.x, f.y, f.r, 0, Math.PI * 2, !0)
        }
        a.stroke();

        a.fill();
        h += 0.01;
        for(b = 0;b < 70;b++) {
          if(f = e[b], f.y += Math.cos(h + f.d) + 1 + f.r*0.1 / 2, 
            f.x += Math.sin(h) * 2, f.x > d + 5 || f.x < -5 || f.y > c) {
            e[b] = b % 3 > 0 ? {x:Math.random() * d, y:-10, r:f.r, d:f.d} : 
            Math.sin(h) > 0 ? {x:-5, y:Math.random() * c, r:f.r, d:f.d} : 
            {x:d + 5, y:Math.random() * c, r:f.r, d:f.d}
          }
        }
      }, 70)
    }
  }
