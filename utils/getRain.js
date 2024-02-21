module.exports = {
  getRain: (data) => {
    if (data.next_1_hours) {
      return data.next_1_hours.details.precipitation_amount;
    } else if (data.next_6_hours) {
      return data.next_6_hours.details.precipitation_amount;
    }
    return 0;
  },
};
