//https://stripe.com/docs/ach
// Testing ACH

// You can mimic successful and failed ACH charges using the following bank account and routing numbers:

//     Routing number: 110000000
//     Account number: 000123456789 (success), 000111111116 (failure upon use)

// To mimic successful and failed bank account verifications, use these meaningful amounts:

//     [32, 45] (success)
//     [any other number combinations] (failure)
