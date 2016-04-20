(function(){
    var formEl;
    
    //var addToScheduleEl, removeFromScheduleEl
    
    // DOM ready
    $(function(){
        // def
        formEl = $("form");
        
        addToScheduleBtns = $(".addToSchedule");
        removeFromScheduleBtns = $(".removeFromSchedule");            
              
        // events
        addToScheduleBtns.click(addToSchedule);
        removeFromScheduleBtns.click(removeFromSchedule);
    });
    
    function addToSchedule(event){
        alert('in curand');
        return false;
        
        var $thisButton = $(this);
        
        var $parentSessionLi = $thisButton.closest("li");  
        var sessionId = $parentSessionLi.data("sessionid");

        
        var action = {
            sessionId: sessionId,
            type: 'addToSchedule'
        };
        
        saveMyAction(action);
    }
    
    function removeFromSchedule(event){
        alert('in curand');
        return false;
        
        var $thisButton = $(this);
        
        var $parentSessionLi = $thisButton.closest("li");  
        var sessionId = $parentSessionLi.data("sessionid");

        
        var action = {
            sessionId: sessionId,
            type: 'removeFromSchedule'
        };
        
        saveMyAction(action);
    }    
    
    function saveMyAction(action){
        var url = '/api/myActions';
        $.post(url, action)
            .done(function(data){
                
                //document.location.href="/agenda";
                document.location.reload(true);
                
                // // if first time we create a new pref., next we want to use an update instead 
                // if(!preference.preferenceId){
                //     // does not change the html5 'data-*' attribute, just the jQuery cache
                //     // but this is enough for this case: http://stackoverflow.com/a/17246540
                //     $parentMenuUl.data("preference-id", data._id); 
                // };
                
                // // update DOM
                // if($isMyOption.length){ // 1 'selected' + 1 'unselected' option => swap
                //     swapNodes($isMyOption[0], $setMyOption[0]);
                // } else { // 2 'unselected' options => replace with a new 'selected' button
                //     var el = '<span class="label label-success isMyOption"><span class="glyphicon glyphicon-ok"></span>Optiunea mea</span>';
                //     $(el).insertBefore($setMyOption);
                //     $setMyOption.remove();
                // } 
            })
            .fail(function(err){
                alert(err);
            })
            .always(function(err){
                // $setMyOptionIcon.removeClass("spinning glyphicon-refresh").addClass("glyphicon-pushpin");
            });       
    }
    

})();