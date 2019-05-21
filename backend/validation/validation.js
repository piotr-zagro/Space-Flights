
const checkTourist =  ({ name, lastname, sex, country, birth }) => {
    const errors = []

    name ? null : errors.push("Name required")
    lastname ? null : errors.push("LastName required")
    sex ? null : errors.push("Sex required")
    country ? null : errors.push("Country required")
    birth ? null : errors.push("Birth required")

    if (sex !== 'F' && sex !== 'M') errors.push('There are only 2 genders')

    birth = new Date(birth)
    birth != "Invalid Date" ? null : errors.push("Birth must be datetype")
    birth < new Date() ? null : errors.push("Birth must be today or earlier") 

    return errors
}

const checkFlight =  ({ departure, arrival, seats, price }) => {
    const errors = []

    departure ? null : errors.push("departure required")
    arrival ? null : errors.push("arrival required")
    seats ? null : errors.push("seats required")
    price ? null : errors.push("price required")

    departure = new Date(departure)
    arrival = new Date(arrival)
    departure != "Invalid Date" ? null : errors.push("Departure must be datetype")
    arrival != "Invalid Date" ? null : errors.push("Arrival must be datetype")
    departure < arrival ? null : errors.push("Arrival must be after derparture")
    departure >= new Date() ? null : errors.push("Departure must be today or later")

    seats = parseInt(seats)
    price = parseInt(price)

    seats != "NaN" ? null : errors.push("Seats must be number")
    price != "NaN" ? null : errors.push("Price must be number")
    seats > 0 ? null : errors.push("Seats must be greater than 1")
    price > 0 ? null : errors.push("Price must be greater than 1")

    return errors
}

module.exports = {
    checkTourist, checkFlight
}