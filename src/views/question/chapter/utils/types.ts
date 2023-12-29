
interface AddChapterRequest {
  updateTime?: Date;
  id?: number;
  chapterTitle?:string;
  textbookId?: number;
  sort?:number;
  desc?:string;
  difficulty?:number;
}

interface FormProps {
  formInline: AddChapterRequest;
}

export type { AddChapterRequest, FormProps };
