//this extention created by ----> fadyAyoobDev@gmail.com

$(document).ready(function(){
    $(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
    
    IntPopup();
    
    $("#loginForm").submit(function(){
        var email=document.getElementById('email').value;
        var password=document.getElementById('password').value;
        Login(email,password);
    });
    
    $(".login input").change(function(){
        AddLoginMassage('');
    })
    
    $("#try").click(function(){
        GetBukets();
    });
    
    $("#logout").click(function(){
        DeactivateLogin();
    });
});