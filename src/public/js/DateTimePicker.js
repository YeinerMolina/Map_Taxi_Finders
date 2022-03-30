$('#Date').daterangepicker({
    drops: 'up',
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 2020,
    maxYear: parseInt(moment().format('YYYY'),10),
    locale: {
        format : 'YYYY-MM-DD'
    }
});
$('#Hour').daterangepicker({
    drops: 'down',
    timePicker : true,
    timePicker24Hour : true,
    timePickerIncrement : 1,
    locale : {
        format : 'HH:mm'
    }
}).on('show.daterangepicker', function(ev, picker) {
    picker.container.find(".calendar-table").hide();
});
