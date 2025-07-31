import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import {
  hotelAmenities,
  hotelImages,
  hotelPolicies,
  hotels,
  hotelTypes
} from "@repo/database";
import { propertyClassSchema } from "../property-classes/property-classes.schema";
import { roomTypeSchema } from "../rooms/rooms.schems";

// Hotel Type Schemas
export const hotelTypeSchema = createSelectSchema(hotelTypes);

export type HotelType = z.infer<typeof hotelTypeSchema>;

export const hotelTypeInsertSchema = createInsertSchema(hotelTypes).omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true
});

export const hotelTypeUpdateSchema = createInsertSchema(hotelTypes)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    slug: true
  })
  .partial();

// Hotel Amenities Schemas
export const hotelAmenitySchema = createSelectSchema(hotelAmenities);

export type HotelAmenity = z.infer<typeof hotelAmenitySchema>;

export const hotelAmenityInsertSchema = createInsertSchema(hotelAmenities).omit(
  {
    id: true,
    createdAt: true,
    updatedAt: true
  }
);

export const hotelAmenityUpdateSchema = createInsertSchema(hotelAmenities)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

// Hotel Images Schemas
export const hotelImageSchema = createSelectSchema(hotelImages);

export type HotelImage = z.infer<typeof hotelImageSchema>;

export const hotelImageInsertSchema = createInsertSchema(hotelImages).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const hotelImageUpdateSchema = createInsertSchema(hotelImages)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

// Hotel Policies Schemas
export const hotelPolicySchema = createSelectSchema(hotelPolicies);

export type HotelPolicy = z.infer<typeof hotelPolicySchema>;

export const hotelPolicyInsertSchema = createInsertSchema(hotelPolicies).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const hotelPolicyUpdateSchema = createInsertSchema(hotelPolicies)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

/**
 * Complete Hotel Schema with Populated Relations
 *
 * Hotel Relations
 * - organizationId (need to populate)
 * - createdBy (dont need to populate)
 * - hotelType (need to populate, 1:1)
 * - propertyClass (need to populate, 1:1)
 * - images (need to populate, 1:M)
 * - amenities (need to populate, 1:M)
 * - policies (need to populate, 1:M)
 * - roomTypes (need to populate, 1:M)
 * - rooms (route based population, 1:M)
 */
export const basicHotelSchema = createSelectSchema(hotels, {
  hotelType: hotelTypeSchema,
  propertyClass: propertyClassSchema
});

export type BasicHotelType = z.infer<typeof basicHotelSchema>;

export const hotelSelectSchema = basicHotelSchema.extend({
  images: z.array(hotelImageSchema),
  amenities: z.array(hotelAmenitySchema),
  roomTypes: z.array(roomTypeSchema),
  policies: z.array(hotelPolicySchema)
});

export type HotelSelectType = z.infer<typeof hotelSelectSchema>;

export const hotelSelectWithRoomsSchema = hotelSelectSchema.extend({
  rooms: z.array(roomTypeSchema)
});

export type HotelSelectWithRoomsType = z.infer<
  typeof hotelSelectWithRoomsSchema
>;

export const hotelInsertSchema = createInsertSchema(hotels).omit({
  id: true,
  organizationId: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true
});

export type HotelInsertType = z.infer<typeof hotelInsertSchema>;

export const hotelUpdateSchema = createInsertSchema(hotels)
  .omit({
    id: true,
    organizationId: true,
    createdBy: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();
