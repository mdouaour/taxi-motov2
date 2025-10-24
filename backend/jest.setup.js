import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

// Mock Mongoose connection for tests
jest.mock("../config/db", () => ({
  __esModule: true,
  default: jest.fn(() => console.log("Mock MongoDB Connected")), // Mock the connectDB function
}));

// Mock the User model for tests
jest.mock("../models/userModel", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    // Add other mocked methods as needed
  },
}));

// Mock the Driver model for tests
jest.mock("../models/driverModel", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    // Add other mocked methods as needed
  },
}));

// Mock the Ride model for tests
jest.mock("../models/rideModel", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    // Add other mocked methods as needed
  },
}));

// Mock the Fare model for tests
jest.mock("../models/fareModel", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    // Add other mocked methods as needed
  },
}));

// Mock the PromoCode model for tests
jest.mock("../models/promoCodeModel", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    // Add other mocked methods as needed
  },
}));

// Mock the Location model for tests
jest.mock("../models/locationModel", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    // Add other mocked methods as needed
  },
}));

// Mock the AdminLog model for tests
jest.mock("../models/adminLogModel", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    // Add other mocked methods as needed
  },
}));

// Mock the Rating model for tests
jest.mock("../models/ratingModel", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    // Add other mocked methods as needed
  },
}));

// Mock generateToken
jest.mock("../utils/generateToken", () => ({
  __esModule: true,
  default: jest.fn(() => "mockToken"),
}));
