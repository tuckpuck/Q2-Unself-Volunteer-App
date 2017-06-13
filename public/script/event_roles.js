$(document).ready(function() {
  
  (function getRoles() {
    $.ajax({
      url: "/roles",
      method: "get",
      contentType: "application/json"
    })
    .done(function(data){
      for (var i = 0; i < data.length; i++) {
        $('.select-roles').append($(`<option value="${data[i].id}"></option>`).html(data[i].name));
      }
    })
    .fail(function() {
      alert("No Roles Found!");
    });
  })();

  function EventRole (start_date, end_date, start_time, end_time, number_needed, role_id){
    this.start_date = start_date;
    this.end_date = end_date;
    this.start_time = start_time;
    this.end_time = end_time;
    this.number_needed = number_needed;
  }

  $('#add-role').on('submit', function(event) {
    event.preventDefault();
    var eventRole = new EventRole();

    eventRole.start_date = $('#s-date').val();
    eventRole.end_date = $('#e-date').val();
    eventRole.start_time = $('#s-time').val();
    eventRole.end_time = $('#e-time').val();
    eventRole.number_needed = $('#number_needed').val();
    eventRole.role_id = $('.select-roles').val();


    eventRole = JSON.stringify(eventRole);


    var request = $.ajax({
        url: "/event_roles",
        method: "POST",
        data: eventRole,
        contentType: "application/json"
      })
      .done(function() {
        var currentRole = $('<li class="list-group-item"></li>').html(` ${$('.select-roles option:selected').html()} (Volunteers Needed: ${$('#number_needed').val()})`);

        $('#roleTable').append(currentRole);
      })
      .fail(function() {
        alert("Please Check That All Fields Are Completed");
      });

  });
});