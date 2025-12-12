module.exports = {
    validateSubmission: (data) => {
        if (!data.wasteType || !data.weight || !data.gps) {
            return false;
        }
        if (data.weight <= 0 || data.weight > 1000) {
            return false;
        }
        return true;
    }
};
