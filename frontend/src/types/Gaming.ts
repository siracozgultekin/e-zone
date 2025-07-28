export type PSModel = 'ps3' | 'ps4' | 'ps5';
export type ControllerCount = 2 | 4;

export interface GamingConfig {
  psModel: PSModel;
  controllerCount: ControllerCount;
  hourlyRate: number;
}

export interface PricingRule {
  id: string;
  psModel: PSModel;
  controllerCount: ControllerCount;
  hourlyRate: number;
}