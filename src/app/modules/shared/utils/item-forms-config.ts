import { FormBuilder, FormGroup } from '@angular/forms';

const FORM_GROUPS_CONFIG: Record<string, string[]> = {
  attractions: ['galleryForm', 'informationForm', 'optionsForm', 'locationForm', 'foodsForm', 'scheduleForm', 'contactForm'],
  restaurants: ['galleryForm', 'informationForm', 'optionsForm', 'locationForm', 'foodsForm', 'scheduleForm', 'contactForm'],
  hotels: ['galleryForm', 'informationForm', 'optionsForm', 'locationForm', 'scheduleForm', 'contactForm', 'servicesForm'],
  foods: ['galleryForm', 'informationForm', 'optionsForm'],
  events: ['galleryForm', 'informationForm', 'contactForm', 'optionsForm', 'locationForm', 'foodsForm', 'datesForm'],
};

export function createEmptyItemForm(moduleId: string, fb: FormBuilder): FormGroup {
  const subForms = FORM_GROUPS_CONFIG[moduleId] || [];

  const formGroupConfig: Record<string, FormGroup> = {};

  for (const formName of subForms) {
    formGroupConfig[formName] = fb.group({});
  }

  return fb.group(formGroupConfig);
}
