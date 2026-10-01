import { defaultFieldNames, defaultMessages } from "./messages";
import type { FieldNames, ValidationMessages } from "./messages";

export interface ValidationConfig {
  messages: ValidationMessages;
  fieldNames: FieldNames;
}

let currentConfig: ValidationConfig = {
  messages: defaultMessages,
  fieldNames: defaultFieldNames,
};

export const getConfig = (): ValidationConfig => currentConfig;

export const setConfig = (config: Partial<ValidationConfig>): ValidationConfig => {
  currentConfig = {
    ...currentConfig,
    ...config,
    messages: {
      ...currentConfig.messages,
      ...(config.messages ?? {}),
    },
    fieldNames: {
      ...currentConfig.fieldNames,
      ...(config.fieldNames ?? {}),
    },
  };
  return currentConfig;
};

export const resetConfig = (): ValidationConfig => {
  currentConfig = {
    messages: defaultMessages,
    fieldNames: defaultFieldNames,
  };
  return currentConfig;
};

export { defaultFieldNames, defaultMessages };
export type { FieldNames, ValidationMessages };
