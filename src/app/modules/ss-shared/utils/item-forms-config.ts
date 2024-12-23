import { FormBuilder, FormGroup } from '@angular/forms';

const FORM_GROUPS_CONFIG: Record<string, string[]> = {
  attractions: ['galleryForm', 'informationForm', 'optionsForm', 'locationForm', 'foodsForm', 'scheduleForm'],
  restaurants: ['galleryForm', 'informationForm', 'optionsForm', 'locationForm', 'foodsForm', 'scheduleForm', 'deliveryForm'],
  hotels: ['galleryForm', 'informationForm', 'optionsForm', 'locationForm', 'scheduleForm'],
  foods: ['galleryForm', 'informationForm', 'optionsForm'],
  events: ['galleryForm', 'informationForm', 'optionsForm', 'locationForm', 'foodsForm', 'dateSettingForm'],
};

export function createEmptyItemForm(moduleId: string, fb: FormBuilder): FormGroup {
  const subForms = FORM_GROUPS_CONFIG[moduleId] || [];

  const formGroupConfig: Record<string, FormGroup> = {};

  for (const formName of subForms) {
    formGroupConfig[formName] = fb.group({});
  }

  return fb.group(formGroupConfig);
}
