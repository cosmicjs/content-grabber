//this extention created by ----> fadyAyoobDev@gmail.com
var h=0;

setInterval(function(){
    
    hr=GetCurrentHour();
    hr=Math.floor(hr/12);
    if ( hr != h){
        h=hr;
        LoginAuthrizedBackground();
    }
},5*60*1000); 

resetLoader();
SendFromBackground();
//GetSelectedText();
