(function(){
    var formEl;
    
    var lastNameEl, lastNameFg, lastNameErr;
    var firstNameEl, firstNameFg, firstNameErr;
    var companyEl, companyFg, companyErr;
    var phoneEl, phoneFg, phoneErr;
    var emailEl, emailFg, emailErr;
    
    var pswEl, pswFg, pswErr;
    var confirmPswEl, confirmPswFg, confirmPswErr;
    
    var isEmailApproved = true;

    
    // DOM ready
    $(function(){
        // def
        formEl = $("form");
        
        lastNameEl = $("[name='lastName']");
        lastNameFg = $("#lastNameFg");
        lastNameErr = $("#lastNameErr");
        
        firstNameEl = $("[name='firstName']");
        firstNameFg = $("#firstNameFg");
        firstNameErr = $("#firstNameErr");
        
        companyEl = $("[name='company']");
        companyFg = $("#companyFg");
        companyErr = $("#companyErr");
        
        phoneEl = $("[name='phone']");
        phoneFg = $("#phoneFg");
        phoneErr = $("#phoneErr");                                
        
        emailEl = $("[name='email']");
        emailFg = $("#emailFg");
        emailErr = $("#emailErr");
        
        pswEl = $("[name='password']")  
        pswFg = $("#pswFg");
        pswErr = $("#pswErr");  
        
        confirmPswEl = $("[name='confirmPassword']")  
        confirmPswFg = $("#confirmPswFg");
        confirmPswErr = $("#confirmPswErr");               
              
        // events
        formEl.submit(onSubmitForm);
        
    });
    
    function onSubmitForm(event){
        event.preventDefault();

        $.when(checkLastName(), checkFirstName(), checkCompany(), checkPhone(), checkEmail(), checkPsw(), checkConfirmPsw())
            .done(function(v1, v2, v3, v4, v5, v6, v7){
                if(v1 && v2 && v3 && v4 && v5 && v6 && v7){
                    saveUser();
                }
            });            
    }
    
    function saveUser(){
        var url = '/api/users/createpublicuser';
        
        var data = {
            lastName: lastNameEl.val(),
            firstName: firstNameEl.val(),
            company: companyEl.val(),
            phone: phoneEl.val(),
            email: emailEl.val(),
            
            password: pswEl.val()                
        };
        
        var companyOwner = getParameterByName('companyowner');
        if(companyOwner) data.companyOwner = companyOwner;
        
        var owner = getParameterByName('owner');
        if(owner) data.owner = owner; 
        if(!isEmailApproved) data.status = 'WaitingForApproval';   
        console.log(data);
        $.post(url, data)
            .done(function(){
                document.location.href="/"; // redirect to homepage
            })
            .fail(function(err){
                alert(err);
            });        
    }
    
    function checkLastName(){
        var dfd = $.Deferred();

        // reset validation errors
        lastNameFg.removeClass("has-error");
        lastNameErr.text("");

        if (lastNameEl.val() == "") {
            lastNameFg.addClass("has-error");
            lastNameErr.text("Acest camp este obligatoriu.");
            lastNameEl.focus();
            dfd.resolve(false);
        } else {
            dfd.resolve(true);
        }            
        return dfd.promise();
    }
    
    function checkFirstName(){
        var dfd = $.Deferred();

        // reset validation errors
        firstNameFg.removeClass("has-error");
        firstNameErr.text("");

        if (firstNameEl.val() == "") {
            firstNameFg.addClass("has-error");
            firstNameErr.text("Acest camp este obligatoriu.");
            firstNameEl.focus();
            dfd.resolve(false);
        } else {
            dfd.resolve(true);
        }             
        return dfd.promise();
    }
    
    function checkCompany(){
        var dfd = $.Deferred();

        // reset validation errors
        companyFg.removeClass("has-error");
        companyErr.text("");

        if (companyEl.val() == "") {
            companyFg.addClass("has-error");
            companyErr.text("Acest camp este obligatoriu.");
            companyEl.focus();
            dfd.resolve(false);
        } else {
            dfd.resolve(true);
        }              
        return dfd.promise();
    }
    
    function checkPhone(){
        var dfd = $.Deferred();

        // reset validation errors
        phoneFg.removeClass("has-error");
        phoneErr.text("");

        if (phoneEl.val() == "") {
            phoneFg.addClass("has-error");
            phoneErr.text("Acest camp este obligatoriu.");
            phoneEl.focus();
            dfd.resolve(false);
        } else {
            dfd.resolve(true);
        }              
        return dfd.promise();
    }                
    
    function checkEmail(){
        var dfd = $.Deferred();

        // reset validation errors
        emailFg.removeClass("has-error");
        emailErr.text("");

        if (emailEl.val() == "") {
            emailFg.addClass("has-error");
            emailErr.text("Acest camp este obligatoriu.");
            emailEl.focus();
            dfd.resolve(false);
        } else if (!isEmail(emailEl.val())) {
            emailFg.addClass("has-error");
            emailErr.text("Adresa de email invalida.");
            emailEl.focus();
            dfd.resolve(false);
        } else {
            var url = "/api/users/checkemail/" + emailEl.val();
            $.get(url, function(result){
                if(!result){ // result = false if email is not present in Users DB
                    var url2 = "/api/customerEmployees/checkemail/" + emailEl.val();
                    $.get(url2, function(result2){
                        if(!result2){ // result = false if email is not present in Customers DB
                            isEmailApproved = false;
                            dfd.resolve(true);
                        } else {
                            dfd.resolve(true);
                        }            
                    }) 
                } else {
                    emailFg.addClass("has-error");
                    emailErr.html("Exista deja un cont cu aceasta adresa de email.");
                    emailEl.focus();
                    dfd.resolve(false);                    
                }             
            })              
                      
        }

        return dfd.promise();
    }
    
    function checkPsw(){
        var dfd = $.Deferred();

        // reset validation errors
        pswFg.removeClass("has-error");
        pswErr.text(""); 

        if (pswEl.val() == "") {
            pswFg.addClass("has-error");
            pswErr.text("Acest camp este obligatoriu.");
            pswEl.focus();
            dfd.resolve(false); 
        } else if (pswEl.val().length < 6) {
            pswFg.addClass("has-error");
            pswErr.text("Minim 6 caractere.");
            pswEl.focus();
            dfd.resolve(false); 
        } else {
            dfd.resolve(true); 
        }                 
        
        return dfd.promise();
    } 
    
    function checkConfirmPsw(){
        var dfd = $.Deferred();

        // reset validation errors
        confirmPswFg.removeClass("has-error");
        confirmPswErr.text(""); 

        if (confirmPswEl.val() !== pswEl.val()) {
            confirmPswFg.addClass("has-error");
            confirmPswErr.text("Parola confirmata nu coincide cu parola initiala.");
            confirmPswEl.focus();
            dfd.resolve(false); 
        } else {
            dfd.resolve(true); 
        }                 
        
        return dfd.promise();
    }           
   
    function isEmail(email) {
        // http://stackoverflow.com/a/46181/2726725
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    } 
    
    function getParameterByName(name, url) {
        // http://stackoverflow.com/a/901144
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }    
    
})();

   
   

// (function(){
//     var emailEl, emailGlyphOkEl, emailGlyphWarnEl;
    
//     // DOM ready
//     document.addEventListener("DOMContentLoaded", function(event) {
//         emailEl = document.getElementById('email');
//         emailEl.addEventListener("change", onChangeEmail);

//         emailGlyphOkEl = document.getElementById('emailGlyphOk');
//         emailGlyphOkEl.style.visibility="hidden";
        
//         emailGlyphWarnEl = document.getElementById('emailGlyphWarn');
//         emailGlyphWarnEl.style.visibility="hidden";
//     });


//     function onChangeEmail() {
//         checkEmail(emailEl.value, function(result){
//             if(result === 'true'){ // email is present in DB
//                 emailGlyphOkEl.style.visibility="visible";
//                 emailGlyphWarnEl.style.visibility="hidden";
//             } else{
//                 emailGlyphOkEl.style.visibility="hidden";
//                 emailGlyphWarnEl.style.visibility="visible";
//             }            
//         });
//     } 
    
//     function checkEmail(email, cb) {
//         var xhttp = new XMLHttpRequest();
//         var url = "/api/customerEmployees/checkemail/" + email;
//         xhttp.onreadystatechange = function() {
//             if (xhttp.readyState == 4 && xhttp.status == 200) {
//                 cb(xhttp.responseText);
//             }
//         };
//         xhttp.open("GET", url);
//         xhttp.send();
//     }    
// })();