import { CourseLevelArr, HomeWorkSubStatusArr } from "./enum.types";

export const categoryApiBody = {
  schema: {
    type: 'object',
    properties: {
      name: { type: "string" },
      image: {
        type: 'string',
        format: 'binary',
      },
    }
  }
}

export const AdditionalApiBody = {
  schema: {
    type: 'object',
    properties: {
      propertyId: {
        type: 'string',
        format: 'uuid',
        example: '49e4fb41-109e-4f93-ad84-7f8af260d21d',
      },
      buildTypeId: {
        type: 'string',
        format: 'uuid',
        example: '53802dde-969e-439e-ae6c-c0605288abf6',
      },
      label: {
        type: 'string',
        example: 'Modern House',
      },
      material: {
        type: 'string',
        example: 'Brick',
      },
      rooms: {
        type: 'integer',
        example: 4,
      },
      beds: {
        type: 'integer',
        example: 3,
      },
      baths: {
        type: 'integer',
        example: 2,
      },
      garages: {
        type: 'integer',
        example: 1,
      },
      garageSize: {
        type: 'number',
        example: 20.5,
      },
      year_build: {
        type: 'integer',
        example: 2015,
      },
      homeArea: {
        type: 'integer',
        example: 180,
      },
      lotDimensions: {
        type: 'string',
        example: '20x40',
      },
      lotArea: {
        type: 'integer',
        example: 800,
      },
    },
    required: [
      'propertyId',
      'buildTypeId',
      'label',
      'material',
      'rooms',
      'beds',
      'baths',
      'garages',
      'garageSize',
      'year_build',
      'homeArea',
      'lotDimensions',
      'lotArea',
    ],
  },
};


export const PropertyApiBody = {
  schema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        example: 'Modern Villa in Andijan',
      },
      description: {
        type: 'string',
        example: 'A spacious villa with modern design and large garden.',
      },
      price: {
        type: 'integer',
        example: 2500000,
      },
      discount: {
        type: 'number',
        example: 12.5,
      },
      features: {
        type: 'object',
        example: {
          wifi: true,
          pool: false,
          floor: 3,
        },
      },
      locationUrl: {
        type: 'string',
        example: 'https://maps.app.goo.gl/nhEkVzyhhrwTa5Lk8',
      },
      address: {
        type: 'string',
        example: 'Andijon,Andijon Viloyati, Oʻzbekiston',
      },
      status: {
        type: 'string',
        enum: ['RENT', 'SALE'],
        example: 'RENT',
      },
      isSale: {
        type: 'boolean',
        example: true,
      },
      ownerId: {
        type: 'string',
        format: 'uuid',
        example: '69eccdcd-f02b-495e-b730-88c4623ac6fe',
      },
      categoryId: {
        type: 'integer',
        example: 6,
      },
    },
    required: [
      'title',
      'price',
      'locationUrl',
      'address',
      'ownerId',
      'categoryId',
    ],
  },
};

export const propertyMediaApiBody = {
  schema: {
    type: 'object',
    properties: {
      propertyId: { 
        type: 'string',
        description: 'Property ID (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      features: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary'
        },
        description: 'Feature files (images, videos) - stored as JSON array'
      },
      gallery: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary'
        },
        description: 'Gallery files - stored as JSON array'
      },
      attachments: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary'
        },
        description: 'Attachment files (documents, etc.) - stored as JSON array'
      },
    },
    required: ['propertyId']
  }
}


export const userApiBody = {
  schema: {
    type: 'object',
    properties: {
      fullName: { type: "string" },
      email: { type: "string" },
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
