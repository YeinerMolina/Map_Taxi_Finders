$('#Date').daterangepicker({
    drops: 'up',
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 2020,
    timePicker : true,
    timePicker24Hour : true,
    timePickerIncrement : 15,
    maxYear: parseInt(moment().format('YYYY'),10),
    locale: {
        format : 'YYYY-MM-DD HH:mm'
    }
});
$('#Hour').daterangepicker({
    drops: 'up',
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 2020,
    timePicker : true,
    timePicker24Hour : true,
    timePickerIncrement : 15,
    locale : {
        format : 'YYYY-MM-DD HH:mm'
    }
});
