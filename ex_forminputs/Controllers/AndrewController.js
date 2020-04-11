// This is the default page for domain.com/
exports.Index = async function(request, response){

    // Data for retail stores drop-down. The empty string is so 
    // none are selected at the start.
    let stores = ["", "Aritzia", "Ardene", "Reitmans", "Nordstrom"];
    let days   = ["Mon", "Tue", "Wed", "Thur"]
    response.render('Home/Index', { 
                    // Data for retail stores drop-down. None selected.
                    stores: stores, selectedItem:"", 
                    days:days,
                    selectedDay:"Wed",
                    errorMessage:""})
};

// Extract contents from a POST request.
exports.ReceiveForm = async function(request, response){
    let store    = request.body.retailStore;
    let day      = request.body.dayOfWeek;
    let vehicles = request.body.vehicles;
    response.render('Home/SubmittedData', { selectedStore: store, selectedDay:day, 
                                            selectedVehicles: vehicles })
};
