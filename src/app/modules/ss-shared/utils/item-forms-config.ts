import { FormBuilder, FormGroup } from '@angular/forms';

const FORM_GROUPS_CONFIG: Record<string, string[]> = {
  attractions: ['galleryForm', 'informationForm', 'optionsForm', 'locationForm'],
  restaurants: ['galleryForm', 'informationForm', 'optionsForm', 'locationForm', 'menuForm'],
};

export function createEmptyItemForm(moduleId: string, fb: FormBuilder): FormGroup {
  const subForms = FORM_GROUPS_CONFIG[moduleId] || [];

  const formGroupConfig: Record<string, FormGroup> = {};

  for (const formName of subForms) {
    formGroupConfig[formName] = fb.group({});
  }

  return fb.group(formGroupConfig);
}
