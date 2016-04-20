(function(){
    var formEl;
    
    var addToScheduleEl, removeFromScheduleEl
    
    // DOM ready
    $(function(){
        // def
        formEl = $("form");
        
        addToScheduleEl = $(".addToSchedule");
        removeFromScheduleEl = $(".removeFromScheduleEl");            
              
        // events
        addToScheduleEl.click(addToSchedule);
        
    });
    
    function addToSchedule(event){
        event.preventDefault();
        alert('in curand (21.04)');  
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
                if(isEmailApproved){
                    document.location.href="/registerConfirm";
                } else {
                    document.location.href="/registerConfirmWait"; 
                }
            })
            .fail(function(err){
                alert(err);
            });        
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