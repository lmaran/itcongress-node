(function(){
    var formEl;
    
    //var addToScheduleEl, removeFromScheduleEl
    
    // DOM ready
    $(function(){
        // def
        formEl = $("form");        
              
        // events
        $(".addToSchedule").click(addToSchedule);
        $(".removeFromSchedule").click(removeFromSchedule);
        $('#moreModal').on('show.bs.modal', addContentToModal);
    }); 
    
    function addContentToModal(event){
        var button = $(event.relatedTarget); // Button that triggered the modal
        var data = button.data('description'); // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);
        modal.find('.modal-body p').text(data);
    } 
    
    function addToSchedule(event){
        
        // alert('in curand');
        // return false;
        
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
        // alert('in curand');
        // return false;
        
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
                document.location.reload(true);
            })
            .fail(function(err){
                alert(err);
            })
            .always(function(err){

            });       
    }
    

})();