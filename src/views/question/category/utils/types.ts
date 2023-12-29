interface AddCategoryRequest {
  id?: number;
  categoryName?: string;
  state?:number;
  level?:number;
}

interface FormProps {
  formInline: AddCategoryRequest;
}

export type { AddCategoryRequest, FormProps };
