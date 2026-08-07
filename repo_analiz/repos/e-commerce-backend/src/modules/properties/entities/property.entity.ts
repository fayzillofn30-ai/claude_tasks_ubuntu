
export const propertyEntities = {
          title: true,
          additionals: true,
          owner: {
            select: {
              fullName: true,
              email: true,
              avatar: true,
              role: true,
            },
          },
          locationUrl: true,
          address: true,
          category: true,
          description: true,
          price: true,
          isSale: true,
          status: true,
          PropertyMedia: true,
          features: true,
          discount: true,
          id: true,
          ownerId: true,
        }