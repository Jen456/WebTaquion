
      $(document).ready(function(){
        var scroll_start = 0;
        var startchange = $('#change-it-now');
        var offset = startchange.offset();

        if(startchange.length){
          $(document).scroll(function(){
            scroll_start = $(this).scrollTop();

            if(scroll_start>offset.top){
              $('.nav-kronio').css('background-color', 'rgba(0, 64, 123, 0.9)');
            }else{
              $('.nav-kronio').css('background-color', '#E55166');
            }
          })
        }
      })
    