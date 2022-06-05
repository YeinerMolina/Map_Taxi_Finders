options  = {
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
}
$('#DateI').daterangepicker(options);
$('#DateF').daterangepicker(options);

$('#DateI').on('apply.daterangepicker',()=>{
    InitialDateValue = document.getElementById('DateI').value;
    InitialOptions = $.extend(options,{minDate: new Date(InitialDateValue)})
    $('#DateF').daterangepicker(InitialOptions)
})

$('#DateF').on('apply.daterangepicker',()=>{
    FinalDateValue = document.getElementById('DateF').value;
    FinalOptions = $.extend(options,{maxDate: new Date(FinalDateValue)})
    $('#DateI').daterangepicker(FinalOptions)
})

