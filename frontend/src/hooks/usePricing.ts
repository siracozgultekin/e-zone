// hooks/usePricing.ts
import { useState, useEffect } from 'react';
import type { PricingRule, PSModel, ControllerCount } from '../types/Gaming';

// Varsayılan fiyatlandırma kuralları
const defaultPricingRules: PricingRule[] = [
  { id: 'ps3-2', psModel: 'ps3', controllerCount: 2, hourlyRate: 80 },
  { id: 'ps3-4', psModel: 'ps3', controllerCount: 4, hourlyRate: 120 },
  { id: 'ps4-2', psModel: 'ps4', controllerCount: 2, hourlyRate: 100 },
  { id: 'ps4-4', psModel: 'ps4', controllerCount: 4, hourlyRate: 150 },
  { id: 'ps5-2', psModel: 'ps5', controllerCount: 2, hourlyRate: 130 },
  { id: 'ps5-4', psModel: 'ps5', controllerCount: 4, hourlyRate: 180 },
];

const STORAGE_KEY = 'cafe-pricing-rules';

export function usePricing() {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultPricingRules;
    } catch {
      return defaultPricingRules;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pricingRules));
  }, [pricingRules]);

  const updatePricing = (updatedRule: PricingRule) => {
    setPricingRules(prev => 
      prev.map(rule => rule.id === updatedRule.id ? updatedRule : rule)
    );
  };

  const getHourlyRate = (psModel: PSModel, controllerCount: ControllerCount): number => {
    const rule = pricingRules.find(
      r => r.psModel === psModel && r.controllerCount === controllerCount
    );
    return rule?.hourlyRate || 100; // Varsayılan ücret
  };

  const getPricingRule = (psModel: PSModel, controllerCount: ControllerCount): PricingRule | undefined => {
    return pricingRules.find(
      r => r.psModel === psModel && r.controllerCount === controllerCount
    );
  };

  return {
    pricingRules,
    updatePricing,
    getHourlyRate,
    getPricingRule,
  };
}