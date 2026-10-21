export interface LectureSummaryItem {
  lectureNumber: number;
  week: number;
  title: string;
  subheadings: string[];
  diagram: string | null;
  content: string;
}

export interface LectureWeekMeta {
  week: number;
  title: string;
  lectures: string;
  description: string;
}

export interface LectureSummariesDatabase {
  course: string;
  courseId: string;
  instructor: string;
  institution: string;
  totalLectures: number;
  weeks: LectureWeekMeta[];
  lectures: LectureSummaryItem[];
}
