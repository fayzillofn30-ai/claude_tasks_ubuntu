


export const StaffApiBody = {
  schema: {
    type: 'object',
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
      father: { type: "string" },
      phone: { type: "string" },
      birthDay: { type: "date" },
      email: { type: "string" },
      role: { type: "string" },
      password: { type: "string" },
      image: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};

// @ApiBody({
//   schema: {
//     type: 'object',
//     properties: {
//       name: { type: 'string' },
//       about: { type: 'string' },
//       price: { type: 'number' },
//       categoryId: { type: 'string' },
//       mentorId: { type: 'string' },
//       published: { type: 'boolean' },
//       banner: {
//         type: 'string',
//         format: 'binary',
//       },
//       introVideo: {
//         type: 'string',
//         format: 'binary',
//       },
//     },
//   },
// })

//  40.790927, 72.332137
