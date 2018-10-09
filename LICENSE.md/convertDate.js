function convertDate(date) {
    let dateArr = date.split(" ");
    
    let year = dateArr[2];

    function convertMonth(month) {
        let months = {
            January: "01",
            February: "02",
            March: "03",
            April: "04",
            May: "05",
            June: "06",
            July: "07",
            August: "08",
            September: "09",
            October: "10",
            November: "11",
            December: "12"
        }
        return months[month];
    }
    let month = convertMonth(dateArr[0]);

    let day = dateArr[1].split(",")[0];
    if (day.length === 1) {
        day = "0" + day;
    }

    let convertedDate = year + month + day;
    return convertedDate;
}

module.exports = convertDate;
