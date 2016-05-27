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
        $('#moreModal').on('show.bs.modal', addContentToMoreModal);
        $('#speakerModal').on('show.bs.modal', addContentToSpeakerModal);
    }); 
    
    function addContentToMoreModal(event){
        var button = $(event.relatedTarget); // Button that triggered the modal
        var description = button.data('description'); // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);
        modal.find('.modal-body p').text(description);
    } 
    
    function addContentToSpeakerModal(event){
        var button = $(event.relatedTarget); // Button that triggered the modal
        var name = button.data('name'); // Extract info from data-* attributes
        var speakerId = button.data('speakerid');
        // var title = button.data('title');
        // var bio = button.data('bio');
        
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);
        modal.find('.modal-title').text(name);

        // reset values
        modal.find('.modal-body h4').text("");
        modal.find('.modal-body span').text("");
        modal.find('.modal-body img').attr('src', "");
                        
        var url = '/api/speakers/' + speakerId;
        $.get(url)
            .done(function(speaker){
                modal.find('.modal-body h4').text(speaker.title);
                modal.find('.modal-body span').text(speaker.bio);
                modal.find('.modal-body img').attr('src', speaker.imageUrl);
            })        
        

    }    
    
    function addToSchedule(event){
        
        alert('Session closed!');
        return false;
        
        // var $thisButton = $(this);
        
        // var $parentSessionLi = $thisButton.closest("li");  
        // var sessionId = $parentSessionLi.data("sessionid");

        
        // var action = {
        //     sessionId: sessionId,
        //     type: 'addToSchedule'
        // };
        
        // saveMyAction(action);
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