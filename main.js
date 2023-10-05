const convertToDateTimeLocalString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDateToCustomFormat(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add 1 to month since it's 0-based
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    const formattedDate = `${year}${month}${day}T${hours}${minutes}${seconds}`;

    return formattedDate;
}

function parseDate(dateString) {
    // Check if the input string matches the expected format
    const dateRegex = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/;
    const match = dateString.match(dateRegex);

    if (!match) {
        return null; // Invalid date format
    }

    const [, year, month, day, hours, minutes, seconds] = match;
    const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;

    const parsedDate = new Date(isoDateString);

    if (isNaN(parsedDate.getTime())) {
        return null; // Invalid date
    }

    return parsedDate;
}

function readRule(rrule) {
    rrule = typeof rrule !== 'undefined' ? rrule : '';

    if (rrule != '') {
        // Break down the rule by semi-colons first
        var items = rrule.split(';');
        var recur = {};
        for (var i = 0; i < items.length; i++) {
            if (items[i] !== '') {
                var temp = items[i].split('=');
                recur[temp[0]] = temp[1];
            }
        }
        console.log(recur);

        // See if the recurring rule has enough valid parts
        if (recur.FREQ && recur.DTSTART && (recur.COUNT || recur.UNTIL)) {
            recurringRule = {
                freq: recur.FREQ,
                dtstart: recur.DTSTART,
                interval: recur.INTERVAL,
                byday: "",
                bysetpos: "",
                bymonthday: "",
                bymonth: "",
                count: "",
                until: ""
            };

            // Set either COUNT or UNTIL
            if (typeof recur.COUNT == 'undefined' && recur.UNTIL) {
                recurringRule.until = recur.UNTIL;
            } else if (typeof recur.UNTIL == 'undefined' && recur.COUNT) {
                recurringRule.count = recur.COUNT;
            }

            // Set INTERVAL
            var intervalInput = document.querySelector('input[name="interval"]');
            intervalInput.value = recur.INTERVAL;

            var startDateInput = document.querySelector('#start-date');
            startDateInput.value = convertToDateTimeLocalString(parseDate(recur.DTSTART));


            // Setup the end-date picker
            var endDateInput = document.querySelector('#end-date');

            if (recur.UNTIL) {
                endDateInput.value =  convertToDateTimeLocalString(parseDate(recur.UNTIL));
                var endSelectRadio = document.querySelector('input[name="end-select"]');
                endSelectRadio.checked = true;
                recurringRule.count = '';
                // Set until variable
                recurringRule.until = formatDateToCustomFormat(parseDate(recur.UNTIL));
            } else {
                var countInput = document.querySelector('input[name="count"]');
                countInput.value = recur.COUNT;
            }

            // Set Recurring event radio to yes
            var eventRecurringRadio = document.querySelector('input[name="event-recurring"]');
            eventRecurringRadio.checked = true;

            // Show Recurring rules
            var recurringRules = document.querySelector('#recurring-rules');
            recurringRules.style.display = 'block';

            // Show Until Rules
            var untilRules = document.querySelector('#until-rules');
            untilRules.style.display = 'block';

            switch (recur.FREQ) {
                case ("DAILY"):
                    break;

                case ("WEEKLY"):
                    // Selectbox FREQ = weekly
                    var freqSelect = document.querySelector('select[name="freq"]');
                    freqSelect.value = 'weekly';

                    // Hide all DIVS
                    var recurringRulesDivs = document.querySelectorAll('#recurring-rules > div');
                    recurringRulesDivs.forEach(function (div) {
                        div.style.display = 'none';
                    });

                    // Show selected DIV
                    var weeksChoiceDiv = document.querySelector('div.weeks-choice');
                    weeksChoiceDiv.style.display = 'block';
                    var freqSelection = document.querySelector('span.freq-selection');
                    freqSelection.textContent = 'week(s)';

                    // Show Until / Count Rules
                    var untilRules = document.querySelector('#until-rules');
                    untilRules.style.display = 'block';

                    if (typeof recur.BYDAY !== 'undefined') {
                        // Split up the individual byday
                        var bydays = recur.BYDAY.split(',');
                        // Loop through the BYDAYs
                        bydays.forEach(function (byday) {
                            console.log(byday);
                            // Set select monthday buttons to active
                            var weekdaySelectButton = document.querySelector('#weekday-select button[id="' + byday + '"]');
                            if (weekdaySelectButton) {
                                weekdaySelectButton.classList.add('active');
                            }
                        });
                        recurringRule.byday = recur.BYDAY;
                        return true;
                    }
                    break;

                case ("MONTHLY"):
                    // Selectbox FREQ = monthly
                    var freqSelect = document.querySelector('select[name="freq"]');
                    freqSelect.value = 'monthly';

                    // Hide all DIVS
                    var recurringRulesDivs = document.querySelectorAll('#recurring-rules > div');
                    recurringRulesDivs.forEach(function (div) {
                        div.style.display = 'none';
                    });

                    // Show selected DIV
                    var monthsChoiceDiv = document.querySelector('div.months-choice');
                    monthsChoiceDiv.style.display = 'block';
                    var freqSelection = document.querySelector('span.freq-selection');
                    freqSelection.textContent = 'month(s)';

                    // Show Until / Count Rules
                    var untilRules = document.querySelector('#until-rules');
                    untilRules.style.display = 'block';

                    if (typeof recur.BYMONTHDAY !== 'undefined') {
                        // Split up the individual bymonthdays
                        var bymonthdays = recur.BYMONTHDAY.split(',');
                        // Loop through the BYMONTHDAYs
                        bymonthdays.forEach(function (bymonthday) {
                            console.log(bymonthday);
                            // Set select monthday buttons to active
                            var monthdaySelectButton = document.querySelector('#monthday-select button[data-day-num="' + bymonthday + '"]');
                            if (monthdaySelectButton) {
                                monthdaySelectButton.classList.add('active');
                            }
                        });
                        recurringRule.bymonthday = recur.BYMONTHDAY;
                        return true;
                    }

                    if (typeof recur.BYSETPOS !== 'undefined' && typeof recur.BYDAY !== 'undefined') {
                        // Set Radio Button
                        var monthBydayPosSelectedRadio = document.querySelector('input#month-byday-pos-selected');
                        monthBydayPosSelectedRadio.checked = true;

                        // Enable select elements
                        var monthBydaySelectElements = document.querySelectorAll('select[name^="month-byday"]');
                        monthBydaySelectElements.forEach(function (element) {
                            element.removeAttribute('disabled');
                        });

                        // Set values
                        var monthBydayPosSelect = document.querySelector('select[name="month-byday-pos"]');
                        var monthBydayPosNameSelect = document.querySelector('select[name="month-byday-pos-name"]');
                        monthBydayPosSelect.value = recur.BYSETPOS;
                        monthBydayPosNameSelect.value = recur.BYDAY;

                        // Disable day buttons
                        var monthdaySelectButtons = document.querySelectorAll('#monthday-select button');
                        monthdaySelectButtons.forEach(function (button) {
                            button.setAttribute('disabled', 'disabled');
                        });

                        recurringRule.bysetpos = recur.BYSETPOS;
                        recurringRule.byday = recur.BYDAY;

                        return true;
                    }
                    break;

                case ("YEARLY"):
                    // Selectbox FREQ = yearly
                    var freqSelect = document.querySelector('select[name="freq"]');
                    freqSelect.value = 'yearly';

                    // Hide all DIVS
                    var recurringRulesDivs = document.querySelectorAll('#recurring-rules > div');
                    recurringRulesDivs.forEach(function (div) {
                        div.style.display = 'none';
                    });

                    // Show selected DIV
                    var yearsChoiceDiv = document.querySelector('div.years-choice');
                    yearsChoiceDiv.style.display = 'block';
                    var freqSelection = document.querySelector('span.freq-selection');
                    freqSelection.textContent = 'year(s)';

                    // Show Until / Count Rules
                    var untilRules = document.querySelector('#until-rules');
                    untilRules.style.display = 'block';

                    // BYMONTH and BYMONTHDAY attributes are going to be set
                    if (typeof recur.BYMONTHDAY !== 'undefined' && typeof recur.BYMONTH !== 'undefined') {
                        // Set Radio Button
                        var yearlyOneMonthRadio = document.querySelector('input#yearly-one-month');
                        yearlyOneMonthRadio.checked = true;

                        // Enable select boxes
                        var yearlyBymonthSelect = document.querySelector('select[name="yearly-bymonth"]');
                        var yearlyBymonthdaySelect = document.querySelector('select[name="yearly-bymonthday"]');
                        yearlyBymonthSelect.removeAttribute('disabled');
                        yearlyBymonthdaySelect.removeAttribute('disabled');

                        // Set values
                        yearlyBymonthSelect.value = recur.BYMONTH;
                        yearlyBymonthdaySelect.value = recur.BYMONTHDAY;

                        recurringRule.bymonth = recur.BYMONTH;
                        recurringRule.bymonthday = recur.BYMONTHDAY;

                        return true;
                    }

                    // Multiple Month Selection
                    if (typeof recur.BYMONTH !== 'undefined' && typeof recur.BYMONTHDAY == 'undefined') {
                        // Disable yearly select boxes
                        var yearlySelectBoxes = document.querySelectorAll('select[name^="yearly-"]');
                        yearlySelectBoxes.forEach(function (selectBox) {
                            selectBox.setAttribute('disabled', 'disabled');
                        });

                        // Set Radio Button
                        var yearlyMultipleMonthsRadio = document.querySelector('input#yearly-multiple-months');
                        yearlyMultipleMonthsRadio.checked = true;

                        // Make buttons active
                        var yearlyMultipleMonthButtons = document.querySelectorAll('.yearly-multiple-months button');
                        yearlyMultipleMonthButtons.forEach(function (button) {
                            button.removeAttribute('disabled');
                        });

                        // Split up the individual bymonthdays
                        var bymonth = recur.BYMONTH.split(',');

                        // Loop through the BYMONTHs
                        bymonth.forEach(function (month) {
                            console.log(month);
                            // Set select month buttons to active
                            var yearlyMultipleMonthButton = document.querySelector('.yearly-multiple-months button[data-month-num="' + month + '"]');
                            if (yearlyMultipleMonthButton) {
                                yearlyMultipleMonthButton.classList.add('active');
                            }
                        });
                        recurringRule.bymonth = recur.BYMONTH;

                        return true;
                    }

                    // Precise Yearly Selection
                    if (typeof recur.BYMONTH !== 'undefined' && typeof recur.BYDAY !== 'undefined' && typeof recur.BYSETPOS !== 'undefined') {
                        // Disable yearly select boxes
                        var yearlySelectBoxes = document.querySelectorAll('select[name^="yearly-"]');
                        yearlySelectBoxes.forEach(function (selectBox) {
                            selectBox.setAttribute('disabled', 'disabled');
                        });

                        // Enable the right select
                        var yearlyPreciseSelect = document.querySelector('select[class="yearly-precise"]');
                        yearlyPreciseSelect.removeAttribute('disabled');

                        // Set Radio Button
                        var yearlyPreciseRadio = document.querySelector('input#yearly-precise');
                        yearlyPreciseRadio.checked = true;

                        // Set select values
                        var yearlyBydaySelect = document.querySelector('select[name="yearly-byday"]');
                        var yearlyBysetposSelect = document.querySelector('select[name="yearly-bysetpos"]');
                        yearlyBydaySelect.value = recur.BYDAY;
                        yearlyBysetposSelect.value = recur.BYSETPOS;

                        recurringRule.bymonth = recur.BYMONTH;
                        recurringRule.byday = recur.BYDAY;
                        recurringRule.bysetpos = recur.BYSETPOS;

                        return true;
                    }
                    break;
            }
        }
    }

    return false;
}

function rruleGenerate() {
    // Produce RRULE state to feed to rrule.js
    rrule = "";

    // Check to be sure there is a count value or until date selected
    if ( recurringRule.count == "" && recurringRule.until == "" ){
        // No end in sight, make it default to 1 occurence
        recurringRule.count = "1";
    }
    for ( var key in recurringRule ) {
        if ( recurringRule.hasOwnProperty(key) ) {
            if ( recurringRule[key] != '') {
                rrule += key + '=' + recurringRule[key] + ';';
            }
        }
    }
    // Remove the last semicolon from the end of RRULE
    rrule = rrule.replace(/;\s*$/, "");

    tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    output = `DTSTART;TZID=${tz}:${recurringRule.dtstart}\n${rrule}`
    console.log(output)

    // Convert to Uppercase and return
    return output.toUpperCase();
}
var MyDateString = new Date()
var recurringRule = {
    freq: "daily",
    dtstart: formatDateToCustomFormat(new Date()),
    interval: "1",
    byday: "",
    bysetpos: "",
    bymonthday: "",
    bymonth: "",
    count: "1",
    until:''
};
function resetOptions() {
    // Format the date


    // Reset all the selected rules


    // Reset all button states and input values
    var buttons = document.querySelectorAll('button');
    buttons.forEach(function (button) {
        button.classList.remove('active');
    });

    // Reset interval label to 'days'
    var freqSelection = document.querySelector('span.freq-selection');
    freqSelection.textContent = 'days';

    // Hide all but the daily options
    var monthdaySelect = document.getElementById('monthday-select');
    var bymonthSelect = document.getElementById('bymonth-select');
    var weekdaySelect = document.getElementById('weekday-select');
    monthdaySelect.style.display = 'none';
    bymonthSelect.style.display = 'none';
    weekdaySelect.style.display = 'none';

    // Reset Interval back to 1
    var intervalInput = document.querySelector('input[name="interval"]');
    intervalInput.value = '1';

    // Reset Count back to 1
    var countInput = document.querySelector('input[name="count"]');
    countInput.value = '1';

    // Change back to Daily
    var freqSelect = document.querySelector('select[name="freq"]');
    freqSelect.value = 'daily';

    // Reset Until / Count radio buttons
    var untilSelectRadio = document.getElementById('until-select');
    var countSelectRadio = document.getElementById('count-select');
    untilSelectRadio.checked = false;
    countSelectRadio.checked = true;
    countSelectRadio.dispatchEvent(new Event('change'));
}


// Function to handle document ready
function documentReady() {


    if (true) {
        resetOptions();

        // Setup start-date picker
        var startDateInput = document.getElementById('start-date');
        startDateInput.addEventListener('change', function () {
            recurringRule.dtstart = formatDateToCustomFormat(startDateInput.value);
        });
        startDateInput.value =  convertToDateTimeLocalString(MyDateString);

        // Setup the end-date picker
        var endDateInput = document.getElementById('end-date');
        endDateInput.addEventListener('change', function () {
            recurringRule.count = '';
            recurringRule.until = formatDateToCustomFormat(endDateInput.value);
        });

        endDateInput.value = convertToDateTimeLocalString(MyDateString);
    }

    // Setup buttons - Prevent form submission
    var buttons = document.querySelectorAll('button');
    buttons.forEach(function (button) {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            return false;
        });
    });
}

// Add a DOMContentLoaded event listener to execute the code when the document is ready
document.addEventListener('DOMContentLoaded', documentReady);


var recurringInputs = document.querySelectorAll('input[name="event-recurring"]');

// Get the elements with IDs "recurring-rules" and "until-rules"
var recurringRules = document.getElementById('recurring-rules');
var untilRules = document.getElementById('until-rules');

// Function to reset all recurring options
function resetOptions() {
    // Implement your reset logic here
}

// Add change event listeners to all input elements with the name "event-recurring"
recurringInputs.forEach(function(input) {
    input.addEventListener('change', function() {
        // Reset all recurring options
        resetOptions();

        // Enable the input next to the selected radio button
        if (input.value === "yes") {
            recurringRules.style.display = 'block';

            // Show Until Rules
            untilRules.style.display = 'block';
        } else {
            // Disable the inputs not selected
            recurringRules.style.display = 'none';
            untilRules.style.display = 'none';
        }
    });
});

// Get the select element with the name "freq"
var freqSelect = document.querySelector('select[name="freq"]');

// Get all the div elements inside the "recurring-rules" container
var recurringRuleDivs = document.querySelectorAll('#recurring-rules > div');

// Get the span element with the class "freq-selection"
var freqSelectionSpan = document.querySelector('span.freq-selection');

// Get the select element with the name "yearly-bymonth"
var yearlyByMonthSelect = document.querySelector('select[name="yearly-bymonth"]');

// Function to handle the change event of the "freq" select
function handleFreqSelectChange() {
    var selectedOption = freqSelect.options[freqSelect.selectedIndex];
    var selectedFrequency = selectedOption.getAttribute('class');

    // Hide all DIVs
    recurringRuleDivs.forEach(function(div) {
        div.style.display = 'none';
    });

    // Show selected DIV
    var selectedDiv = document.querySelector('div.' + selectedFrequency + '-choice');
    if (selectedDiv) {
        selectedDiv.style.display = 'block';
    }

    // Update the text of the span
    freqSelectionSpan.textContent = selectedFrequency;

    // Show Until / Count Rules
    document.getElementById('until-rules').style.display = 'block';

    // Reset all the selected rules
    recurringRule = {
        freq: "",
        dtstart: document.getElementById('start-date-hidden').value,
        interval: "1",
        byday: "",
        bysetpos: "",
        bymonthday: "",
        bymonth: "",
        count: "1",
        until: ""
    };

    // Set frequency
    recurringRule.freq = selectedOption.value;

    // If it is yearly, trigger a change event to set up default values
    if (recurringRule.freq === "yearly") {
        var event = new Event('change');
        yearlyByMonthSelect.dispatchEvent(event);
    }
}

// Add a change event listener to the "freq" select
freqSelect.addEventListener('change', handleFreqSelectChange);

// Get the input element with the name "interval"
var intervalInput = document.querySelector('input[name="interval"]');

// Add event listeners for change, blur, and keyup events
intervalInput.addEventListener('change', handleIntervalInputChange);
intervalInput.addEventListener('blur', handleIntervalInputChange);
intervalInput.addEventListener('keyup', handleIntervalInputChange);

// Function to handle the change, blur, and keyup events on the "interval" input
function handleIntervalInputChange() {
    recurringRule.interval = intervalInput.value;
}

// Optional: If you want to handle the event propagation for blur and keyup events, you can prevent them from bubbling up.
intervalInput.addEventListener('blur', function (event) {
    event.stopPropagation();
});

intervalInput.addEventListener('keyup', function (event) {
    event.stopPropagation();
});

// Get all the buttons inside the "weekday-select" container
var weekdayButtons = document.querySelectorAll('#weekday-select button');

// Function to handle the click event on weekday buttons
function handleWeekdayButtonClick() {
    this.classList.toggle('active');
    var byday = []; // Array to store 'byday'

    // Store selected days in the BYDAY rule
    weekdayButtons.forEach(function(button) {
        // Active class indicates the selected day
        if (button.classList.contains('active')) {
            byday.push(button.id);
        }
    });

    recurringRule.byday = byday;
}

// Add click event listeners to weekday buttons
weekdayButtons.forEach(function(button) {
    button.addEventListener('click', handleWeekdayButtonClick);
});

// Get all the buttons inside the "monthday-select" container
var monthdayButtons = document.querySelectorAll('#monthday-select button');

// Function to handle the click event on monthday buttons
function handleMonthdayButtonClick() {
    this.classList.toggle('active');
    var bymonthday = []; // Array to store 'bymonthday'

    // Store selected days in the BYMONTHDAY rule
    monthdayButtons.forEach(function(button) {
        // Active class indicates the selected day
        if (button.classList.contains('active')) {
            bymonthday.push(button.getAttribute('data-day-num'));
        }
    });

    recurringRule.bymonthday = bymonthday;

    // Reset BYDAY Option
    recurringRule.byday = "";

    // Reset BySetPos
    recurringRule.bysetpos = "";
}

// Add click event listeners to monthday buttons
monthdayButtons.forEach(function(button) {
    button.addEventListener('click', handleMonthdayButtonClick);
});
// Get all the buttons inside the "bymonth-select" container
var bymonthButtons = document.querySelectorAll('#bymonth-select button');

// Function to handle the click event on bymonth buttons
function handleByMonthButtonClick() {
    this.classList.toggle('active');
    var bymonth = []; // Array to store 'bymonth'

    // Store selected months in the BYMONTH rule
    bymonthButtons.forEach(function(button) {
        // Active class indicates the selected month
        if (button.classList.contains('active')) {
            bymonth.push(button.getAttribute('data-month-num'));
        }
    });

    recurringRule.bymonth = bymonth;
}

// Add click event listeners to bymonth buttons
bymonthButtons.forEach(function(button) {
    button.addEventListener('click', handleByMonthButtonClick);
});

// Get all radio buttons with the name "monthday-pos-select"
var monthdayPosSelectRadios = document.querySelectorAll('input[name="monthday-pos-select"]');

// Get the monthday-select container
var monthdaySelectContainer = document.getElementById('monthday-select');

// Get all the monthday buttons inside the container
var monthdayButtons = monthdaySelectContainer.querySelectorAll('button');

// Get all the select elements with names starting with "month-byday"
var monthByDaySelects = document.querySelectorAll('select[name^="month-byday"]');

// Function to handle the change event of radio buttons
function handleMonthdayPosSelectChange() {
    // Selected Radio Button
    var selectedRadio = this.value;

    // Iterate through all radio buttons to check which one is selected
    monthdayPosSelectRadios.forEach(function(radio) {
        if (radio.value === selectedRadio) {
            switch (radio.value) {
                case "month-byday-pos-selected":
                    // ByDay Select Boxes are being used instead of the Month Day

                    // Disable all the monthday buttons
                    monthdayButtons.forEach(function(button) {
                        button.disabled = true;
                    });

                    // Enable and fire 'change' event on the ByDay select boxes
                    monthByDaySelects.forEach(function(select) {
                        select.disabled = false;
                        var event = new Event('change');
                        select.dispatchEvent(event);
                    });

                    // Mark recurring object bymonthday back to nothing
                    recurringRule.bymonthday = [];

                    break;

                case "monthday-selected":
                    // Month Day Buttons are being used instead of the ByDay select boxes

                    // Enable the monthday buttons and reset their state
                    monthdayButtons.forEach(function(button) {
                        button.disabled = false;
                        button.classList.remove('active');
                    });

                    // Disable the ByDay select boxes and reset related recurring rules
                    monthByDaySelects.forEach(function(select) {
                        select.disabled = true;
                    });

                    recurringRule.byday = "";
                    recurringRule.bysetpos = "";

                    break;
            }
        }
    });
}

// Add change event listeners to the radio buttons
monthdayPosSelectRadios.forEach(function(radio) {
    radio.addEventListener('change', handleMonthdayPosSelectChange);
});

// Get all radio buttons with the name "yearly-options"
var yearlyOptionsRadios = document.querySelectorAll('input[name="yearly-options"]');

// Get all select elements with class starting with "yearly"
var yearlySelects = document.querySelectorAll('select[class^="yearly"]');

// Get all buttons inside the "yearly-multiple-months" container
var yearlyMultipleMonthsButtons = document.querySelectorAll('.yearly-multiple-months button');

// Function to handle the change event of yearly options radio buttons
function handleYearlyOptionsChange() {
    // Selected Radio Button ID
    var selectedRadio = this.getAttribute('id');

    // Iterate through all radio buttons to check which one is selected
    yearlyOptionsRadios.forEach(function(radio) {
        if (radio.getAttribute('id') === selectedRadio) {
            switch (radio.getAttribute('id')) {
                case "yearly-one-month":
                    // Example Pattern
                    // FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1;UNTIL=20150818;

                    // BYMONTH and BYMONTHDAY attributes are going to be set
                    // Reset BYSETPOS, BYDAY
                    recurringRule.bysetpos = "";
                    recurringRule.byday = "";

                    // Disable all the yearly select boxes
                    yearlySelects.forEach(function(select) {
                        select.disabled = true;
                    });

                    // Disable all the yearly multiple month buttons
                    yearlyMultipleMonthsButtons.forEach(function(button) {
                        button.disabled = true;
                        button.classList.remove('active');
                    });

                    // Enable Yearly One Month Options
                    document.querySelector('select[class="yearly-one-month"]').disabled = false;

                    // Fire change to select default values
                    document.querySelector('select[name="yearly-bymonth"]').dispatchEvent(new Event('change'));

                    break;

                case "yearly-multiple-months":
                    // Example Pattern
                    // FREQ=YEARLY;INTERVAL=1;BYMONTH=1,3,4,10;COUNT=1

                    // BYMONTH attribute is going to be set
                    // Reset BYMONTHDAY, BYDAY, BYSETPOS
                    recurringRule.bymonthday = "";
                    recurringRule.byday = "";
                    recurringRule.bysetpos = "";

                    // Disable all the yearly select boxes
                    yearlySelects.forEach(function(select) {
                        select.disabled = true;
                    });

                    // Enable the buttons
                    yearlyMultipleMonthsButtons.forEach(function(button) {
                        button.disabled = false;
                    });

                    break;

                case "yearly-precise":
                    // Example Pattern
                    // FREQ=YEARLY;BYDAY=SU;BYSETPOS=1;BYMONTH=1;UNTIL=20150818;

                    // BYDAY, BYSETPOS, and BYMONTH are going to be set
                    // Reset BYMONTHDAY
                    recurringRule.bymonthday = "";

                    // Disable all the yearly select boxes
                    yearlySelects.forEach(function(select) {
                        select.disabled = true;
                    });

                    // Disable all the yearly multiple month buttons
                    yearlyMultipleMonthsButtons.forEach(function(button) {
                        button.disabled = true;
                        button.classList.remove('active');
                    });

                    // Enable Yearly One Month Options
                    document.querySelector('select[class="yearly-precise"]').disabled = false;

                    // Fire change to select default values
                    document.querySelector('select[name="yearly-bysetpos"]').dispatchEvent(new Event('change'));

                    break;
            }
        }
    });
}

// Add change event listeners to the yearly options radio buttons
yearlyOptionsRadios.forEach(function(radio) {
    radio.addEventListener('change', handleYearlyOptionsChange);
});

// Get the select element for yearly BYMONTH
var yearlyByMonthSelect = document.querySelector('select[name="yearly-bymonth"]');

// Get the select element for yearly BYMONTHDAY
var yearlyByMonthDaySelect = document.querySelector('select[name="yearly-bymonthday"]');

// Function to handle the change event of yearly BYMONTH and BYMONTHDAY selects
function handleYearlyByMonthAndByMonthDayChange() {
    // Get the selected BYMONTH value
    var bymonth = yearlyByMonthSelect.value;

    // Get the selected BYMONTHDAY values as an array
    var bymonthday = Array.from(yearlyByMonthDaySelect.selectedOptions, option => option.value);

    recurringRule.bymonth = bymonth;
    recurringRule.bymonthday = bymonthday;
}

// Add change event listeners to the yearly BYMONTH and BYMONTHDAY selects
yearlyByMonthSelect.addEventListener('change', handleYearlyByMonthAndByMonthDayChange);
yearlyByMonthDaySelect.addEventListener('change', handleYearlyByMonthAndByMonthDayChange);


// Get all buttons inside the "yearly-multiple-months" container
var yearlyMultipleMonthsButtons = document.querySelectorAll('.yearly-multiple-months button');

// Function to handle the click event on yearly multiple month buttons
function handleYearlyMultipleMonthButtonClick() {
    this.classList.toggle('active');
    var bymonth = []; // Array to store 'bymonth'

    // Store selected months in the BYMONTH rule
    yearlyMultipleMonthsButtons.forEach(function(button) {
        // Active class indicates the selected month
        if (button.classList.contains('active')) {
            bymonth.push(button.getAttribute('data-month-num'));
        }
    });

    recurringRule.bymonth = bymonth;
}

// Add click event listeners to yearly multiple month buttons
yearlyMultipleMonthsButtons.forEach(function(button) {
    button.addEventListener('click', handleYearlyMultipleMonthButtonClick);
});

// Get the select elements for yearly BYSETPOS, BYDAY, and BYMONTH
var yearlyBySetPosSelect = document.querySelector('select[name="yearly-bysetpos"]');
var yearlyByDaySelect = document.querySelector('select[name="yearly-byday"]');
var yearlyByMonthWithBySetPosByDaySelect = document.querySelector('select[name="yearly-bymonth-with-bysetpos-byday"]');

// Function to handle the change event of yearly BYSETPOS, BYDAY, and BYMONTH selects
function handleYearlyPreciseChange() {
    // Get the selected BYSETPOS, BYDAY, and BYMONTH values
    var bysetpos = yearlyBySetPosSelect.value;
    var byday = yearlyByDaySelect.value.split(',');
    var bymonth = yearlyByMonthWithBySetPosByDaySelect.value;

    recurringRule.bymonthday = "";

    recurringRule.bymonth = bymonth;
    recurringRule.byday = byday;
    recurringRule.bysetpos = bysetpos;
}

// Add change event listeners to the yearly BYSETPOS, BYDAY, and BYMONTH selects
yearlyBySetPosSelect.addEventListener('change', handleYearlyPreciseChange);
yearlyByDaySelect.addEventListener('change', handleYearlyPreciseChange);
yearlyByMonthWithBySetPosByDaySelect.addEventListener('change', handleYearlyPreciseChange);

// Get the select elements for monthly BYDAY and BYSETPOS
var monthByDayPosSelect = document.querySelector('select[name="month-byday-pos"]');
var monthByDayPosNameSelect = document.querySelector('select[name="month-byday-pos-name"]');

// Function to handle the change event of monthly BYDAY and BYSETPOS selects
function handleMonthlyByDayAndBySetPosChange() {
    // Get the selected BYSETPOS value
    var bySetPos = monthByDayPosSelect.value;

    // Make an array of selected days
    var daysSelected = monthByDayPosNameSelect.value.split(',');

    recurringRule.bysetpos = bySetPos;
    recurringRule.byday = daysSelected;
}

// Add change event listeners to the monthly BYDAY and BYSETPOS selects
monthByDayPosSelect.addEventListener('change', handleMonthlyByDayAndBySetPosChange);
monthByDayPosNameSelect.addEventListener('change', handleMonthlyByDayAndBySetPosChange);

// Get the input element with the name "count"
var countInput = document.querySelector('input[name="count"]');

// Function to handle the input and change events on the "count" input
function handleCountInputChange() {
    recurringRule.count = countInput.value;
}

// Add input and change event listeners to the "count" input
countInput.addEventListener('input', handleCountInputChange);
countInput.addEventListener('change', handleCountInputChange);

// Get all radio buttons with the name "end-select"
var endSelectRadios = document.querySelectorAll('input[name="end-select"]');

// Get the input elements with the corresponding names for "Until" and "Count"
var untilInput = document.querySelector('input[name="until"]');
var countInput = document.querySelector('input[name="count"]');

// Function to handle the change event of "Until" and "Count" radio buttons
function handleEndSelectChange() {
    // Selected Radio Button
    var selectedRadio = this.value;

    // Iterate through all radio buttons to check which one is selected
    endSelectRadios.forEach(function(radio) {
        if (radio.value === selectedRadio) {
            // Enable the input next to the selected radio button
            radio.nextElementSibling.removeAttribute('disabled');
            if (selectedRadio === 'until') {
                // Set the date in the until textbox as the until date

                // Remove the count variable
                recurringRule.count = '';
                // Set until variable
                recurringRule.until = formatDateToCustomFormat(new Date(document.getElementById('end-date').value));
            }
        } else {
            // Disable the inputs not selected
            radio.nextElementSibling.setAttribute('disabled', 'disabled');
            radio.nextElementSibling.value = '';

            // Reset the stored value in the recurringRule object
            var notSelectedName = radio.nextElementSibling.getAttribute('name');
            recurringRule[notSelectedName] = '';
        }
    });
}

// Add change event listeners to the "Until" and "Count" radio buttons
endSelectRadios.forEach(function(radio) {
    radio.addEventListener('change', handleEndSelectChange);
});

// Get the form element with the id "rrule"
var rruleForm = document.getElementById('rrule');

// Function to handle the form submission
function handleFormSubmit(e) {
    e.preventDefault();

    // Generate the rrule
    var rrule = rruleGenerate();

    if (rrule !== '') {
        // Perform further actions here if needed
        // For now, we'll just display an alert with the generated rrule
        alert(rrule);
    }

    return false;
}

// Add a submit event listener to the form
rruleForm.addEventListener('submit', handleFormSubmit);
