export async function getGeoCoordsForContact(contact) {
    let geoCoord = [];
    let call = "https://api.tomtom.com/search/2/geocode/" + contact.street + "%20" + contact.house + "%20" + contact.city + ".json?limit=1?countrySet=DE&key=uPEVVjJEplE0v14jGXIeRVhKOKjfVFtJ"
    const request = new Request(call);
    await fetch(request)
        .then(response => response.json())
        .then(json => {
            json.results.forEach(result => {
                if (result.type == "Point Address") {
                    return geoCoord = [parseFloat(result.position.lat), parseFloat(result.position.lon)]
                    console.log(geoCoord,'erstes');
                };
            });
        });
}