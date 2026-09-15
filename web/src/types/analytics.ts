export interface TopicMetric {
  unit: number;
  topic: string;
  recurrence_rate: number;
  yield_category: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'EMERGING';
  avg_marks_per_exam: number;
  exam_frequency_trend: string;
  core_concepts: string[];
}

export interface UnitDefinition {
  unit_num: number;
  title: string;
  topics: string[];
}

export interface SubjectAnalytics {
  subject_id: string;
  primary_code: string;
  aliased_codes: string[];
  name: string;
  structure: string;
  credits: number;
  course_outcomes: string[];
  textbooks: string[];
  units: UnitDefinition[];
  unit_weightage_midsem: Record<string, number>;
  unit_weightage_endsem: Record<string, number>;
  topic_metrics: TopicMetric[];
  exam_strategy_notes: string[];
  total_questions_indexed: number;
}

export interface AnalyticsData {
  metadata: {
    generated_at: string;
    curator: string;
    historical_data_span: string;
    total_subjects: number;
  };
  subjects: Record<string, SubjectAnalytics>;
}
