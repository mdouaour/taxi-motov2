import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const driverApplicationSchema = z.object({
  licenseNumber: z.string().min(1, "License number is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  vehicleColor: z.string().min(1, "Vehicle color is required"),
  vehicleRegistrationNumber: z.string().min(1, "Vehicle registration number is required"),
});

export const userUpdateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
  role: z.enum(["Rider", "Driver", "Admin"]).optional(),
});

export const fareRuleSchema = z.object({
  baseFare: z.number().positive("Base fare must be a positive number").optional(),
  minFareDistance: z.number().positive("Minimum fare distance must be a positive number").optional(),
  minFareAmount: z.number().positive("Minimum fare amount must be a positive number").optional(),
  perKmRate: z.number().positive("Per km rate must be a positive number").optional(),
  isActive: z.boolean().optional(),
});

export const rideCreationSchema = z.object({
  pickupLocation: z.object({
    type: z.literal("Point"),
    coordinates: z.array(z.number()).length(2, "Coordinates must be a [longitude, latitude] array"),
    address: z.string().min(1, "Pickup address is required"),
  }),
  dropoffLocation: z.object({
    type: z.literal("Point"),
    coordinates: z.array(z.number()).length(2, "Coordinates must be a [longitude, latitude] array"),
    address: z.string().min(1, "Dropoff address is required"),
  }),
  distance: z.number().positive("Distance must be a positive number"),
});
