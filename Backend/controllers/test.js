const { Customer } = require ("../models/allModelSchemas");
const newCustomer = Customer.build({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com'
  });
  newCustomer.save()
  .then(savedCustomer => {
    console.log("New customer created:", savedCustomer);
  })
  .catch(error => {
    console.error("Error creating customer:", error);
  });
