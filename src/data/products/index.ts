/**
 * Canadian Insurance Products Data Layer
 * Central export for all product data and helper functions
 */

export * from "./types";
export * from "./manulife";
export * from "./equitable";

import { MANULIFE_PRODUCTS, getManulifeIFAProducts } from "./manulife";
import { EQUITABLE_PRODUCTS, getEquitableIFAProducts } from "./equitable";
import type { CanadianInsuranceProduct, CanadianProductType, CanadianCarrier } from "./types";

/**
 * All Canadian products from all carriers
 */
export const ALL_CANADIAN_PRODUCTS: CanadianInsuranceProduct[] = [
  ...MANULIFE_PRODUCTS,
  ...EQUITABLE_PRODUCTS,
];

/**
 * Get all IFA products (PRIMARY FOCUS) from all carriers
 */
export function getAllIFAProducts(): CanadianInsuranceProduct[] {
  return ALL_CANADIAN_PRODUCTS.filter((p) => p.productType === "IFA");
}

/**
 * Get products by carrier
 */
export function getProductsByCarrier(carrier: CanadianCarrier): CanadianInsuranceProduct[] {
  return ALL_CANADIAN_PRODUCTS.filter((p) => p.carrier === carrier);
}

/**
 * Get products by type
 */
export function getProductsByType(type: CanadianProductType): CanadianInsuranceProduct[] {
  return ALL_CANADIAN_PRODUCTS.filter((p) => p.productType === type);
}

/**
 * Get product by ID
 */
export function getProductById(id: string): CanadianInsuranceProduct | undefined {
  return ALL_CANADIAN_PRODUCTS.find((p) => p.id === id);
}

/**
 * Get products suitable for a given age
 */
export function getProductsByAge(age: number): CanadianInsuranceProduct[] {
  return ALL_CANADIAN_PRODUCTS.filter((p) => age >= p.minAge && age <= p.maxAge);
}

/**
 * Get products suitable for a given premium amount (CAD)
 */
export function getProductsByPremium(premiumCAD: number): CanadianInsuranceProduct[] {
  return ALL_CANADIAN_PRODUCTS.filter((p) => {
    const meetsMin = premiumCAD >= p.minPremium;
    const meetsMax = p.maxPremium === undefined || premiumCAD <= p.maxPremium;
    return meetsMin && meetsMax;
  });
}

/**
 * Get IFA products by structure type
 */
export function getIFAProductsByStructure(structure: string): CanadianInsuranceProduct[] {
  return getAllIFAProducts().filter((p) => p.ifaStructure === structure);
}

/**
 * Check if product is suitable for corporate ownership
 */
export function isCorporateProduct(product: CanadianInsuranceProduct): boolean {
  return product.corporateOwned === true || product.productType === "IFA";
}

/**
 * Get all carriers
 */
export const CANADIAN_CARRIERS: CanadianCarrier[] = ["Manulife", "Equitable Life Canada"];

/**
 * Get all product types
 */
export const CANADIAN_PRODUCT_TYPES: CanadianProductType[] = [
  "IFA",
  "Participating Whole Life",
  "Universal Life",
  "Term Life",
  "Segregated Funds",
];
