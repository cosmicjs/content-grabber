//this extention created by ----> fadyAyoobDev@gmail.com
var content;
var title;
var link;

var show=0;

var buckets=Array();

var bucketsSlug=Array();


function HideLoader(x){
    $(".extention-loader").hide(x);
}

function ShowLoader(x){
    $(".extention-loader").show(x);
}

function HideButton(x){
    $(".extention-web-content-button").hide(x);
}

function ShowButton(x){
    $(".extention-web-content-button").show(x);
}

function AddLoader(){
    var loader = '<div class="extention-loader" style=" position:fixed; width:100%; height:100%; background-color:rgba(255,255,255,0.7); z-index:9999999999" >   <img src= "' + chrome.extension.getURL('../img/loader.gif')+'" style= " margin:auto; position: absolute; top: 50%; left: 50%;  transform: translate(-50%, -50%); text-align:right; " /> <br/> <h3 style= " margin:auto; position: absolute; top: 50%; left: 50%;  transform: translate(-50%, -50%);" > Please wait....we are saving the record </h3></div >';

    
    $('body').before(loader);

}

function AddSaveButton(){
    
    var button='<img class="extention-web-content-button" id="extention-web-content-button" width="40px" id="logo" style="border-radius:50%; background-color:#fff; z-index:9999; cursor:pointer; position:absolute" style="margin: auto;" src='+chrome.extension.getURL("../img/icon.png")+' data-toggle="tooltip" data-placement="bottom" title="Save it on Cosmic js " />'
    
    $('body').before(button);
    
    $('.extention-web-content-button').click(function(){
        SendToBackground();
    });

}
////////////////////

var loginState=0;

function IntPopup(){
    $('.Login').hide();
    $('.Content').hide();  
    HideLoader(0);
    chrome.storage.local.get('login', function (result) {
        login = result.login;
        console.log(login);
        if(login){
            $('.Content').show();  
            GetBukets();
        }
        else{
          $('.Login').show();  

        }
    });
}

function AddLoginMassage(msg){
    $("#massage").html(msg)
}

function Login(email,password){
    var http = new XMLHttpRequest();
    var url = "https://api.cosmicjs.com/v1/authenticate";
    var params = "email="+email+"&password="+password;
    http.open("POST", url, true);
    ShowLoader(100);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function () {//Call a function when the state changes.
       // HideLoader(100);
        if (http.readyState == 4 && http.status == 200) {
            response = JSON.parse(http.responseText);
            key=response.token;
            SaveApiKey(key,email,password);
            AddLoginMassage('');
            loginState=1;
            setTimeout(function(){
                ActivateLogin();

            },100);
            
            
        }
        else{
            if(!loginState)
                AddLoginMassage("Wrong Username or Password !!");
        }
    }
    http.send(params);
}

function LoginAuthrizedBackground(){
    chrome.storage.local.get('email', function (result) {
        email = result.email;
        chrome.storage.local.get('password', function (result) {
            password = result.password;
            
            var http = new XMLHttpRequest();
            var url = "https://api.cosmicjs.com/v1/authenticate";
            var params = "email="+email+"&password="+password;
            http.open("POST", url, true);
            ShowLoader(100);

            //Send the proper header information along with the request
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            http.onreadystatechange = function () {//Call a function when the state changes.
              //  HideLoader(100);
                if (http.readyState == 4 && http.status == 200) {
                    SaveApiKey(key,email,password);
                    setTimeout(function(){ActivateLogin();},200);
                }
                else{
                    if(!loginState)
                        DeactivateLogin();
                }
            }
            http.send(params);
        });
    });
}

function SaveApiKey(key,email,password){
    chrome.storage.local.set({ 'key': key }, function () { });
    chrome.storage.local.set({ 'email': email }, function () { });
    chrome.storage.local.set({ 'password': password }, function () { });
}

function ActivateLogin(){
    chrome.storage.local.set({ 'login': 1 }, function () { location.reload();});
}

function DeactivateLogin(){
    chrome.storage.local.set({ 'login': 0 }, function () {
        chrome.storage.local.set({ 'key': '' }, function () {
            chrome.storage.local.set({ 'email': '' }, function () {
                chrome.storage.local.set({ 'password': '' }, function () {
                    chrome.storage.local.set({ 'slug': '' }, function () {location.reload(); });
                });
            });
        });
    });
    
    
    
}

function GetBukets(){
    chrome.storage.local.get('key', function (result) {
        key = result.key;

        var http = new XMLHttpRequest();
        var url = "https://api.cosmicjs.com/v1/buckets";
        var params = {"title": "web-content-extention"};
        
        params = JSON.stringify(params);
        http.open("GET", url, true);
        ShowLoader(100);

        //Send the proper header information along with the request
        http.setRequestHeader('Authorization',' Bearer '+key );
        http.setRequestHeader('Content-type', 'application/json');
        
        http.onreadystatechange = function () {//Call a function when the state changes.
            HideLoader(100);
            if (http.readyState == 4 && http.status == 200) {
                response = JSON.parse(http.responseText);
               // alert(http.responseText);
                var bucketsResponse=Array();
                bucketsResponse=response.buckets;
                for (i=0;i<bucketsResponse.length;i++){
                    buckets[i]=response.buckets[i].title;
                    bucketsSlug[i]=response.buckets[i].slug;
                }
                CreateOptions(buckets,bucketsSlug)
                //alert(bucketsSlug);

            }
           /* else if(http.status == 409)//alerady created
            {
                alert(http.responseText);

//              /  ObjectType();
            }*/
            
        }
        http.send();
        
    });
}

function CreateOptions(title,slug){
    for(i=0;i<title.length;i++){
        $('#SelectSlug').append("<option value='"+slug[i]+"' >"+title[i]+"</option>");
        chrome.storage.local.get('slug', function (result) {
            slug = result.slug;
            console.log(slug);
            if(slug){
                ChangeLink();
                $('#SelectSlug').val(slug);
            }
                
            
            $('#SelectSlug').change(function(){
                    slug=$('#SelectSlug').val();
                    chrome.storage.local.set({ 'slug': slug }, function () {
                        ObjectType();
                        ChangeLink();
                    });

            });
        });
    }
    
}
/*
function CreateBuket(){
    chrome.storage.local.get('key', function (result) {
        key = result.key;

        var http = new XMLHttpRequest();
        var url = "https://api.cosmicjs.com/v1/buckets";
        var params = {"title": "web-content-extention"};
        
        params = JSON.stringify(params);
        http.open("POST", url, true);
        ShowLoader(100);

        //Send the proper header information along with the request
        http.setRequestHeader('Authorization',' Bearer '+key );
        http.setRequestHeader('Content-type', 'application/json');
        
        http.onreadystatechange = function () {//Call a function when the state changes.
            HideLoader(100);
            if (http.readyState == 4 && http.status == 200) {
                //response = JSON.parse(http.responseText);
               // alert(http.responseText);
                ObjectType();

            }
            else if(http.status == 409)//alerady created
            {
                ObjectType();
            }
            
        }
        http.send(params);
        
    });
}*/

function ObjectType(){
    chrome.storage.local.get('key', function (result) {
        key = result.key;
        chrome.storage.local.get('slug', function (result) {
            slug = result.slug;

            var http = new XMLHttpRequest();
            var url = "https://api.cosmicjs.com/v1/"+slug+"/add-object-type";
            var params = {
                          "title": "web-content-extention",
                          "singular": "web-content-extention",
                          "slug": "web-content-extention",
                          "metafields": [
                          {
                              "type": "text",
                              "title": "title",
                              "key": "title",
                              "required": false
                           },
                           {
                              "type": "html-textarea",
                              "title": "content",
                              "key": "content",
                              "required": false
                           },
                           {
                              "type": "text",
                              "title": "link",
                              "key": "link",
                              "required": false
                            }

                          ]
                        };

            params = JSON.stringify(params);
            http.open("POST", url, true);
            ShowLoader(100);

            //Send the proper header information along with the request
            http.setRequestHeader('Authorization',' Bearer '+key );
            http.setRequestHeader('Content-type', 'application/json');

            http.onreadystatechange = function () {//Call a function when the state changes.
                HideLoader(100);
                if (http.readyState == 4 && http.status == 200) {
                    //response = JSON.parse(http.responseText);
                    //alert(http.responseText);

                }

            }
            http.send(params);
        });
        
    });
}

function CreateObject(title,content,link){
    chrome.storage.local.get('key', function (result) {
        key = result.key;
        chrome.storage.local.get('slug', function (result) {
            slug = result.slug;
            
            var http = new XMLHttpRequest();
            var url = "https://api.cosmicjs.com/v1/"+slug+"/add-object";
            var params = {
                          "title": title,
                          "type_slug": "web-content-extention",
                         "content":content,
                          "metafields": [
                            {
                              "type": "text",
                              "value": title,
                              "key": "title",
                            },
                            {
                              "type": "html-textarea",
                              "value": content,
                              "key": "content",

                            },
                            {
                              "type": "text",
                              "value": link,
                              "key": "link",
                            }

                          ], 
                          "options": {
                            "slug_field": false
                          }
                        };

            params = JSON.stringify(params);
            http.open("POST", url, true);
            loaderInc();

            //Send the proper header information along with the request
            http.setRequestHeader('Authorization',' Bearer '+key );
            http.setRequestHeader('Content-type', 'application/json');

            http.onreadystatechange = function () {//Call a function when the state changes.


                if (http.readyState == 4 && http.status == 200) {
                loaderDec();

                }


            }
            http.send(params);
        });
    });
}

function SendFromBackground() {

    chrome.storage.local.get('params', function (result) {
        var params = result.params;
        chrome.storage.local.set({ 'params': '' }, function () {
            setTimeout(function () { SendFromBackground(); }, 200); 
         });
        if (params) {
            console.log(params.title+params.content+params.link);
            CreateObject(params.title,params.content,params.link);
        }

    });

}

function loaderInc() {
    chrome.storage.local.get('loader', function (result) {
        var loader = result.loader;
        if (!loader)
            loader = 0;
        chrome.storage.local.set({ 'loader': ++loader  }, function () { });
    });
}

function loaderDec() {
    chrome.storage.local.get('loader', function (result) {
        var loader = result.loader;
        if (!loader)
            loader = 0;
        if (loader>0)
            loader--;

        chrome.storage.local.set({ 'loader': loader }, function () { });
    });
}

function resetLoader(){
    chrome.storage.local.set({ 'loader': 0 }, function () { });

}

function load(){
    chrome.storage.local.get('loader', function (result) {
        var loader = result.loader;
        if (loader=='0')
            HideLoader(100);
        
    });
}

function GetSelectedText(){
    setInterval(function(){
       // var selected=window.getSelection();
        if (window.getSelection)
        {

            content = window.getSelection().toString();
            if (content  ){
                
             
                ShowButton();
            }
            else
            {
                
                HideButton();
            }
            
        }
        
    },100);
}

function LoadButtonPosition(){
    $(document).mousemove(function(event) {
        posX = event.pageX;
        posY = event.pageY;
    });
    $(document).mouseup(function(event) {
        $('#extention-web-content-button').css('margin-left',posX);
        $('#extention-web-content-button').css('margin-top',posY);
    });
}

function SendToBackground(){
    title= document.title;
    link=document.URL;
    
    params={'title':title,'link':link,'content':content}
    //params = JSON.stringify(params);
    
    chrome.storage.local.set({ 'params': params }, function () { ShowLoader(100);});
    
}

function IntContentScript(){
   chrome.storage.local.get('key', function (result) {
        key = result.key;
        chrome.storage.local.get('slug', function (result) {
            slug = result.slug;

            if (key &&slug){
                AddLoader();
                HideLoader();
                AddSaveButton();
                HideButton();
                GetSelectedText();
                LoadButtonPosition();

                setInterval(function () {load(); }, 500);

            }

        });
    });
 
}

function ChangeLink(){
    chrome.storage.local.get('slug', function (result) {
        slug = result.slug;
        $("#bucket-objects").attr("href","https://cosmicjs.com/"+slug+"/objects/?type=web-content-extention");
    });
}